const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createClient } = require('@supabase/supabase-js');
const {
  PRECISE_COORD_QUALITY,
  hasFiniteCoords,
  isRomeFallback,
  plausibleDurationHours
} = require('../scraper');

const DISTANCE_KM_MAX = 99999.99;
const COST_AMOUNT_MAX = 99999999.99;
const ELEVATION_M_MAX = 2147483647;
const DAYS_MAX = 32767;

const DATA_FILE = path.join(__dirname, '..', 'data', 'excursions.json');
const REGISTRY_FILE = path.join(__dirname, '..', 'data', 'cai-sections.json');
const STATUS_FILE = path.join(__dirname, '..', 'data', 'scrape-status.json');
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BATCH_SIZE = 200;

function requiredEnvironment(name, env = process.env) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function textOrNull(value) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text || null;
}

function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function boundedNumber(value, max) {
  const number = numberOrNull(value);
  if (number == null || number < 0 || number > max) return null;
  return number;
}

function importStatus(env = process.env) {
  const status = env.SUPABASE_IMPORT_STATUS ?? 'draft';
  if (status !== 'draft' && status !== 'published') {
    throw new Error('SUPABASE_IMPORT_STATUS must be either "draft" or "published"');
  }
  return status;
}

function chunk(items, size = BATCH_SIZE) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

async function existingPlaces(supabase, sourceIds) {
  const found = new Map();
  for (const batch of chunk(sourceIds)) {
    const { data, error } = await supabase
      .from('places')
      .select('source_id, latitude, longitude, coordinates_quality, status, organizer_region, cai_section_id')
      .in('source_id', batch);
    if (error) throw error;
    for (const row of data || []) {
      if (row.source_id) found.set(row.source_id, row);
    }
  }
  return found;
}

function coordPatchForExisting(existing, excursion) {
  if (!existing) return null;
  if (PRECISE_COORD_QUALITY.has(existing.coordinates_quality)) return null;
  const existingHasCoords = Number.isFinite(existing.latitude) && Number.isFinite(existing.longitude);
  const existingIsRomeFallback = existingHasCoords
    && isRomeFallback(existing.latitude, existing.longitude);
  if (!hasFiniteCoords(excursion)) {
    return existingIsRomeFallback ? {
      latitude: null,
      longitude: null,
      coordinates_quality: null
    } : null;
  }
  if (isRomeFallback(excursion.lat, excursion.lng)) return null;
  if (existingHasCoords && !existingIsRomeFallback) return null;

  return {
    latitude: excursion.lat,
    longitude: excursion.lng,
    coordinates_quality: textOrNull(excursion.coordinatesQuality) || 'massif'
  };
}

async function importNewPlaces({ supabase, excursions, status }) {
  let skippedUnlocated = 0;
  const sourceIds = excursions.map((excursion) => textOrNull(excursion.id)).filter(Boolean);
  const existing = await existingPlaces(supabase, sourceIds);

  const toInsert = [];
  const toUpdate = [];

  for (const excursion of excursions) {
    const sourceId = textOrNull(excursion.id);
    if (!sourceId) continue;

    const row = existing.get(sourceId);
    if (!row) {
      toInsert.push(toPlaceRow(excursion, status));
      continue;
    }

    const patch = coordPatchForExisting(row, excursion) || {};
    // Enrich organizer metadata without overwriting editorial title/status/photos.
    if (!row.organizer_region && textOrNull(excursion.organizerRegion)) {
      patch.organizer_region = excursion.organizerRegion.trim();
    }
    if (!row.cai_section_id && textOrNull(excursion.caiSectionId || excursion.sourceId)) {
      patch.cai_section_id = (excursion.caiSectionId || excursion.sourceId).trim();
    }
    if (Object.keys(patch).length) toUpdate.push({ sourceId, patch });
  }

  for (const batch of chunk(toInsert)) {
    const { error } = await supabase.from('places').insert(batch);
    if (error) throw error;
  }

  for (const item of toUpdate) {
    const { error } = await supabase
      .from('places')
      .update(item.patch)
      .eq('source_id', item.sourceId);
    if (error) throw error;
  }

  return {
    inserted: toInsert.length,
    updated: toUpdate.length,
    skipped: existing.size - toUpdate.length,
    skippedUnlocated,
    status
  };
}

