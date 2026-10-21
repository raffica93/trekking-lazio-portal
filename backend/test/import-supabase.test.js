const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  coordPatchForExisting,
  importNewPlaces,
  importStatus,
  sectionToRow,
  attachSectionMetadata,
  slugify,
  toPlaceRow,
  classificationToRow,
  prepareClassifications,
  upsertClassifications,
  verifyImportManifest,
  manifestArgument,
  main
} = require('../scripts/import-supabase');
const { DEFAULT_COORDS } = require('../scraper');

test('import manifest verifies every listed file and required source coverage', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cai-import-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const source = path.join(dir, 'excursions.json');
  const bytes = Buffer.from('{"excursions":[]}');
  fs.writeFileSync(source, bytes);
  const manifest = path.join(dir, 'manifest.json');
  fs.writeFileSync(manifest, JSON.stringify({ version: 1, runId: 'test-run', createdAt: '2026-10-19T00:00:00Z', files: [{
    path: 'excursions.json',
    sha256: crypto.createHash('sha256').update(bytes).digest('hex')
  }] }));

  const verified = verifyImportManifest(manifest, [source], dir);
  assert.equal(verified.files, 1);
  fs.writeFileSync(source, '{"excursions":["changed"]}');
  assert.deepEqual(verified.snapshots.get(source), bytes);
  assert.throws(() => verifyImportManifest(manifest, [source], dir), /checksum mismatch/);
  fs.writeFileSync(source, bytes);
  assert.throws(() => verifyImportManifest(manifest, [path.join(dir, 'other.json')], dir), /does not cover required file/);
  assert.throws(() => verifyImportManifest(manifest, [path.join(dir, 'required.json')], dir), /does not cover required file/);
  fs.writeFileSync(manifest, JSON.stringify({ version: 2, runId: 'test-run', createdAt: '2026-10-19T00:00:00Z', files: [] }));
  assert.throws(() => verifyImportManifest(manifest, [source], dir), /version must be 1/);
});

test('manifestArgument accepts CLI and environment handoff paths', () => {
  assert.equal(manifestArgument(['--manifest', 'manifest.json'], {}), 'manifest.json');
  assert.equal(manifestArgument([], { SUPABASE_IMPORT_MANIFEST: 'manifest.json' }), 'manifest.json');
  assert.throws(() => manifestArgument(['--manifest'], {}), /requires a file path/);
});

