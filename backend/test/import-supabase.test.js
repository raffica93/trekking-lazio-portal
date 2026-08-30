const test = require('node:test');
const assert = require('node:assert/strict');
const {
  coordPatchForExisting,
  importNewPlaces,
  importStatus,
  slugify,
  toPlaceRow
} = require('../scripts/import-supabase');
const { DEFAULT_COORDS } = require('../scraper');

function sampleExcursion(overrides = {}) {
  return {
    id: 'roma-2026-09-monte-terminillo',
    title: 'Monte Terminillo – Cresta',
    date: '2026-09-12',
    category: 'EE',
    link: 'http://example.com/terminillo',
    organizer: 'CAI Roma',
    location: 'Monti Reatini',
    region: 'Lazio',
    lat: 42.473,
    lng: 12.987,
    distanceKm: 14.5,
    privateCar: true,
    ...overrides
  };
}

function createFakeSupabase({
  existingSourceIds = [],
  existingRows = null,
  selectError = null,
  insertError = null,
  updateError = null
} = {}) {
  const inserts = [];
  const updates = [];
  const selects = [];
  const rows = existingRows || existingSourceIds.map((source_id) => ({
    source_id,
    latitude: 42.473,
    longitude: 12.987,
    coordinates_quality: 'peak',
    status: 'published'
  }));
  return {
    inserts,
    updates,
    selects,
    from(table) {
      assert.equal(table, 'places');
      return {
        select(columns) {
          return {
            async in(column, ids) {
              selects.push({ columns, column, ids: [...ids] });
              if (selectError) return { data: null, error: selectError };
              const data = rows.filter((row) => ids.includes(row.source_id));
              return { data, error: null };
            }
          };
        },
        async insert(batch) {
          inserts.push(batch);
          if (insertError) return { data: null, error: insertError };
          return { data: batch, error: null };
        },
        update(patch) {
          return {
            async eq(column, value) {
              updates.push({ patch, column, value });
              if (updateError) return { data: null, error: updateError };
              return { data: [patch], error: null };
            }
          };
        },
        upsert() {
          throw new Error('import must insert new rows, not upsert');
        }
      };
    }
  };
}

test('toPlaceRow preserves public excursion data and uses a stable unique slug', () => {
  const row = toPlaceRow({
    id: 'roma-2026-09-monte-terminillo',
    title: 'Monte Terminillo – Cresta',
    date: '2026-09-12',
    category: 'EE',
    link: 'http://example.com/terminillo',
    organizer: 'CAI Roma',
    location: 'Monti Reatini',
    region: 'Lazio',
    lat: 42.473,
    lng: 12.987,
    distanceKm: 14.5,
    privateCar: true
  }, 'draft');

  assert.equal(row.slug, 'monte-terminillo-cresta-roma-2026-09-monte-terminillo');
  assert.equal(row.external_url, 'https://example.com/terminillo');
  assert.equal(row.status, 'draft');
  assert.equal(row.distance_km, 14.5);
  assert.equal(row.private_car, true);
});

test('slugify normalizes Italian accents', () => {
  assert.equal(slugify('Cima dell’Àquila'), 'cima-dell-aquila');
});