function toPlaceRow(excursion, status) {
  const sourceId = textOrNull(excursion.id);
  const title = textOrNull(excursion.title);
  const date = textOrNull(excursion.date);
  const externalUrl = textOrNull(excursion.link);
  const location = textOrNull(excursion.location) || 'Località da verificare sul programma CAI';
  if (!sourceId || !title || !date || !externalUrl || !location) {
    throw new Error(`Excursion ${sourceId ?? '(unknown)'} is missing an id, title, date, link, or location`);
  }
  let parsedUrl;
  try { parsedUrl = new URL(externalUrl); } catch { throw new Error(`Excursion ${sourceId} has an invalid link`); }
  if (!['https:', 'http:'].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new Error(`Excursion ${sourceId} has an invalid link`);
  }

  const titleSlug = slugify(title).slice(0, 80).replace(/-+$/g, '') || 'itinerario';
  const suffix = slugify(sourceId);
  return {
    source_id: sourceId,
    slug: `${titleSlug}-${suffix}`,
    title,
    date,
    date_end: textOrNull(excursion.dateEnd),
    days: Number.isInteger(excursion.days) && excursion.days > 0 && excursion.days <= DAYS_MAX
      ? excursion.days
      : null,
    category: textOrNull(excursion.category) ?? 'ND',
    external_url: externalUrl,
    organizer: textOrNull(excursion.organizer) ?? 'Sezione CAI',
    organizer_region: textOrNull(excursion.organizerRegion),
    cai_section_id: textOrNull(excursion.caiSectionId || excursion.sourceId),
    location,
    municipality: textOrNull(excursion.municipality),
    province: textOrNull(excursion.province),
    region: textOrNull(excursion.region),
    latitude: hasFiniteCoords(excursion) ? numberOrNull(excursion.lat) : null,
    longitude: hasFiniteCoords(excursion) ? numberOrNull(excursion.lng) : null,
    cost: textOrNull(excursion.cost),
    cost_amount: boundedNumber(excursion.costAmount, COST_AMOUNT_MAX),
    time: textOrNull(excursion.time),
    distance_km: boundedNumber(excursion.distanceKm, DISTANCE_KM_MAX),
    elevation_m: boundedNumber(excursion.elevationM, ELEVATION_M_MAX),
    duration_hours: numberOrNull(plausibleDurationHours(excursion.durationHours)),
    mountain_group: textOrNull(excursion.mountainGroup),
    transport: textOrNull(excursion.transport),
    private_car: typeof excursion.privateCar === 'boolean' ? excursion.privateCar : null,
    start_place: textOrNull(excursion.startPlace),
    coordinates_quality: textOrNull(excursion.coordinatesQuality),
    summary: textOrNull(excursion.summary),
    activity_type: textOrNull(excursion.activityType),
    terrain: textOrNull(excursion.terrain),
    difficulty_note: textOrNull(excursion.difficultyNote),
    cover_image_path: null,
    status
  };
}

function sectionToRow(section, sourceStatus = {}, generatedAt = null) {
  return {
    id: section.id,
    name: section.organizer || section.name,
    organizer_region: textOrNull(section.region),
    directory_id: section.directoryId == null ? null : String(section.directoryId),
    section_type: textOrNull(section.sectionType),
    parent_section_id: textOrNull(section.parentSectionId),
    website_url: textOrNull(section.website),
    directory_url: textOrNull(section.directoryUrl),
    calendar_urls: Array.isArray(section.calendarUrls) ? section.calendarUrls : [],
    adapter: textOrNull(section.template || section.extractor),
    discovery_status: section.status || (section.enabled ? 'verified' : 'pending'),
    scrape_status: textOrNull(sourceStatus.status),
    event_count: Number.isInteger(sourceStatus.excursions) ? sourceStatus.excursions : (sourceStatus.eventCount || 0),
    checked_at: section.checkedAt || generatedAt,
    updated_at: new Date().toISOString()
  };
}

function sectionUpsertRow(section, sourceStatus = {}, generatedAt = null) {
  // Registry sync must not reset discovery_status / primary_url: those are enriched by
  // scrape + discovery jobs (Scraper Url / Lazio coverage). Strip them from upsert payloads
  // so existing rows keep admin/discovery values; new rows still get DB defaults ('pending').
  const row = sectionToRow(section, sourceStatus, generatedAt);
  delete row.discovery_status;
  delete row.primary_url;
  return row;
}

async function importSections({ supabase, registry, scrapeStatus = {} }) {
  const statuses = new Map((scrapeStatus.sources || []).map((row) => [row.id, row]));
  const rows = (registry.sections || []).map((section) => sectionUpsertRow(section, statuses.get(section.id), registry.generatedAt));
  for (const batch of chunk(rows)) {
    const { error } = await supabase.from('cai_sections').upsert(batch, { onConflict: 'id' });
    if (error) throw error;
  }
  return rows.length;
}

function attachSectionMetadata(excursions, sources) {
  const byOrganizer = new Map(sources.map((source) => [source.organizer, source]));
  return excursions.map((excursion) => {
    const source = byOrganizer.get(excursion.organizer);
    return source ? { ...excursion, caiSectionId: source.id, organizerRegion: source.region || excursion.organizerRegion } : excursion;
  });
}

function readExcursions(file = DATA_FILE) {
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  return excursionsFromPayload(payload);
}

function excursionsFromPayload(payload) {
  if (!Array.isArray(payload.excursions)) throw new Error('Expected an "excursions" array in the source JSON');
  return payload.excursions;
}