test('main rejects an invalid import status before requiring database credentials', async () => {
  await assert.rejects(
    main({ argv: [], env: { SUPABASE_IMPORT_STATUS: 'archived' } }),
    /SUPABASE_IMPORT_STATUS must be either "draft" or "published"/
  );
});

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
  const classificationUpserts = [];
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
    classificationUpserts,
    from(table) {
      assert.ok(['places', 'place_classifications'].includes(table));
      return {
        select(columns) {
          return {
            async in(column, ids) {
              selects.push({ columns, column, ids: [...ids] });
              if (selectError) return { data: null, error: selectError };
              const data = table === 'places' ? rows.filter((row) => ids.includes(row.source_id)) : [];
              return { data, error: null };
            }
          };
        },
        async insert(batch) {
          inserts.push(batch);
          if (insertError) return { data: null, error: insertError };
          rows.push(...batch.map((row) => ({ ...row, id: `fake-${row.source_id}` })));
          return { data: batch, error: null };
        },
        update(patch) {
          return {
            async eq(column, value) {
              updates.push({ patch, column, value });
              if (updateError) return { data: null, error: updateError };
              for (const row of rows) if (row[column] === value) Object.assign(row, patch);
              return { data: [patch], error: null };
            }
          };
        },
        upsert() {
          if (table === 'places') throw new Error('places import must insert new rows, not upsert');
          classificationUpserts.push(arguments[0]);
          return Promise.resolve({ data: arguments[0], error: null });
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
  assert.equal(row.external_url, 'http://example.com/terminillo');
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

test('classification contract is persisted separately and is keyed to the same source_id', async () => {
  const event = sampleExcursion({
    classification: {
      decision: 'trekking', category: 'a piedi', confidence: 0.9, probability: 0.95,
      rationale: 'Percorso escursionistico', evidenceOriginal: 'Escursione al rifugio',
      source_id: 'roma-2026-09-monte-terminillo', fingerprint: 'sha256:fixture',
      modelRequested: null, responseModel: null, modelAttested: false,
      method: 'rules-v1', policyVersion: 'cai-trekking-v1', modelVersion: null
    }
  });
  const row = classificationToRow(event.id, event.classification);
  assert.deepEqual(Object.keys(row).sort(), [
    'category', 'confidence', 'decision', 'evidence_original', 'fingerprint', 'method',
    'model_attested', 'model_requested', 'model_version', 'policy_version', 'probability',
    'rationale', 'response_model', 'source_id'
  ]);
  assert.equal(row.decision, 'trekking');
  const unverifiedMercury = classificationToRow(event.id, {
    ...event.classification,
    decision: 'da_verificare', category: 'altro', method: 'mercury-decide',
    modelRequested: 'inception/mercury-decide', responseModel: null,
    modelAttested: false, modelVersion: null
  });
  assert.equal(unverifiedMercury.model_requested, 'inception/mercury-decide');
  assert.equal(unverifiedMercury.response_model, null);
  assert.equal(unverifiedMercury.model_attested, false);
  assert.throws(() => classificationToRow(event.id, {
    ...event.classification,
    method: 'mercury-decide', modelRequested: 'inception/mercury-decide',
    responseModel: 'other/model', modelAttested: true, modelVersion: 'other/model'
  }), /inconsistent Mercury model attestation/);
  const supabase = createFakeSupabase();
  assert.equal(await upsertClassifications({ supabase, excursions: [event] }), 1);
  assert.equal(supabase.classificationUpserts[0][0].source_id, event.id);
  assert.throws(() => classificationToRow(event.id, {
    ...event.classification, source_id: 'different-source'
  }), /invalid classification/);
  assert.throws(() => classificationToRow(event.id, {
    ...event.classification, decision: 'include'
  }), /invalid classification/);
  assert.throws(() => classificationToRow(event.id, {
    ...event.classification, error: 'provider unavailable'
  }), /error or invalid classification response/);
  assert.deepEqual(prepareClassifications([{
    ...event,
    classification: { error: 'provider unavailable', decision: 'da_verificare' }
  }]), {
    rows: [],
    skipped: [{ source_id: event.id, reason: `Excursion ${event.id} has an error or invalid classification response` }]
  });
});

test('toPlaceRow drops durations that overflow numeric(5,2)', () => {
  const ok = toPlaceRow(sampleExcursion({ durationHours: 5.5 }), 'published');
  assert.equal(ok.duration_hours, 5.5);
  const overflow = toPlaceRow(sampleExcursion({ durationHours: 9669875 }), 'published');
  assert.equal(overflow.duration_hours, null);
  const elevationAsHours = toPlaceRow(sampleExcursion({ durationHours: 2230 }), 'published');
  assert.equal(elevationAsHours.duration_hours, null);
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

  assert.equal(result.inserted, 1);
  assert.equal(result.updated, 0);
  assert.equal(result.skipped, 0);
  assert.equal(result.status, 'published');
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

  assert.equal(result.inserted, 0);
  assert.equal(result.updated, 0);
  assert.equal(result.skipped, 1);
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

  assert.equal(result.inserted, 1);
  assert.equal(result.updated, 0);
  assert.equal(result.skipped, 1);
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

test('importNewPlaces includes excursions without coordinates in the list', async () => {
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

  assert.equal(result.inserted, 2);
  assert.equal(result.updated, 0);
  assert.equal(result.skipped, 0);
  assert.equal(supabase.inserts.length, 1);
  assert.equal(supabase.inserts[0].length, 2);
  assert.equal(supabase.inserts[0][0].source_id, located.id);
  assert.equal(supabase.inserts[0][1].latitude, null);
  assert.equal(supabase.inserts[0][1].longitude, null);
});

test('organizer region is independent of the destination and supplements existing metadata', async () => {
  const excursion = sampleExcursion({ organizerRegion: 'Lombardia', caiSectionId: 'milano' });
  const row = toPlaceRow(excursion, 'published');
  assert.equal(row.region, 'Lazio');
  assert.equal(row.organizer_region, 'Lombardia');
  const supabase = createFakeSupabase({ existingSourceIds: [excursion.id] });
  await importNewPlaces({ supabase, excursions: [excursion], status: 'published' });
  assert.deepEqual(supabase.updates[0].patch, { organizer_region: 'Lombardia', cai_section_id: 'milano' });
});

test('registry transformation preserves evidence and separates discovery from extraction', () => {
  const row = sectionToRow({ id: 'milano', organizer: 'CAI Milano', region: 'Lombardia', directoryId: 42, status: 'calendar-found', calendarUrls: ['https://example.com/calendario'] }, { status: 'failed', eventCount: 0 }, '2026-09-05T12:00:00Z');
  assert.equal(row.directory_id, '42');
  assert.equal(row.discovery_status, 'calendar-found');
  assert.equal(row.scrape_status, 'failed');
  assert.equal(row.event_count, 0);
  assert.equal(row.organizer_region, 'Lombardia');
});

test('section metadata does not overwrite destination region', () => {
  const [excursion] = attachSectionMetadata([sampleExcursion()], [{ id: 'roma', organizer: 'CAI Roma', region: 'Lazio' }]);
  assert.equal(excursion.caiSectionId, 'roma');
  assert.equal(excursion.organizerRegion, 'Lazio');
  assert.equal(excursion.region, 'Lazio');
});

test('import rejects executable URLs and does not invent a missing coordinate pair', () => {
  assert.throws(() => toPlaceRow(sampleExcursion({ link: 'javascript:alert(1)' }), 'draft'), /invalid link/);
  const row = toPlaceRow(sampleExcursion({ lat: 42, lng: null }), 'draft');
  assert.equal(row.latitude, null);
  assert.equal(row.longitude, null);
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

  assert.equal(result.inserted, 0);
  assert.equal(result.updated, 1);
  assert.equal(result.skipped, 0);
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

test('importNewPlaces fills coordinates that were previously missing', async () => {
  const excursion = sampleExcursion({
    id: 'rieti-nuria',
    title: 'Monte Nuria',
    location: 'Rascino',
    lat: 42.291,
    lng: 13.121,
    coordinatesQuality: 'massif'
  });
  const supabase = createFakeSupabase({
    existingRows: [{
      source_id: excursion.id,
      latitude: null,
      longitude: null,
      coordinates_quality: null,
      status: 'published'
    }]
  });

  const result = await importNewPlaces({ supabase, excursions: [excursion], status: 'published' });

  assert.equal(result.updated, 1);
  assert.deepEqual(supabase.updates[0].patch, {
    latitude: 42.291,
    longitude: 13.121,
    coordinates_quality: 'massif'
  });
});

function readyRunFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cai-import-ready-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const runDir = path.join(root, 'backend/data/agent-runs/test-run');
  fs.mkdirSync(runDir, { recursive: true });
  const files = {
    data: path.join(root, 'backend/data/excursions.json'),
    registry: path.join(root, 'backend/data/cai-sections.json'),
    status: path.join(root, 'backend/data/scrape-status.json'),
    repoRoot: root
  };
  fs.mkdirSync(path.dirname(files.data), { recursive: true });
  fs.writeFileSync(files.data, JSON.stringify({ excursions: [sampleExcursion()] }));
  fs.writeFileSync(files.registry, JSON.stringify({ sections: [] }));
  fs.writeFileSync(files.status, JSON.stringify({ sources: [] }));
  const manifestPath = path.join(runDir, 'manifest.json');
  const manifest = {
    version: 1,
    runId: 'test-run',
    createdAt: '2026-10-19T00:00:00Z',
    files: Object.entries(files).filter(([key]) => key !== 'repoRoot').map(([, file]) => ({
      path: path.relative(root, file).split(path.sep).join('/'),
      sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    }))
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  fs.writeFileSync(path.join(runDir, 'state.json'), JSON.stringify({
    runId: 'test-run', files: 'ready', manifest: 'backend/data/agent-runs/test-run/manifest.json'
  }));
  return { root, runDir, files, manifestPath };
}

function resealFixture(fixture) {
  const manifest = JSON.parse(fs.readFileSync(fixture.manifestPath, 'utf8'));
  for (const entry of manifest.files) {
    const file = path.resolve(fixture.root, entry.path);
    entry.sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  fs.writeFileSync(fixture.manifestPath, JSON.stringify(manifest));
}

test('main requires a ready state and verified manifest before creating a database client', async (t) => {
  const fixture = readyRunFixture(t);
  let factoryCalls = 0;
  const factory = () => { factoryCalls += 1; return createFakeSupabase(); };
  fs.writeFileSync(fixture.files.data, JSON.stringify({ excursions: [] }));
  await assert.rejects(main({
    argv: ['--manifest', fixture.manifestPath],
    env: { SUPABASE_IMPORT_STATUS: 'published', SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test' },
    supabaseFactory: factory,
    files: fixture.files
  }), /checksum mismatch/);
  assert.equal(factoryCalls, 0);
  assert.equal(fs.existsSync(path.join(fixture.runDir, 'import-receipt.json')), false);

  const fresh = readyRunFixture(t);
  fs.writeFileSync(path.join(fresh.runDir, 'state.json'), JSON.stringify({
    runId: 'test-run', files: 'pending', manifest: 'backend/data/agent-runs/test-run/manifest.json'
  }));
  await assert.rejects(main({
    argv: ['--manifest', fresh.manifestPath],
    env: { SUPABASE_IMPORT_STATUS: 'published', SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test' },
    supabaseFactory: factory,
    files: fresh.files
  }), /files=ready/);
  assert.equal(factoryCalls, 0);
});

test('main imports a sealed fixture and writes a verifiable receipt after reconciliation', async (t) => {
  const fixture = readyRunFixture(t);
  const supabase = createFakeSupabase();
  let factoryCalls = 0;
  const factory = () => { factoryCalls += 1; return supabase; };
  const result = await main({
    argv: ['--manifest', fixture.manifestPath],
    env: { SUPABASE_IMPORT_STATUS: 'published', SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test' },
    supabaseFactory: factory,
    files: fixture.files,
    now: () => '2026-10-20T12:00:00.000Z'
  });
  assert.equal(factoryCalls, 1);
  assert.deepEqual({ inserted: result.inserted, updated: result.updated, skipped: result.skipped, projectRef: result.projectRef }, { inserted: 1, updated: 0, skipped: 0, projectRef: 'project' });
  assert.deepEqual({ expectedSourceIds: result.verification.expectedSourceIds, matchedSourceIds: result.verification.matchedSourceIds, publishedSourceIds: result.verification.publishedSourceIds, missingSourceIds: result.verification.missingSourceIds }, { expectedSourceIds: 1, matchedSourceIds: 1, publishedSourceIds: 1, missingSourceIds: [] });
  const receipt = JSON.parse(fs.readFileSync(path.join(fixture.runDir, 'import-receipt.json'), 'utf8'));
  const verification = JSON.parse(fs.readFileSync(path.join(fixture.runDir, 'db-verification.json'), 'utf8'));
  assert.deepEqual({ status: receipt.status, runId: receipt.runId, inserted: receipt.inserted, projectRef: receipt.projectRef, registrySyncPerformed: receipt.registrySyncPerformed }, { status: 'completed', runId: 'test-run', inserted: 1, projectRef: 'project', registrySyncPerformed: true });
  assert.equal(receipt.verification.protectedFieldsChanged, 0);
  assert.deepEqual(verification.sourceIds, ['roma-2026-09-monte-terminillo']);
});

test('invalid classification responses are skipped without classification upserts', async (t) => {
  const fixture = readyRunFixture(t);
  const payload = JSON.parse(fs.readFileSync(fixture.files.data, 'utf8'));
  payload.excursions[0].classification = { error: 'provider unavailable', decision: 'da_verificare' };
  fs.writeFileSync(fixture.files.data, JSON.stringify(payload));
  resealFixture(fixture);
  let factoryCalls = 0;
  const supabase = createFakeSupabase();
  const result = await main({
    argv: ['--manifest', fixture.manifestPath],
    env: { SUPABASE_IMPORT_STATUS: 'published', SUPABASE_URL: 'https://project.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test' },
    supabaseFactory: () => { factoryCalls += 1; return supabase; },
    files: fixture.files
  });
  assert.equal(factoryCalls, 1);
  assert.equal(result.inserted, 1);
  assert.equal(result.classifications, 0);
  assert.equal(result.skippedClassifications, 1);
  assert.deepEqual(supabase.classificationUpserts, []);
  const receipt = JSON.parse(fs.readFileSync(path.join(fixture.runDir, 'import-receipt.json'), 'utf8'));
  assert.equal(receipt.skippedClassifications, 1);
});
