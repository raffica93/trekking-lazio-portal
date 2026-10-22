const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { createClient } = require('@supabase/supabase-js');
const { MODEL, isVerifiedResponseModel } = require('../adapters/mercury-decide');
const { eventsFrom: classificationEventsFrom, validClassification } = require('./classify-catalog');
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
      .select('source_id, latitude, longitude, coordinates_quality, status, organizer_region, cai_section_id, title, cover_image_path')
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
  assertUniqueSourceIds(excursions);
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
    insertedSourceIds: toInsert.map((row) => row.source_id),
    existingSourceIds: [...existing.keys()],
    updatedSourceIds: toUpdate.map((item) => item.sourceId),
    existingProtectedFields: Object.fromEntries([...existing].map(([sourceId, row]) => [sourceId, {
      title: row.title ?? null,
      status: row.status ?? null,
      cover_image_path: row.cover_image_path ?? null
    }])),
    updated: toUpdate.length,
    skipped: existing.size - toUpdate.length,
    skippedUnlocated,
    status
  };
}

function assertUniqueSourceIds(excursions) {
  if (!Array.isArray(excursions)) throw new Error('Expected an excursions array');
  const seen = new Set();
  for (const excursion of excursions) {
    const sourceId = textOrNull(excursion?.id);
    if (!sourceId) throw new Error('Every excursion needs a non-empty source_id');
    if (seen.has(sourceId)) throw new Error(`Duplicate source_id in import files: ${sourceId}`);
    seen.add(sourceId);
  }
}

function validDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateImportEvents(excursions, status) {
  assertUniqueSourceIds(excursions);
  return excursions.map((excursion) => {
    if (!validDateOnly(excursion.date)
      || (excursion.dateEnd != null
        && (!validDateOnly(excursion.dateEnd) || excursion.dateEnd < excursion.date))) {
      throw new Error(`Excursion ${excursion.id} has an invalid date range`);
    }
    return toPlaceRow(excursion, status);
  });
}

const CLASSIFICATION_DECISIONS = new Set(['trekking', 'non_trekking', 'da_verificare']);
const CLASSIFICATION_CATEGORIES = new Set([
  'a piedi', 'ciaspole', 'alpinismo/ferrata', 'bici', 'sci',
  'sociale/culturale', 'corso/riunione', 'altro'
]);
const CLASSIFICATION_METHODS = new Set(['rules-v1', 'mercury-decide']);

function classificationToRow(sourceId, classification) {
  if (!classification || typeof classification !== 'object') return null;
  if (Object.hasOwn(classification, 'error') || classification.valid === false) {
    throw new Error(`Excursion ${sourceId} has an error or invalid classification response`);
  }
  const {
    decision, category, confidence, probability, method,
    modelRequested,
    responseModel = null,
    modelAttested,
    policyVersion, modelVersion, rationale, evidenceOriginal,
    fingerprint
  } = classification;
  if (method === 'mercury-decide'
    && typeof rationale === 'string'
    && rationale.startsWith('Classificazione automatica non disponibile;')) {
    throw new Error(`Excursion ${sourceId} has a Mercury provider failure, not a classification result`);
  }
  const validProbability = (value) => value === null
    || (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1);
  if (!CLASSIFICATION_DECISIONS.has(decision)
    || classification.source_id !== sourceId
    || !CLASSIFICATION_CATEGORIES.has(category)
    || !CLASSIFICATION_METHODS.has(method)
    || typeof policyVersion !== 'string' || !policyVersion.trim()
    || (modelVersion !== null && (typeof modelVersion !== 'string' || !modelVersion.trim()))
    || (typeof rationale !== 'string' || !rationale.trim())
    || (typeof evidenceOriginal !== 'string' || !evidenceOriginal.trim())
    || typeof fingerprint !== 'string' || !fingerprint.trim()
    || !validProbability(confidence) || !validProbability(probability)
    || (modelRequested !== null && (typeof modelRequested !== 'string' || !modelRequested.trim()))
    || (responseModel !== null && (typeof responseModel !== 'string' || !responseModel.trim()))
    || typeof modelAttested !== 'boolean'
    || (modelAttested && responseModel == null)
    || (!modelAttested && responseModel !== null)) {
    throw new Error(`Excursion ${sourceId} has an invalid classification`);
  }
  if (method === 'mercury-decide' && modelRequested !== MODEL) {
    throw new Error(`Excursion ${sourceId} has an unexpected requested Mercury model`);
  }
  if (method === 'mercury-decide'
    && (responseModel !== null && !isVerifiedResponseModel(responseModel)
      || modelAttested !== isVerifiedResponseModel(responseModel)
      || modelVersion !== (modelAttested ? responseModel : null))) {
    throw new Error(`Excursion ${sourceId} has inconsistent Mercury model attestation`);
  }
  if (method === 'rules-v1' && (modelRequested !== null || responseModel !== null || modelAttested || modelVersion !== null)) {
    throw new Error(`Excursion ${sourceId} has unexpected model metadata for rules-v1`);
  }
  return {
    source_id: sourceId,
    decision,
    category: category.trim(),
    confidence,
    probability,
    rationale: rationale.trim(),
    evidence_original: evidenceOriginal.trim(),
    fingerprint: fingerprint.trim(),
    method,
    model_requested: modelRequested,
    response_model: responseModel,
    model_attested: modelAttested,
    policy_version: policyVersion.trim(),
    model_version: modelVersion?.trim() ?? null
  };
}

