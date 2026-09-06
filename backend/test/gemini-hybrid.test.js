const test = require('node:test');
const assert = require('node:assert/strict');
const { DateTime } = require('luxon');
const { scrapeAll } = require('../pipeline');
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
    ...overrides
  };
}

test('gemini extractor sources use fetchDocument+extract even when adapter forces deterministic', async () => {
  let adapterCalls = 0;
  let extractCalls = 0;
  const result = await scrapeAll({
    sources: SOURCES.filter((source) => source.id === 'colleferro'),
    now,
    apiKey: 'test-key',
    adapter: async () => {
      adapterCalls += 1;
      return { status: 'unsupported', excursions: [], method: 'pdf-text' };
    },
    extract: async (source) => {
      extractCalls += 1;
      assert.equal(source.id, 'colleferro');
      return [sample({
        id: 'colleferro-gemini-1',
        title: 'Monte Cavo',
        organizer: 'CAI Colleferro',
        location: 'Colli Albani',
        date: '2026-09-14'
      })];
    },
    fetchDoc: async (source) => ({ kind: 'pdf', hash: 'colleferro-pdf', fileUrl: source.url }),
    log: { log() {}, error() {} }
  });

  assert.equal(adapterCalls, 0);
  assert.equal(extractCalls, 1);
  assert.equal(result.results[0].status, 'ok');
  assert.equal(result.excursions.some((item) => item.id === 'colleferro-gemini-1'), true);
  assert.equal(result.sourceHashes.colleferro, 'colleferro-pdf');
});

test('non-gemini sources still use the deterministic adapter when forced', async () => {
  let adapterCalls = 0;
  let extractCalls = 0;
  const fake = {
    id: 'fake-det',
    organizer: 'CAI Fake',
    url: 'https://example.com/cal',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'deterministic',
    enabled: true,
    region: 'Lazio'
  };
  const result = await scrapeAll({
    sources: [fake],
    now,
    apiKey: 'test-key',
    adapter: async (source) => {
      adapterCalls += 1;
      assert.equal(source.id, 'fake-det');
      return {
        status: 'ok',
        excursions: [sample({
          id: 'fake-det-1',
          title: 'Gita Fake',
          organizer: 'CAI Fake',
          date: '2026-09-21'
        })],
        method: 'html'
      };
    },
    extract: async () => {
      extractCalls += 1;
      throw new Error('Gemini must not run for non-gemini extractors');
    },
    fetchDoc: async () => {
      throw new Error('fetchDocument must not run for non-gemini extractors');
    },
    log: { log() {}, error() {} }
  });

  assert.equal(adapterCalls, 1);
  assert.equal(extractCalls, 0);
  assert.equal(result.excursions.some((item) => item.id === 'fake-det-1'), true);
});
