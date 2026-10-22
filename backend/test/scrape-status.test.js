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
  assert.equal(ids.includes('latina'), true);
  assert.equal(ids.includes('cassino'), true);
  assert.equal(ids.includes('gallinaro'), true);
  assert.equal(findSource('sora').kind, 'pdf');
  assert.equal(findSource('alatri').template, 'html-calendario');
  assert.match(findSource('latina').url, /statoevento=pianificato/);
  assert.match(findSource('cassino').url, /caicassino\.it\/index\.php\/eventi/);
  assert.equal(findSource('gallinaro').template, 'facebook');
  assert.ok(enabledSources().length >= 19);
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
  const gallinaro = status.sources.find((row) => row.id === 'gallinaro');
  assert.equal(roma.status, 'ok');
  assert.equal(roma.excursions, 1);
  assert.equal(sora.status, 'failed');
  assert.match(sora.error, /503/);
  assert.equal(gallinaro.status, 'idle');
  assert.equal(status.sources.length, SOURCES.length);
});

test('explicit single-source continuation retains document history and unresolved issues as partial', () => {
  const source = findSource('cai-cernusco-sul-naviglio-9216051');
  const pdfUrl = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf';
  const oldUrl = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/eventi/elenco/?eventDisplay=past&outlook-ical=1';
  const priorDocuments = Array.from({ length: 35 }, (_, index) => ({
    url: index === 0 ? pdfUrl : `https://organizzazione.cai.it/sez-cernusco-sul-naviglio/doc-${index}`,
    method: index === 0 ? 'pdf-ocr' : 'html-calendar',
    status: 'ok'
  }));
  const refreshedPdf = { url: pdfUrl, method: 'pdf-ocr', status: 'ok', hash: 'fresh' };
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: {
      sources: [{
        id: source.id,
        status: 'partial',
        hash: 'historical-hash',
        documents: priorDocuments,
        methods: ['html-calendar', 'pdf-ocr'],
        issues: [{ url: oldUrl, message: 'previous timeout' }],
        extractedEvents: 4
      }]
    },
    result: {
      excursions: [{ id: `${source.id}-existing` }],
      results: [{
        source,
        status: 'ok',
        excursions: [{ id: `${source.id}-existing` }],
        documents: [refreshedPdf],
        methods: ['pdf-ocr'],
        issues: [],
        extractedEvents: 5,
        hash: 'single-document-hash'
      }],
      failures: []
    },
    continuationSourceId: source.id,
    continuationSourceUrls: [pdfUrl],
    generatedAt: '2026-10-22T00:00:00.000Z'
  });
  const row = status.sources[0];
  assert.equal(row.status, 'partial');
  assert.equal(row.documents.length, 35);
  assert.deepEqual(row.documents[0], refreshedPdf);
  assert.equal(row.documents.some((document) => document.url === priorDocuments[34].url), true);
  assert.deepEqual(row.issues, [{ url: oldUrl, message: 'previous timeout' }]);
  assert.equal(row.hash, 'historical-hash');
  assert.equal(row.extractedEvents, 4);
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