function prepareClassifications(excursions) {
  const rows = [];
  const skipped = [];
  for (const excursion of excursions) {
    if (!excursion.classification || typeof excursion.classification !== 'object') continue;
    try {
      const row = classificationToRow(textOrNull(excursion.id), excursion.classification);
      if (row) rows.push(row);
    } catch (error) {
      skipped.push({ source_id: textOrNull(excursion.id), reason: error.message });
    }
  }
  return { rows, skipped };
}

async function upsertClassifications({ supabase, excursions = [], rows = prepareClassifications(excursions).rows }) {
  for (const batch of chunk(rows)) {
    const { error } = await supabase.from('place_classifications').upsert(batch, { onConflict: 'source_id' });
    if (error) throw error;
  }
  return rows.length;
}

// Classification-only first loads must never update an existing decision. Read all
// conflicts first, then insert missing source_ids with ON CONFLICT DO NOTHING semantics.
async function insertMissingClassifications({ supabase, rows = [] }) {
  const fields = 'source_id';
  const existingIds = new Set();
  for (const batch of chunk(rows.map((row) => row.source_id))) {
    const { data, error } = await supabase.from('place_classifications').select(fields).in('source_id', batch);
    if (error) throw error;
    for (const row of data || []) existingIds.add(row.source_id);
  }
  const preservedSourceIds = [...existingIds];
  const missing = rows.filter((row) => !existingIds.has(row.source_id));
  const insertedIds = new Set();
  for (const batch of chunk(missing)) {
    const { data, error } = await supabase.from('place_classifications').upsert(batch, {
      onConflict: 'source_id', ignoreDuplicates: true
    }).select('source_id');
    if (error) throw error;
    for (const row of data || []) insertedIds.add(row.source_id);
  }
  const verification = await reconcileClassifications({ supabase, rows });
  const concurrentConflictIds = missing.map((row) => row.source_id).filter((sourceId) => !insertedIds.has(sourceId));
  return {
    attempted: rows.length,
    insertAttempts: missing.length,
    insertedSourceIds: [...insertedIds],
    matched: verification.matched,
    preservedSourceIds,
    concurrentConflictIds,
    mismatchedSourceIds: verification.mismatchedSourceIds
  };
}

async function reconcileClassifications({ supabase, excursions = [], rows = prepareClassifications(excursions).rows }) {
  const expected = rows;
  const fields = 'source_id, decision, category, confidence, probability, rationale, evidence_original, fingerprint, method, model_requested, response_model, model_attested, policy_version, model_version';
  const found = new Map();
  for (const batch of chunk(expected.map((row) => row.source_id))) {
    const { data, error } = await supabase.from('place_classifications').select(fields).in('source_id', batch);
    if (error) throw error;
    for (const row of data || []) found.set(row.source_id, row);
  }
  const mismatchedSourceIds = [];
  const fieldsToCompare = fields.split(', ');
  for (const expectedRow of expected) {
    const row = found.get(expectedRow.source_id);
    if (!row || fieldsToCompare.some((field) => (row[field] ?? null) !== (expectedRow[field] ?? null))) {
      mismatchedSourceIds.push(expectedRow.source_id);
    }
  }
  return {
    expected: expected.length,
    matched: expected.length - mismatchedSourceIds.length,
    mismatchedSourceIds
  };
}

