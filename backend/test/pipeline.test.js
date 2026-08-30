const test = require('node:test');
const assert = require('node:assert/strict');
const { DateTime } = require('luxon');
const { mergeEnrichment } = require('../classifier');
const { resetGeminiQuotaExhausted } = require('../grok-extract');
const {
  belongingTo,
  parseScrapeArgs,
  preserveEnrichment,
  scrapeAll
} = require('../pipeline');
const { SOURCES } = require('../sources');

const now = DateTime.fromISO('2026-08-30', { zone: 'Europe/Rome' });

function sample(overrides = {}) {
  return {
    id: 'roma-aaa',
    title: 'Monte Viglio',
    date: '2026-09-12',
    dateEnd: '2026-09-12',
    category: 'E',
    link: 'https://www.cairoma.it/?p=1',
    organizer: 'CAI Roma',
    location: 'Monti Ernici',
    region: 'Lazio',
    lat: 41.8,
    lng: 13.4,
    cost: 'Vedi sito',
    time: '6 ore',
    ...overrides
  };
}

test('parseScrapeArgs reads repeated --source and dry-run', () => {
  assert.deepEqual(parseScrapeArgs(['--dry-run', '--source', 'tivoli', '--source=viterbo']), {
    dryRun: true,
    sources: ['tivoli', 'viterbo']
  });
});

test('preserveEnrichment keeps Grok fields when the scrape id is unchanged', () => {
  const scraped = sample();
  const existing = mergeEnrichment(scraped, {
    summary: 'Anello sugli Ernici.',
    coordinatesQuality: 'peak',
    lat: 41.88,
    lng: 13.4,
    mountainGroup: 'Ernici',
    region: 'Lazio',
    startPlace: 'Capistrello',
    elevationM: 2156,
    distanceKm: 12,
    durationHours: 6,
    activityType: 'escursione',
    terrain: 'anello',
    difficultyNote: 'E'
  });
  const merged = preserveEnrichment([scraped], [existing]);
  assert.equal(merged[0].summary, 'Anello sugli Ernici.');
  assert.equal(merged[0].title, scraped.title);
});

test('scrapeAll merges Roma with a Grok source and keeps ids stable', async () => {
  const roma = [sample()];
  const tivoli = [sample({
    id: 'tivoli-bbb',
    title: 'Anello Monte Morra',
    organizer: 'CAI Tivoli',
    location: 'Monti Lucretili',
    date: '2026-09-20'
  })];

  const result = await scrapeAll({
    sources: SOURCES.filter((source) => source.id === 'roma' || source.id === 'tivoli'),
    now,
    apiKey: 'test-key',
    scrapeRoma: async () => roma,
    extract: async (source) => {
      assert.equal(source.id, 'tivoli');
      return tivoli;
    },
    fetchDoc: async (source) => ({ kind: 'pdf', hash: 'pdf-1', fileUrl: source.url }),
    log: { log() {}, error() {} }
  });

  assert.deepEqual(result.excursions.map((item) => item.id), ['roma-aaa', 'tivoli-bbb']);
  assert.equal(result.sourceHashes.tivoli, 'pdf-1');
  assert.equal(result.failures.length, 0);
});

test('a failed Grok source keeps its cache and does not drop Roma', async () => {
  const existing = [
    sample(),
    sample({ id: 'tivoli-old', title: 'Gita Tivoli', organizer: 'CAI Tivoli', date: '2026-10-04' })
  ];

  const result = await scrapeAll({
    sources: SOURCES.filter((source) => source.id === 'roma' || source.id === 'tivoli'),
    existingPayload: { excursions: existing, sourceHashes: { tivoli: 'old' } },
    now,
    apiKey: 'test-key',
    scrapeRoma: async () => [sample()],
    extract: async () => {
      throw new Error('Grok down');
    },
    fetchDoc: async () => ({ kind: 'pdf', hash: 'new', fileUrl: 'https://example.com/a.pdf' }),
    log: { log() {}, error() {} }
  });

  assert.equal(result.excursions.some((item) => item.id === 'roma-aaa'), true);
  assert.equal(result.excursions.some((item) => item.id === 'tivoli-old'), true);
  assert.equal(result.failures.length, 1);
  assert.equal(belongingTo({ id: 'tivoli' }, existing[1]), true);
});

