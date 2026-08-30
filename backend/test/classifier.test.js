const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {
  areCoordsUsable,
  classifyOne,
  enrichExcursions,
  extractOutputText,
  isReusableEnrichment,
  mergeEnrichment,
  parseEnrichmentJson,
  resolveApiKey
} = require('../classifier');
const { parseArgs, runClassify } = require('../scripts/classify');
const { DEFAULT_COORDS } = require('../scraper');

function sampleEnrichment(overrides = {}) {
  return {
    lat: 42.4694,
    lng: 13.5657,
    mountainGroup: 'Gran Sasso',
    region: 'Abruzzo',
    startPlace: 'Fonte Cerreto',
    elevationM: 2422,
    distanceKm: 14,
    durationHours: 7.5,
    coordinatesQuality: 'peak',
    summary: 'Anello sul Gran Sasso fino a Pizzo Confalonieri.',
    activityType: 'escursione',
    terrain: 'anello',
    difficultyNote: 'EE: per escursionisti esperti, tratti esposti.',
    ...overrides
  };
}

function sampleExcursion(overrides = {}) {
  return {
    id: 'roma-aaa',
    title: 'Pizzo Confalonieri — Anello da Fonte Cerreto',
    date: '2026-09-05',
    category: 'EE',
    link: 'https://www.cairoma.it/?p=1',
    organizer: 'CAI Roma',
    location: 'Gran Sasso',
    lat: 42.482,
    lng: 13.565,
    cost: 'Vedi sito',
    time: '7.30 ore',
    ...overrides
  };
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body))
  };
}

test('parseArgs reads dry-run, limit and id', () => {
  assert.deepEqual(parseArgs(['--dry-run', '--limit', '2', '--id', 'roma-aaa']), {
    dryRun: true,
    limit: 2,
    id: 'roma-aaa'
  });
});

test('parseEnrichmentJson reads raw and fenced JSON', () => {
  const enrichment = sampleEnrichment();
  assert.equal(parseEnrichmentJson(JSON.stringify(enrichment)).summary, enrichment.summary);
  assert.equal(
    parseEnrichmentJson(`\`\`\`json\n${JSON.stringify(enrichment)}\n\`\`\``).lat,
    enrichment.lat
  );
});

test('extractOutputText accepts output_text and message content', () => {
  const enrichment = JSON.stringify(sampleEnrichment());
  assert.equal(extractOutputText({ output_text: enrichment }), enrichment);
  assert.equal(extractOutputText({
    output: [{ type: 'message', content: [{ type: 'output_text', text: enrichment }] }]
  }), enrichment);
});

test('mergeEnrichment never overwrites the CAI category and prefers scraped km', () => {
  const scraped = sampleExcursion({
    category: 'EE',
    distanceKm: 13,
    durationHours: 6,
    region: 'Lazio',
    dateEnd: '2026-09-06',
    days: 2,
    lat: 41.891,
    lng: 12.492
  });
  const merged = mergeEnrichment(scraped, sampleEnrichment({
    category: 'T',
    distanceKm: 99,
    durationHours: 9,
    region: 'Abruzzo',
    summary: 'ok'
  }));

  assert.equal(merged.category, 'EE');
  assert.equal(merged.distanceKm, 13);
  assert.equal(merged.durationHours, 6);
  assert.equal(merged.region, 'Lazio');
  assert.equal(merged.dateEnd, '2026-09-06');
  assert.equal(merged.days, 2);
  assert.equal(merged.summary, 'ok');
  assert.equal(merged.lat, 42.4694);
});

test('areCoordsUsable rejects unknown quality, 0,0 and Rome fallback off-Rome', () => {
  const offRome = sampleExcursion({ location: 'Maiella', title: 'Cima delle Murelle' });
  assert.equal(areCoordsUsable(sampleEnrichment({ coordinatesQuality: 'unknown' }), offRome), false);
  assert.equal(areCoordsUsable(sampleEnrichment({ lat: 0, lng: 0 }), offRome), false);
  assert.equal(areCoordsUsable(sampleEnrichment({
    lat: DEFAULT_COORDS.lat,
    lng: DEFAULT_COORDS.lng,
    coordinatesQuality: 'peak'
  }), offRome), false);
  assert.equal(areCoordsUsable(sampleEnrichment(), offRome), true);
});