test('toPlaceRow never leaves a doubled separator after truncating a title slug', () => {
  const row = toPlaceRow({
    id: 'roma-27d73203ebd1',
    title: 'Costone (2271) - Monte Morrone (2141) — Da Piani di Pezza per il Costone fino a La Vena',
    date: '2026-10-10',
    category: 'EE',
    link: 'https://example.com',
    location: 'Velino-Sirente e Duchessa',
    lat: 42.17,
    lng: 13.38
  }, 'draft');

  assert.match(row.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test('toPlaceRow can import places as published', () => {
  const row = toPlaceRow(sampleExcursion(), 'published');
  assert.equal(row.status, 'published');
  assert.equal(row.source_id, 'roma-2026-09-monte-terminillo');
});

test('importStatus defaults to draft and accepts published', () => {
  assert.equal(importStatus({}), 'draft');
  assert.equal(importStatus({ SUPABASE_IMPORT_STATUS: 'published' }), 'published');
  assert.throws(
    () => importStatus({ SUPABASE_IMPORT_STATUS: 'archived' }),
    /must be either "draft" or "published"/
  );
});

test('importNewPlaces inserts missing source_id rows as published', async () => {
  const supabase = createFakeSupabase();
  const excursion = sampleExcursion();
  const result = await importNewPlaces({
    supabase,
    excursions: [excursion],
    status: 'published'
  });

  assert.deepEqual(result, { inserted: 1, updated: 0, skipped: 0, skippedUnlocated: 0, status: 'published' });
  assert.equal(supabase.inserts.length, 1);
  assert.equal(supabase.inserts[0][0].source_id, excursion.id);
  assert.equal(supabase.inserts[0][0].status, 'published');
  assert.equal(supabase.inserts[0][0].title, excursion.title);
});

test('importNewPlaces skips source_id values already in the database', async () => {
  const excursion = sampleExcursion();
  const supabase = createFakeSupabase({ existingSourceIds: [excursion.id] });
  const result = await importNewPlaces({
    supabase,
    excursions: [excursion],
    status: 'published'
  });

  assert.deepEqual(result, { inserted: 0, updated: 0, skipped: 1, skippedUnlocated: 0, status: 'published' });
  assert.deepEqual(supabase.inserts, []);
});

test('importNewPlaces inserts only the new rows in a mixed batch', async () => {
  const existing = sampleExcursion();
  const fresh = sampleExcursion({
    id: 'tivoli-2026-09-monte-morra',
    title: 'Anello Monte Morra',
    organizer: 'CAI Tivoli',
    location: 'Monti Lucretili'
  });
  const supabase = createFakeSupabase({ existingSourceIds: [existing.id] });
  const result = await importNewPlaces({
    supabase,
    excursions: [existing, fresh],
    status: 'published'
  });

  assert.deepEqual(result, { inserted: 1, updated: 0, skipped: 1, skippedUnlocated: 0, status: 'published' });
  assert.equal(supabase.inserts.length, 1);
  assert.equal(supabase.inserts[0].length, 1);
  assert.equal(supabase.inserts[0][0].source_id, fresh.id);
  assert.equal(supabase.inserts[0][0].status, 'published');
});

test('importNewPlaces does not update existing rows when title or date changed', async () => {
  const original = sampleExcursion();
  const changed = sampleExcursion({ title: 'Titolo corretto in admin', date: '2026-09-13' });
  const supabase = createFakeSupabase({ existingSourceIds: [original.id] });
  const result = await importNewPlaces({
    supabase,
    excursions: [changed],
    status: 'published'
  });

  assert.equal(result.inserted, 0);
  assert.equal(result.updated, 0);
  assert.equal(result.skipped, 1);
  assert.equal(result.skippedUnlocated, 0);
  assert.deepEqual(supabase.inserts, []);
  assert.deepEqual(supabase.updates, []);
});

test('importNewPlaces skips excursions without coordinates', async () => {
  const located = sampleExcursion();
  const unlocated = sampleExcursion({
    id: 'esperia-open-day',
    title: 'Open day arrampicata',
    location: 'Non specificato',
    lat: null,
    lng: null
  });
  const supabase = createFakeSupabase();
  const result = await importNewPlaces({
    supabase,
    excursions: [located, unlocated],
    status: 'published'
  });

  assert.deepEqual(result, { inserted: 1, updated: 0, skipped: 0, skippedUnlocated: 1, status: 'published' });
  assert.equal(supabase.inserts.length, 1);
  assert.equal(supabase.inserts[0].length, 1);
  assert.equal(supabase.inserts[0][0].source_id, located.id);
});

test('coordPatchForExisting rewrites Rome fallback and leaves classified peaks', () => {
  assert.deepEqual(coordPatchForExisting({
    source_id: 'esperia-1',
    latitude: DEFAULT_COORDS.lat,
    longitude: DEFAULT_COORDS.lng,
    coordinates_quality: null
  }, sampleExcursion({
    id: 'esperia-1',
    location: 'M. Aurunci',
    lat: 41.345,
    lng: 13.67
  })), {
    latitude: 41.345,
    longitude: 13.67,
    coordinates_quality: 'massif'
  });

  assert.equal(coordPatchForExisting({
    source_id: 'roma-peak',
    latitude: DEFAULT_COORDS.lat,
    longitude: DEFAULT_COORDS.lng,
    coordinates_quality: 'peak'
  }, sampleExcursion({ lat: 41.345, lng: 13.67 })), null);

  assert.equal(coordPatchForExisting({
    source_id: 'admin-fixed',
    latitude: 41.566,
    longitude: 13.067,
    coordinates_quality: null
  }, sampleExcursion({ lat: 41.345, lng: 13.67 })), null);
});

test('importNewPlaces updates existing Rome fallback coordinates', async () => {
  const excursion = sampleExcursion({
    id: 'esperia-petrella',
    title: 'M. Petrella',
    location: 'M. Aurunci',
    lat: 41.345,
    lng: 13.67
  });
  const supabase = createFakeSupabase({
    existingRows: [{
      source_id: excursion.id,
      latitude: DEFAULT_COORDS.lat,
      longitude: DEFAULT_COORDS.lng,
      coordinates_quality: null,
      status: 'published'
    }]
  });
  const result = await importNewPlaces({
    supabase,
    excursions: [excursion],
    status: 'published'
  });

  assert.deepEqual(result, { inserted: 0, updated: 1, skipped: 0, skippedUnlocated: 0, status: 'published' });
  assert.deepEqual(supabase.inserts, []);
  assert.equal(supabase.updates.length, 1);
  assert.equal(supabase.updates[0].column, 'source_id');
  assert.equal(supabase.updates[0].value, excursion.id);
  assert.deepEqual(supabase.updates[0].patch, {
    latitude: 41.345,
    longitude: 13.67,
    coordinates_quality: 'massif'
  });
});