test('unchanged document hash skips Grok', async () => {
  let extracted = 0;
  const cached = [sample({ id: 'tivoli-old', title: 'Gita Tivoli', organizer: 'CAI Tivoli' })];
  const result = await scrapeAll({
    sources: SOURCES.filter((source) => source.id === 'tivoli'),
    existingPayload: {
      excursions: cached,
      sourceHashes: { tivoli: 'same-hash' }
    },
    now,
    apiKey: 'test-key',
    extract: async () => {
      extracted += 1;
      return cached;
    },
    fetchDoc: async () => ({ kind: 'pdf', hash: 'same-hash', fileUrl: 'https://example.com/a.pdf' }),
    log: { log() {}, error() {} }
  });

  assert.equal(extracted, 0);
  assert.equal(result.results[0].status, 'reused');
  assert.equal(result.excursions[0].id, 'tivoli-old');
});

test('without an API key Roma still scrapes and Grok sources keep cache', async () => {
  const result = await scrapeAll({
    sources: SOURCES.filter((source) => source.id === 'roma' || source.id === 'tivoli'),
    existingPayload: {
      excursions: [sample({ id: 'tivoli-old', title: 'Gita Tivoli', organizer: 'CAI Tivoli' })]
    },
    now,
    apiKey: null,
    scrapeRoma: async () => [sample()],
    extract: async () => {
      throw new Error('Grok should not be called');
    },
    fetchDoc: async () => {
      throw new Error('document should not be fetched');
    },
    log: { log() {}, error() {} }
  });

  assert.equal(result.excursions.some((item) => item.id === 'roma-aaa'), true);
  assert.equal(result.excursions.some((item) => item.id === 'tivoli-old'), true);
  assert.equal(result.results.find((item) => item.source.id === 'tivoli')?.status, 'skipped');
});

test('--source keeps excursions from other sections', async () => {
  const result = await scrapeAll({
    sources: SOURCES,
    sourceIds: ['tivoli'],
    existingPayload: {
      excursions: [
        sample(),
        sample({ id: 'tivoli-old', title: 'Vecchia', organizer: 'CAI Tivoli' })
      ]
    },
    now,
    apiKey: 'test-key',
    extract: async () => [
      sample({ id: 'tivoli-new', title: 'Nuova', organizer: 'CAI Tivoli', date: '2026-11-01' })
    ],
    fetchDoc: async (source) => ({ kind: 'pdf', hash: 'h', fileUrl: source.url }),
    log: { log() {}, error() {} }
  });

  assert.equal(result.excursions.some((item) => item.id === 'roma-aaa'), true);
  assert.equal(result.excursions.some((item) => item.id === 'tivoli-new'), true);
  assert.equal(result.excursions.some((item) => item.id === 'tivoli-old'), false);
});

test('Gemini quota skips later LLM sources without calling extract', async () => {
  resetGeminiQuotaExhausted();
  const quota = new Error('Gemini API 429: You exceeded your current quota, please check your plan and billing details.');
  quota.status = 429;
  quota.kind = 'quota';
  const extracted = [];

  const result = await scrapeAll({
    sources: SOURCES.filter((source) => ['roma', 'tivoli', 'sora'].includes(source.id)),
    existingPayload: {
      excursions: [
        sample(),
        sample({ id: 'tivoli-old', title: 'Tivoli', organizer: 'CAI Tivoli' }),
        sample({ id: 'sora-old', title: 'Sora', organizer: 'CAI Sora' })
      ]
    },
    now,
    apiKey: 'test-key',
    scrapeRoma: async () => [sample()],
    extract: async (source) => {
      extracted.push(source.id);
      if (source.id === 'tivoli') throw quota;
      return [sample({ id: `${source.id}-new` })];
    },
    fetchDoc: async (source) => ({ kind: 'pdf', hash: 'h', fileUrl: source.url }),
    log: { log() {}, error() {} }
  });

  assert.deepEqual(extracted, ['tivoli']);
  assert.equal(result.results.find((item) => item.source.id === 'sora')?.status, 'skipped');
  assert.equal(result.excursions.some((item) => item.id === 'sora-old'), true);
  resetGeminiQuotaExhausted();
});

test('hardFailures lists Gemini sources that died with an empty cache', async () => {
  resetGeminiQuotaExhausted();
  const result = await scrapeAll({
    sources: SOURCES.filter((source) => source.id === 'roma' || source.id === 'sora'),
    existingPayload: { excursions: [sample()] },
    now,
    apiKey: 'test-key',
    scrapeRoma: async () => [sample()],
    extract: async () => {
      throw new Error('timeout');
    },
    fetchDoc: async () => ({ kind: 'pdf', hash: 'x', fileUrl: 'https://example.com/a.pdf' }),
    log: { log() {}, error() {} }
  });

  assert.equal(result.hardFailures.length, 1);
  assert.equal(result.hardFailures[0].source.id, 'sora');
  assert.equal(result.excursions.some((item) => item.id === 'roma-aaa'), true);
});