test('invalid Grok coords keep the scraped heuristic', () => {
  const scraped = sampleExcursion({
    location: 'Maiella',
    title: 'Cima delle Murelle',
    lat: DEFAULT_COORDS.lat,
    lng: DEFAULT_COORDS.lng
  });
  const merged = mergeEnrichment(scraped, sampleEnrichment({
    lat: DEFAULT_COORDS.lat,
    lng: DEFAULT_COORDS.lng,
    coordinatesQuality: 'region'
  }));
  assert.equal(merged.lat, scraped.lat);
  assert.equal(merged.lng, scraped.lng);
});

test('cache hits skip classify when id title date location match', async () => {
  const scraped = sampleExcursion();
  const existing = mergeEnrichment(scraped, sampleEnrichment());
  let calls = 0;

  const result = await enrichExcursions([scraped], [existing], {
    classify: async () => {
      calls += 1;
      return sampleEnrichment();
    }
  });

  assert.equal(calls, 0);
  assert.equal(result.reused, 1);
  assert.equal(result.classified, 0);
  assert.equal(result.excursions[0].summary, existing.summary);
});

test('changed title forces a new classification', async () => {
  const scraped = sampleExcursion({ title: 'Pizzo Confalonieri variante nord' });
  const existing = mergeEnrichment(sampleExcursion(), sampleEnrichment());
  assert.equal(isReusableEnrichment(scraped, existing), false);

  const result = await enrichExcursions([scraped], [existing], {
    classify: async () => sampleEnrichment({ summary: 'Nuova scheda.' })
  });

  assert.equal(result.classified, 1);
  assert.equal(result.excursions[0].summary, 'Nuova scheda.');
  assert.equal(result.excursions[0].title, scraped.title);
});

test('classifyOne retries 429 then parses structured output', async () => {
  const payloads = [
    jsonResponse('rate limited', 429),
    jsonResponse({
      output_text: JSON.stringify(sampleEnrichment())
    })
  ];
  const sleeps = [];

  const enrichment = await classifyOne(sampleExcursion(), {
    apiKey: 'test-key',
    fetchImpl: async () => payloads.shift(),
    sleep: async (ms) => {
      sleeps.push(ms);
    }
  });

  assert.equal(enrichment.activityType, 'escursione');
  assert.deepEqual(sleeps, [500]);
});

test('a failed row keeps scraped data and does not block the rest', async () => {
  const first = sampleExcursion({ id: 'roma-one' });
  const second = sampleExcursion({ id: 'roma-two', title: 'Monte Viglio' });
  const result = await enrichExcursions([first, second], [], {
    concurrency: 1,
    classify: async (excursion) => {
      if (excursion.id === 'roma-one') throw new Error('boom');
      return sampleEnrichment({ summary: 'Viglio classificato.' });
    }
  });

  assert.equal(result.failed, 1);
  assert.equal(result.classified, 1);
  assert.equal(result.excursions[0].summary, undefined);
  assert.equal(result.excursions[1].summary, 'Viglio classificato.');
});

test('runClassify dry-run does not write the cache file', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'classify-'));
  const dataPath = path.join(tempDir, 'excursions.json');
  const sitePath = path.join(tempDir, 'missing-site', 'excursions.json');
  const original = {
    source: 'https://www.cairoma.it/?page_id=582',
    generatedAt: '2026-08-29T00:00:00.000Z',
    excursions: [sampleExcursion()]
  };
  await fs.writeFile(dataPath, `${JSON.stringify(original, null, 2)}\n`);
  const before = await fs.readFile(dataPath, 'utf8');

  const logs = [];
  const run = await runClassify({
    argv: ['--dry-run', '--limit', '1'],
    env: { XAI_API_KEY: 'xai-test-key' },
    dataPath,
    sitePath,
    log: { log: (message) => logs.push(String(message)) },
    classify: async () => sampleEnrichment()
  });

  const after = await fs.readFile(dataPath, 'utf8');
  assert.equal(run.wrote, false);
  assert.equal(after, before);
  assert.equal(await fs.access(sitePath).then(() => true, () => false), false);
  assert.match(logs.join('\n'), /dry-run/);
});

