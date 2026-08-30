const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');
const {
  PRECISE_COORD_QUALITY,
  hasFiniteCoords,
  isRomeFallback
} = require('../scraper');

const DATA_FILE = path.join(__dirname, '..', 'data', 'excursions.json');
const BATCH_SIZE = 200;

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
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

function requiredNumber(value, field, excursionId) {
  const number = numberOrNull(value);
  if (number == null) throw new Error(`Excursion ${excursionId} has no valid ${field}`);
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
      .select('source_id, latitude, longitude, coordinates_quality, status')
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
      if (!hasFiniteCoords(excursion)) {
        skippedUnlocated += 1;
        continue;
      }
      toInsert.push(toPlaceRow(excursion, status));
      continue;
    }

    const patch = coordPatchForExisting(row, excursion);
    if (patch) toUpdate.push({ sourceId, patch });
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
  const externalUrl = textOrNull(excursion.link)?.replace(/^http:\/\//i, 'https://');
  const location = textOrNull(excursion.location);
  if (!sourceId || !title || !date || !externalUrl || !location) {
    throw new Error(`Excursion ${sourceId ?? '(unknown)'} is missing an id, title, date, link, or location`);
  }

  const titleSlug = slugify(title).slice(0, 80).replace(/-+$/g, '') || 'itinerario';
  const suffix = slugify(sourceId);
  return {
    source_id: sourceId,
    slug: `${titleSlug}-${suffix}`,
    title,
    date,
    date_end: textOrNull(excursion.dateEnd),
    days: Number.isInteger(excursion.days) && excursion.days > 0 ? excursion.days : null,
    category: textOrNull(excursion.category) ?? 'E',
    external_url: externalUrl,
    organizer: textOrNull(excursion.organizer) ?? 'CAI Roma',
    location,
    municipality: null,
    province: null,
    region: textOrNull(excursion.region),
    latitude: requiredNumber(excursion.lat, 'lat', sourceId),
    longitude: requiredNumber(excursion.lng, 'lng', sourceId),
    cost: textOrNull(excursion.cost),
    cost_amount: numberOrNull(excursion.costAmount),
    time: textOrNull(excursion.time),
    distance_km: numberOrNull(excursion.distanceKm),
    elevation_m: numberOrNull(excursion.elevationM),
    duration_hours: numberOrNull(excursion.durationHours),
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

function readExcursions(file = DATA_FILE) {
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(payload.excursions)) throw new Error('Expected an "excursions" array in the source JSON');
  return payload.excursions;
}

async function main() {
  const supabase = createClient(
    requiredEnvironment('SUPABASE_URL'),
    requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } }
  );
  const result = await importNewPlaces({
    supabase,
    excursions: readExcursions(),
    status: importStatus()
  });
  console.log(
    `inserted ${result.inserted}, updated ${result.updated} coordinates, skipped ${result.skipped} existing`
    + `${result.skippedUnlocated ? `, skipped ${result.skippedUnlocated} without coordinates` : ''}`
    + ` as ${result.status}`
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Supabase import failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  BATCH_SIZE,
  coordPatchForExisting,
  importNewPlaces,
  importStatus,
  readExcursions,
  slugify,
  toPlaceRow
};