async function reconcileImportedPlaces({ supabase, excursions, imported, status }) {
  const expected = validateImportEvents(excursions, status);
  const expectedById = new Map(expected.map((row) => [row.source_id, row]));
  const after = await existingPlaces(supabase, [...expectedById.keys()]);
  const missingSourceIds = [...expectedById.keys()].filter((id) => !after.has(id));
  const insertedIds = new Set(imported.insertedSourceIds);
  const protectedFieldsChanged = [];
  const insertedFieldMismatches = [];
  for (const [sourceId, row] of after) {
    const before = imported.existingProtectedFields[sourceId];
    if (before && (before.title !== (row.title ?? null)
      || before.status !== (row.status ?? null)
      || before.cover_image_path !== (row.cover_image_path ?? null))) {
      protectedFieldsChanged.push(sourceId);
    }
    if (insertedIds.has(sourceId)) {
      const expectedRow = expectedById.get(sourceId);
      if (row.title !== expectedRow.title || row.status !== status
        || (row.cover_image_path ?? null) !== null) insertedFieldMismatches.push(sourceId);
    }
  }
  const matchedRows = [...after.values()];
  const result = {
    expectedSourceIds: expectedById.size,
    matchedSourceIds: matchedRows.length,
    publishedSourceIds: matchedRows.filter((row) => row.status === 'published').length,
    draftSourceIds: matchedRows.filter((row) => row.status === 'draft').length,
    missingSourceIds,
    protectedFieldsChanged,
    insertedFieldMismatches
  };
  if (missingSourceIds.length || protectedFieldsChanged.length || insertedFieldMismatches.length) {
    throw new Error(`Import reconciliation failed: ${JSON.stringify({
      missing: missingSourceIds.length,
      protectedFieldsChanged: protectedFieldsChanged.length,
      insertedFieldMismatches: insertedFieldMismatches.length
    })}`);
  }
  return result;
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
  const manifestBytes = fs.readFileSync(manifestPath);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
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
    if (verified.has(file)) throw new Error(`Import manifest contains a duplicate file path: ${entry.path}`);
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
  return {
    files: verified.size,
    manifestPath,
    manifest,
    manifestSha256: crypto.createHash('sha256').update(manifestBytes).digest('hex'),
    snapshots: verified
  };
}