test('--id classifies only the requested excursion', async () => {
  const first = sampleExcursion({ id: 'roma-one' });
  const second = sampleExcursion({ id: 'roma-two', title: 'Monte Viglio' });
  const called = [];

  const result = await enrichExcursions([first, second], [], {
    id: 'roma-two',
    classify: async (excursion) => {
      called.push(excursion.id);
      return sampleEnrichment({ summary: excursion.id });
    }
  });

  assert.deepEqual(called, ['roma-two']);
  assert.equal(result.excursions[0].summary, undefined);
  assert.equal(result.excursions[1].summary, 'roma-two');
});

test('runClassify writes enrichment to the cache file', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'classify-'));
  const dataPath = path.join(tempDir, 'excursions.json');
  const siteDir = path.join(tempDir, 'public');
  const sitePath = path.join(siteDir, 'excursions.json');
  await fs.mkdir(siteDir, { recursive: true });
  const original = {
    source: 'https://www.cairoma.it/?page_id=582',
    generatedAt: '2026-08-29T00:00:00.000Z',
    excursions: [sampleExcursion()]
  };
  await fs.writeFile(dataPath, `${JSON.stringify(original, null, 2)}\n`);

  const run = await runClassify({
    argv: ['--limit', '1'],
    env: { XAI_API_KEY: 'xai-test-key' },
    dataPath,
    sitePath,
    log: { log: () => {} },
    classify: async () => sampleEnrichment({ summary: 'Scritto su disco.' })
  });

  assert.equal(run.wrote, true);
  const saved = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  const published = JSON.parse(await fs.readFile(sitePath, 'utf8'));
  assert.equal(saved.excursions[0].summary, 'Scritto su disco.');
  assert.equal(saved.excursions[0].category, 'EE');
  assert.equal(published.excursions[0].lat, 42.4694);
});

test('runClassify does not rewrite the cache when enrichment is unchanged', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'classify-'));
  const dataPath = path.join(tempDir, 'excursions.json');
  const sitePath = path.join(tempDir, 'missing-site', 'excursions.json');
  const excursion = mergeEnrichment(sampleExcursion(), sampleEnrichment());
  const original = {
    source: 'https://www.cairoma.it/?page_id=582',
    generatedAt: '2026-08-29T00:00:00.000Z',
    excursions: [excursion]
  };
  await fs.writeFile(dataPath, `${JSON.stringify(original, null, 2)}\n`);
  const before = await fs.readFile(dataPath, 'utf8');

  const run = await runClassify({
    argv: [],
    env: { XAI_API_KEY: 'xai-test-key' },
    dataPath,
    sitePath,
    log: { log: () => {} },
    classify: async () => {
      throw new Error('should not classify cached rows');
    }
  });

  assert.equal(run.wrote, false);
  assert.equal(await fs.readFile(dataPath, 'utf8'), before);
});

test('resolveApiKey prefers XAI_API_KEY then a Grok CLI session', () => {
  assert.equal(resolveApiKey({ env: { XAI_API_KEY: 'xai-from-env' }, grokHome: os.tmpdir() }), 'xai-from-env');
  assert.equal(resolveApiKey({
    env: {},
    grokHome: path.join(os.tmpdir(), 'missing-grok-home'),
    readFileSync: () => {
      throw new Error('missing');
    }
  }), null);
  assert.equal(resolveApiKey({
    env: {},
    grokHome: '/tmp/grok',
    now: Date.parse('2026-08-29T18:00:00Z'),
    readFileSync: () => JSON.stringify({
      session: {
        key: 'xai-cli-token',
        expires_at: '2026-08-29T23:00:00Z'
      }
    })
  }), 'xai-cli-token');
  assert.equal(resolveApiKey({
    env: { XAI_API_KEY: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.sig' },
    grokHome: path.join(os.tmpdir(), 'missing-grok-home')
  }), null);
});

test('runClassify refuses to start without XAI_API_KEY', async () => {
  await assert.rejects(
    () => runClassify({
      argv: [],
      env: {},
      dataPath: __filename,
      grokHome: path.join(os.tmpdir(), 'missing-grok-home')
    }),
    /XAI_API_KEY/
  );
});
