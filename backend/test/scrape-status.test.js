const test = require('node:test');
const assert = require('node:assert/strict');
const { buildScrapeStatus, hardFailures } = require('../scrape-status');
const { enabledSources, findSource, SOURCES } = require('../sources');

test('enabled catalog includes the new PDF and HTML calendars', () => {
  const ids = enabledSources().map((source) => source.id);
  assert.equal(ids.includes('roma'), true);
  assert.equal(ids.includes('sora'), true);
  assert.equal(ids.includes('amatrice'), true);
  assert.equal(ids.includes('esperia'), true);
  assert.equal(ids.includes('alatri'), true);
  assert.equal(ids.includes('frascati'), true);
  assert.equal(ids.includes('latina'), false);
  assert.equal(findSource('sora').kind, 'pdf');
  assert.equal(findSource('alatri').template, 'html-calendario');
  assert.ok(enabledSources().length >= 16);
});

test('buildScrapeStatus merges a run onto the full catalog', () => {
  const status = buildScrapeStatus({
    generatedAt: '2026-08-30T12:00:00.000Z',
    result: {
      excursions: [{ id: 'roma-aaa' }, { id: 'sora-bbb' }],
      results: [
        { source: findSource('roma'), status: 'ok', excursions: [{ id: 'roma-aaa' }], hash: null }
      ],
      failures: [
        { source: findSource('sora'), error: new Error('Gemini API 503') }
      ]
    }
  });

  const roma = status.sources.find((row) => row.id === 'roma');
  const sora = status.sources.find((row) => row.id === 'sora');
  const latina = status.sources.find((row) => row.id === 'latina');
  assert.equal(roma.status, 'ok');
  assert.equal(roma.excursions, 1);
  assert.equal(sora.status, 'failed');
  assert.match(sora.error, /503/);
  assert.equal(latina.status, 'disabled');
  assert.equal(status.sources.length, SOURCES.length);
});

test('hardFailures ignores sources that still have cache', () => {
  const sora = findSource('sora');
  const existing = [{ id: 'sora-old' }];
  const misses = hardFailures({
    failures: [{ source: sora, error: new Error('timeout') }]
  }, existing);
  assert.equal(misses.length, 0);

  const empty = hardFailures({
    failures: [{ source: sora, error: new Error('timeout') }]
  }, []);
  assert.equal(empty.length, 1);
});