function manifestArgument(argv = process.argv.slice(2), env = process.env) {
  const index = argv.indexOf('--manifest');
  if (index !== -1) {
    if (!argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('--manifest requires a file path');
    return argv[index + 1];
  }
  return env.SUPABASE_IMPORT_MANIFEST || null;
}

function classificationManifestArgument(argv = process.argv.slice(2), env = process.env) {
  const index = argv.indexOf('--classification-manifest');
  if (index !== -1) {
    if (!argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('--classification-manifest requires a file path');
    return argv[index + 1];
  }
  return env.SUPABASE_CLASSIFICATION_MANIFEST || null;
}

function verifyReadyClassificationRun({ manifestPath, repoRoot = REPO_ROOT }) {
  if (!manifestPath) throw new Error('Classification-only import requires --classification-manifest <path>');
  const resolvedManifest = path.resolve(manifestPath);
  const runDir = path.dirname(resolvedManifest);
  const allowedRuns = path.resolve(repoRoot, 'backend/data/agent-runs');
  if (runDir !== allowedRuns && !runDir.startsWith(`${allowedRuns}${path.sep}`)) {
    throw new Error('Classification run manifest must be inside backend/data/agent-runs');
  }
  const manifestBytes = fs.readFileSync(resolvedManifest);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  if (manifest.version !== 1 || typeof manifest.runId !== 'string' || !manifest.runId.trim()
    || !manifest.input || typeof manifest.input.path !== 'string'
    || !/^[a-f0-9]{64}$/i.test(manifest.input.sha256 || '')
    || !Array.isArray(manifest.files)) {
    throw new Error('Classification manifest is missing run, input, or file integrity metadata');
  }
  const allowedFiles = new Set(['classified-catalog.json', 'state.json']);
  const verifiedFiles = new Map();
  for (const entry of manifest.files) {
    if (!entry || !allowedFiles.has(entry.path) || !/^[a-f0-9]{64}$/i.test(entry.sha256 || '')) {
      throw new Error('Classification manifest contains an invalid output file entry');
    }
    if (verifiedFiles.has(entry.path)) throw new Error(`Duplicate classification manifest file: ${entry.path}`);
    const bytes = fs.readFileSync(path.join(runDir, entry.path));
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    if (actual.toLowerCase() !== entry.sha256.toLowerCase()) throw new Error(`Classification manifest checksum mismatch: ${entry.path}`);
    if (entry.bytes != null && entry.bytes !== bytes.length) throw new Error(`Classification manifest byte count mismatch: ${entry.path}`);
    verifiedFiles.set(entry.path, bytes);
  }
  if (verifiedFiles.size !== 2 || !verifiedFiles.has('classified-catalog.json') || !verifiedFiles.has('state.json')) {
    throw new Error('Classification manifest must seal classified-catalog.json and state.json');
  }
  const state = JSON.parse(verifiedFiles.get('state.json').toString('utf8'));
  if (state.runId !== manifest.runId || state.status !== 'ready'
    || state.inputSha256 !== manifest.input.sha256 || state.errors?.length
    || state.completed !== state.total || state.processed !== state.total) {
    throw new Error('Classification batch must have matching runId, status=ready, full completion, and zero errors');
  }
  const inputPath = path.resolve(manifest.input.path);
  if (state.input && path.resolve(state.input) !== inputPath) {
    throw new Error('Classification state input path does not match the sealed manifest');
  }
  const inputBytes = fs.readFileSync(inputPath);
  const inputSha256 = crypto.createHash('sha256').update(inputBytes).digest('hex');
  if (inputSha256.toLowerCase() !== manifest.input.sha256.toLowerCase()) {
    throw new Error('Classification manifest input checksum mismatch');
  }
  const inputEvents = classificationEventsFrom(JSON.parse(inputBytes.toString('utf8')));
  const outputEvents = classificationEventsFrom(JSON.parse(verifiedFiles.get('classified-catalog.json').toString('utf8')));
  if (!inputEvents.length || inputEvents.length !== outputEvents.length || state.total !== inputEvents.length) {
    throw new Error('Sealed classification output does not cover the complete input catalog');
  }
  const rows = outputEvents.map((event, index) => {
    const sourceId = String(event.source_id || event.id || '').trim();
    const inputSourceId = String(inputEvents[index].source_id || inputEvents[index].id || '').trim();
    if (!sourceId || sourceId !== inputSourceId || !validClassification(inputEvents[index], event.classification)) {
      throw new Error(`Invalid or misaligned classification in sealed run for source_id ${sourceId || inputSourceId || '(missing)'}`);
    }
    return classificationToRow(sourceId, event.classification);
  });
  return {
    manifest,
    manifestPath: resolvedManifest,
    manifestSha256: crypto.createHash('sha256').update(manifestBytes).digest('hex'),
    inputSha256,
    outputSha256: crypto.createHash('sha256').update(verifiedFiles.get('classified-catalog.json')).digest('hex'),
    rows
  };
}

function verifyReadyRunState({ manifest, manifestPath, repoRoot = REPO_ROOT }) {
  const statePath = path.join(path.dirname(manifestPath), 'state.json');
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const expectedManifest = path.relative(repoRoot, manifestPath).split(path.sep).join('/');
  const declaredManifest = typeof state.manifest === 'string'
    ? path.resolve(repoRoot, state.manifest)
    : null;
  if (state.runId !== manifest.runId) {
    throw new Error('Import manifest runId does not match adjacent state.json');
  }
  if (state.files !== 'ready') {
    throw new Error('Database import requires files=ready in adjacent state.json');
  }
  if (!declaredManifest || declaredManifest !== path.resolve(manifestPath)) {
    throw new Error(`state.json does not reference the verified manifest: ${expectedManifest}`);
  }
  return state;
}

function projectRefFromUrl(value) {
  try {
    const host = new URL(value).hostname;
    return host.endsWith('.supabase.co') ? host.slice(0, -'.supabase.co'.length) : null;
  } catch {
    return null;
  }
}

function sourceCommit(repoRoot = REPO_ROOT) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch {
    return null;
  }
}

function writeJsonAtomic(file, value) {
  const temporary = `${file}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  fs.renameSync(temporary, file);
}

function buildImportReceipt({ manifest, manifestPath, manifestSha256, projectRef, imported, verification, classificationVerification, skippedClassifications = [], registrySyncPerformed, repoRoot = REPO_ROOT, verifiedAt = new Date().toISOString() }) {
  return {
    schemaVersion: 1,
    status: 'completed',
    runId: manifest.runId,
    projectRef,
    method: 'supabase-js',
    sourceCommit: sourceCommit(repoRoot),
    manifestPath: path.relative(repoRoot, manifestPath).split(path.sep).join('/'),
    manifestSha256,
    verifiedAt,
    verificationEvidencePath: path.relative(repoRoot, path.join(path.dirname(manifestPath), 'db-verification.json')).split(path.sep).join('/'),
    inserted: imported.inserted,
    existingPreserved: imported.existingSourceIds.length,
    updatedMetadata: imported.updated,
    classifications: classificationVerification.expected,
    skippedClassifications: skippedClassifications.length,
    registrySyncPerformed,
    verification: {
      expectedSourceIds: verification.expectedSourceIds,
      matchedSourceIds: verification.matchedSourceIds,
      publishedSourceIds: verification.publishedSourceIds,
      draftSourceIds: verification.draftSourceIds,
      missingSourceIds: verification.missingSourceIds.length,
      protectedFieldsChanged: verification.protectedFieldsChanged.length,
      insertedFieldMismatches: verification.insertedFieldMismatches.length
    },
    classificationVerification: {
      expected: classificationVerification.expected,
      matched: classificationVerification.matched,
      mismatched: classificationVerification.mismatchedSourceIds.length,
      skipped: skippedClassifications
    },
    remoteReceiptCommit: null
  };
}

async function main({
  argv = process.argv.slice(2),
  env = process.env,
  supabaseFactory = createClient,
  files = { data: DATA_FILE, registry: REGISTRY_FILE, status: STATUS_FILE, repoRoot: REPO_ROOT },
  now = () => new Date().toISOString()
} = {}) {
  if (argv.includes('--classifications-only')) {
    const classificationRun = verifyReadyClassificationRun({
      manifestPath: classificationManifestArgument(argv, env),
      repoRoot: files.repoRoot
    });
    const supabase = supabaseFactory(
      requiredEnvironment('SUPABASE_URL', env),
      requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY', env),
      { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
    );
    const result = await insertMissingClassifications({ supabase, rows: classificationRun.rows });
    const byDecision = { trekking: 0, non_trekking: 0, da_verificare: 0 };
    const byCategory = Object.fromEntries([...CLASSIFICATION_CATEGORIES].map((category) => [category, 0]));
    for (const row of classificationRun.rows) {
      byDecision[row.decision] += 1;
      byCategory[row.category] += 1;
    }
    const receipt = {
      schemaVersion: 1,
      status: result.mismatchedSourceIds.length ? 'partial' : 'completed',
      mode: 'classification-only',
      runId: classificationRun.manifest.runId,
      projectRef: projectRefFromUrl(requiredEnvironment('SUPABASE_URL', env)),
      sourceCommit: sourceCommit(files.repoRoot),
      manifestPath: path.relative(files.repoRoot, classificationRun.manifestPath).split(path.sep).join('/'),
      manifestSha256: classificationRun.manifestSha256,
      inputSha256: classificationRun.inputSha256,
      outputSha256: classificationRun.outputSha256,
      verifiedAt: now(),
      classifications: {
        input: classificationRun.rows.length,
        inserted: result.insertedSourceIds.length,
        preexistingPreserved: result.preservedSourceIds.length,
        concurrentPreserved: result.concurrentConflictIds.length,
        matched: result.matched,
        mismatched: result.mismatchedSourceIds,
        excluded: byDecision.non_trekking,
        review: byDecision.da_verificare,
        errors: result.mismatchedSourceIds.length,
        byDecision,
        byCategory
      },
      placesTouched: false,
      sectionsTouched: false
    };
    const receiptPath = path.join(path.dirname(classificationRun.manifestPath), 'classification-import-receipt.json');
    writeJsonAtomic(receiptPath, receipt);
    return { ...receipt, receiptPath, receiptSha256: crypto.createHash('sha256').update(fs.readFileSync(receiptPath)).digest('hex') };
  }
  const status = importStatus(env);
  const manifestPath = manifestArgument(argv, env);
  if (!manifestPath) throw new Error('A verified import manifest is required; pass --manifest <path>');
  const requiredFiles = [files.data, files.registry, files.status];
  const verified = verifyImportManifest(manifestPath, requiredFiles, files.repoRoot);
  const snapshots = verified.snapshots;
  const runState = verifyReadyRunState({ manifest: verified.manifest, manifestPath: verified.manifestPath, repoRoot: files.repoRoot });
  console.log(`Verified ${verified.files} source file checksums from ${verified.manifestPath}`);

  // Parse and validate the exact verified bytes before any network client is created.
  const excursionsPayload = snapshots
    ? JSON.parse(snapshots.get(path.resolve(files.data)).toString('utf8'))
    : JSON.parse(fs.readFileSync(files.data, 'utf8'));
  const excursions = excursionsFromPayload(excursionsPayload);
  const registry = snapshots
    ? JSON.parse(snapshots.get(path.resolve(files.registry)).toString('utf8'))
    : fs.existsSync(files.registry) ? JSON.parse(fs.readFileSync(files.registry, 'utf8')) : null;
  const scrapeStatus = snapshots
    ? JSON.parse(snapshots.get(path.resolve(files.status)).toString('utf8'))
    : fs.existsSync(files.status) ? JSON.parse(fs.readFileSync(files.status, 'utf8')) : { sources: [] };
  if (registry && !Array.isArray(registry.sections)) {
    throw new Error('Expected a "sections" array in the CAI registry JSON');
  }
  if (!Array.isArray(scrapeStatus.sources)) {
    throw new Error('Expected a "sources" array in the scrape status JSON');
  }
  const { SOURCES } = require('../sources');
  const preparedExcursions = attachSectionMetadata(excursions, SOURCES);
  validateImportEvents(preparedExcursions, status);
  const preparedClassifications = prepareClassifications(preparedExcursions);

  const supabase = supabaseFactory(
    requiredEnvironment('SUPABASE_URL', env),
    requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY', env),
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
  );
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
    excursions: preparedExcursions,
    status
  });
  const importedClassifications = await upsertClassifications({
    supabase,
    rows: preparedClassifications.rows
  });
  const classificationVerification = await reconcileClassifications({
    supabase,
    rows: preparedClassifications.rows
  });
  if (classificationVerification.mismatchedSourceIds.length) {
    throw new Error(`Classification reconciliation failed for ${classificationVerification.mismatchedSourceIds.length} source_id values`);
  }
  const verification = await reconcileImportedPlaces({
    supabase,
    excursions: preparedExcursions,
    imported: result,
    status
  });
  const receipt = buildImportReceipt({
    manifest: verified.manifest,
    manifestPath: verified.manifestPath,
    manifestSha256: verified.manifestSha256,
    projectRef: projectRefFromUrl(requiredEnvironment('SUPABASE_URL', env)),
    imported: result,
    verification,
    classificationVerification,
    skippedClassifications: preparedClassifications.skipped,
    registrySyncPerformed: Boolean(registry),
    repoRoot: files.repoRoot,
    verifiedAt: now()
  });
  const verificationEvidence = {
    schemaVersion: 1,
    runId: verified.manifest.runId,
    projectRef: receipt.projectRef,
    verifiedAt: receipt.verifiedAt,
    sourceIds: preparedExcursions.map((excursion) => excursion.id),
    classifications: { ...classificationVerification, skipped: preparedClassifications.skipped },
    ...verification
  };
  writeJsonAtomic(path.join(path.dirname(verified.manifestPath), 'db-verification.json'), verificationEvidence);
  writeJsonAtomic(path.join(path.dirname(verified.manifestPath), 'import-receipt.json'), receipt);
  console.log(
    `inserted ${result.inserted}, updated ${result.updated} coordinates/organizer metadata, skipped ${result.skipped} existing`
    + `${result.skippedUnlocated ? `, skipped ${result.skippedUnlocated} without coordinates` : ''}`
    + ` as ${result.status}`
  );
  return {
    sections: importedSections,
    classifications: importedClassifications,
    skippedClassifications: preparedClassifications.skipped.length,
    inserted: result.inserted,
    updated: result.updated,
    skipped: result.skipped,
    skippedUnlocated: result.skippedUnlocated,
    status: result.status,
    verification,
    receiptPath: path.relative(files.repoRoot, path.join(path.dirname(verified.manifestPath), 'import-receipt.json')).split(path.sep).join('/'),
    receiptSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(path.dirname(verified.manifestPath), 'import-receipt.json'))).digest('hex'),
    manifestSha256: verified.manifestSha256,
    runId: verified.manifest.runId,
    projectRef: receipt.projectRef,
    filesReadyAtImport: runState.files
  };
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
  classificationToRow,
  upsertClassifications,
  insertMissingClassifications,
  prepareClassifications,
  reconcileClassifications,
  classificationManifestArgument,
  verifyReadyClassificationRun,
  sectionToRow,
  sectionUpsertRow,
  attachSectionMetadata,
  readExcursions,
  verifyImportManifest,
  verifyReadyRunState,
  manifestArgument,
  validateImportEvents,
  reconcileImportedPlaces,
  buildImportReceipt,
  slugify,
  toPlaceRow
};