function verifyImportManifest(manifestFile, requiredFiles = [DATA_FILE], repoRoot = REPO_ROOT) {
  if (!manifestFile) throw new Error('An import manifest path is required');
  const manifestPath = path.resolve(manifestFile);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.version !== 1) throw new Error('Import manifest version must be 1');
  if (typeof manifest.runId !== 'string' || !manifest.runId.trim()
    || typeof manifest.createdAt !== 'string' || !Number.isFinite(Date.parse(manifest.createdAt))) {
    throw new Error('Import manifest must include a runId and valid createdAt timestamp');
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error('Import manifest must contain a non-empty "files" array');
  }

  const verified = new Map();
  for (const entry of manifest.files) {
    if (!entry || typeof entry.path !== 'string' || !/^[a-f0-9]{64}$/i.test(entry.sha256 || '')) {
      throw new Error('Each import manifest file needs a path and a 64-character SHA-256 checksum');
    }
    // Handoff paths are repo-root-relative so the orchestrator and importer share
    // one stable manifest format regardless of the manifest's own directory.
    const file = path.resolve(repoRoot, entry.path);
    const relativePath = path.relative(repoRoot, file);
    if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
      throw new Error(`Manifest path must stay inside the repository: ${entry.path}`);
    }
    if (!fs.statSync(file).isFile()) throw new Error(`Manifest file is not a regular file: ${entry.path}`);
    const bytes = fs.readFileSync(file);
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    if (actual.toLowerCase() !== entry.sha256.toLowerCase()) {
      throw new Error(`Import manifest checksum mismatch: ${entry.path}`);
    }
    verified.set(file, bytes);
  }

  for (const requiredFile of requiredFiles) {
    if (!verified.has(path.resolve(requiredFile))) {
      throw new Error(`Import manifest does not cover required file: ${path.resolve(requiredFile)}`);
    }
  }
  return { files: verified.size, manifestPath, snapshots: verified };
}

function manifestArgument(argv = process.argv.slice(2), env = process.env) {
  const index = argv.indexOf('--manifest');
  if (index !== -1) {
    if (!argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('--manifest requires a file path');
    return argv[index + 1];
  }
  return env.SUPABASE_IMPORT_MANIFEST || null;
}

async function main({ argv = process.argv.slice(2), env = process.env } = {}) {
  const manifestPath = manifestArgument(argv, env);
  let snapshots = null;
  if (manifestPath) {
    const requiredFiles = [DATA_FILE, REGISTRY_FILE, STATUS_FILE];
    const result = verifyImportManifest(manifestPath, requiredFiles);
    snapshots = result.snapshots;
    console.log(`Verified ${result.files} source file checksums from ${result.manifestPath}`);
  }

  // Parse and validate the exact verified bytes before any network client is created.
  const excursionsPayload = snapshots
    ? JSON.parse(snapshots.get(path.resolve(DATA_FILE)).toString('utf8'))
    : JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const excursions = excursionsFromPayload(excursionsPayload);
  const registry = snapshots
    ? JSON.parse(snapshots.get(path.resolve(REGISTRY_FILE)).toString('utf8'))
    : fs.existsSync(REGISTRY_FILE) ? JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8')) : null;
  const scrapeStatus = snapshots
    ? JSON.parse(snapshots.get(path.resolve(STATUS_FILE)).toString('utf8'))
    : fs.existsSync(STATUS_FILE) ? JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8')) : { sources: [] };
  if (registry && !Array.isArray(registry.sections)) {
    throw new Error('Expected a "sections" array in the CAI registry JSON');
  }
  if (!Array.isArray(scrapeStatus.sources)) {
    throw new Error('Expected a "sources" array in the scrape status JSON');
  }
  const status = importStatus(env);

  const supabase = createClient(
    requiredEnvironment('SUPABASE_URL', env),
    requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY', env),
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
  );
  const { SOURCES } = require('../sources');
  let importedSections = 0;
  if (registry) {
    importedSections = await importSections({
      supabase,
      registry,
      scrapeStatus
    });
    console.log(`Imported ${importedSections} CAI registry entries`);
  }
  const result = await importNewPlaces({
    supabase,
    excursions: attachSectionMetadata(excursions, SOURCES),
    status
  });
  console.log(
    `inserted ${result.inserted}, updated ${result.updated} coordinates/organizer metadata, skipped ${result.skipped} existing`
    + `${result.skippedUnlocated ? `, skipped ${result.skippedUnlocated} without coordinates` : ''}`
    + ` as ${result.status}`
  );
  return { sections: importedSections, ...result };
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Supabase import failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  BATCH_SIZE,
  main,
  coordPatchForExisting,
  importNewPlaces,
  importStatus,
  importSections,
  sectionToRow,
  sectionUpsertRow,
  attachSectionMetadata,
  readExcursions,
  verifyImportManifest,
  manifestArgument,
  slugify,
  toPlaceRow
};
