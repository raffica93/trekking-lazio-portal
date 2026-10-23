const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { DateTime } = require('luxon');
const { buildScrapeStatus, hardFailures } = require('../scrape-status');
const { scrapeDeterministic } = require('../adapters/deterministic');
const { enabledSources, findSource, SOURCES } = require('../sources');

const pinascaStatusFixture = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'fixtures', 'cai-pinasca-partial-extraction-status.json'),
  'utf8'
));
const campobassoDiscoveryFixture = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'fixtures', 'cai-campobasso-continuation-discovery.json'),
  'utf8'
));

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
        issues: [
          { url: oldUrl, message: 'previous timeout', code: 'http-error' },
          { url: pdfUrl, message: 'prior fetch failed', code: 'http-error' },
          { url: pdfUrl, message: 'Discovery budget reached; 12 candidate documents remain.', code: 'discovery-limit' }
        ],
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
        hash: 'single-document-hash',
        discovery: { complete: false, knownCandidates: 1, visitedCandidates: 1, remainingCandidates: 0 }
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
  assert.deepEqual(row.issues, [
    { url: oldUrl, message: 'previous timeout', code: 'http-error' },
    { url: pdfUrl, message: 'Discovery budget reached; 12 candidate documents remain.', code: 'discovery-limit' }
  ]);
  assert.equal(row.hash, 'historical-hash');
  assert.equal(row.extractedEvents, 4);
});

test('partial continuation recomputes extracted event total from merged document results', () => {
  const { sourceId, prior, current } = pinascaStatusFixture;
  const source = findSource(sourceId);
  const htmlUrl = current.documents.find((document) => document.method === 'html-calendar').url;
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: { sources: [{ id: sourceId, ...prior }] },
    result: {
      excursions: Array.from({ length: 4 }, (_, index) => ({ id: `${sourceId}-event-${index}` })),
      results: [{
        source,
        status: current.status,
        excursions: Array.from({ length: 4 }, (_, index) => ({ id: `${sourceId}-event-${index}` })),
        documents: current.documents,
        methods: ['pdf-ocr', 'html-calendar'],
        issues: current.issues,
        extractedEvents: current.extractedEvents,
        hash: 'partial-continuation-hash'
      }],
      failures: []
    },
    continuationSourceId: sourceId,
    continuationSourceUrls: [htmlUrl],
    generatedAt: '2026-10-22T00:00:00.000Z'
  });
  const row = status.sources[0];
  assert.equal(row.extractedEvents, 27);
  assert.equal(row.status, 'partial');
  assert.deepEqual(row.documents.map((document) => document.events), [0, 27]);
  assert.deepEqual(row.issues, prior.issues);
});

test('partial continuation preserves aggregate when merged history contains legacy documents without counts', () => {
  const { sourceId, mixedLegacy } = pinascaStatusFixture;
  const source = findSource(sourceId);
  const { prior, current } = mixedLegacy;
  const currentUrl = current.documents[0].url;
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: { sources: [{ id: sourceId, ...prior }] },
    result: {
      excursions: [],
      results: [{
        source,
        status: current.status,
        excursions: [],
        documents: current.documents,
        methods: ['html-calendar'],
        issues: current.issues,
        extractedEvents: current.extractedEvents,
        hash: 'mixed-legacy-continuation-hash'
      }],
      failures: []
    },
    continuationSourceId: sourceId,
    continuationSourceUrls: [currentUrl],
    generatedAt: '2026-10-22T00:00:00.000Z'
  });
  const row = status.sources[0];
  assert.equal(row.extractedEvents, 8);
  assert.equal(row.status, 'partial');
  assert.equal(row.documents.length, 3);
  assert.deepEqual(row.issues, prior.issues);
});

test('a full-source run clears a prior discovery-limit when its current queue has none', () => {
  const source = findSource('cai-cernusco-sul-naviglio-9216051');
  const pdfUrl = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf';
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: { sources: [{
      id: source.id,
      status: 'partial',
      documents: [{ url: pdfUrl, status: 'ok' }],
      issues: [{ url: pdfUrl, message: 'Discovery budget reached; 12 candidate documents remain.', code: 'discovery-limit' }]
    }] },
    result: { excursions: [], results: [{
      source, status: 'ok', excursions: [], documents: [{ url: pdfUrl, status: 'ok' }],
      methods: [], issues: [], extractedEvents: 0,
      discovery: { complete: true, knownCandidates: 1, visitedCandidates: 1, remainingCandidates: 0 }
    }], failures: [] },
  });
  assert.deepEqual(status.sources[0].issues, []);
  assert.equal(status.sources[0].status, 'ok');
});

test('a full-source result without exhaustion proof retains a discovery-limit even if issues are empty', () => {
  const source = findSource('cai-cernusco-sul-naviglio-9216051');
  const pdfUrl = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf';
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: { sources: [{
      id: source.id,
      status: 'partial',
      documents: [{ url: pdfUrl, status: 'ok' }],
      issues: [{ url: pdfUrl, message: 'Discovery budget reached; 12 candidate documents remain.', code: 'discovery-limit' }]
    }] },
    result: { excursions: [], results: [{
      source, status: 'ok', excursions: [], documents: [{ url: pdfUrl, status: 'ok' }],
      methods: [], issues: [], extractedEvents: 0,
      discovery: { complete: false, knownCandidates: 10, visitedCandidates: 6, remainingCandidates: 4 }
    }], failures: [] }
  });
  assert.deepEqual(status.sources[0].issues, [
    { url: pdfUrl, message: 'Discovery budget reached; 12 candidate documents remain.', code: 'discovery-limit' }
  ]);
  assert.equal(status.sources[0].status, 'partial');
});

test('a failed retry without a successful document keeps its prior URL error', () => {
  const source = findSource('cai-cernusco-sul-naviglio-9216051');
  const pdfUrl = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf';
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: { sources: [{
      id: source.id,
      status: 'partial',
      documents: [],
      issues: [{ url: pdfUrl, message: 'prior fetch failed', code: 'http-error' }]
    }] },
    result: { excursions: [], results: [{
      source, status: 'ok', excursions: [], documents: [], methods: [], issues: [], extractedEvents: 0
    }], failures: [] },
    continuationSourceId: source.id,
    continuationSourceUrls: [pdfUrl]
  });
  assert.deepEqual(status.sources[0].issues, [
    { url: pdfUrl, message: 'prior fetch failed', code: 'http-error' }
  ]);
  assert.equal(status.sources[0].status, 'partial');
});

test('continuation keeps the newest discovery-limit count for the same URL', () => {
  const source = findSource('cai-cernusco-sul-naviglio-9216051');
  const pdfUrl = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf';
  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: { sources: [{
      id: source.id,
      status: 'partial',
      documents: [],
      issues: [{ url: pdfUrl, message: 'Discovery budget reached; 12 candidate documents remain.', code: 'discovery-limit' }]
    }] },
    result: { excursions: [], results: [{
      source, status: 'partial', excursions: [], documents: [{ url: pdfUrl, status: 'ok' }],
      methods: [], issues: [{ url: pdfUrl, message: 'Discovery budget reached; 4 candidate documents remain.', code: 'discovery-limit' }], extractedEvents: 0
    }], failures: [] },
    continuationSourceId: source.id,
    continuationSourceUrls: [pdfUrl]
  });
  assert.deepEqual(status.sources[0].issues, [
    { url: pdfUrl, message: 'Discovery budget reached; 4 candidate documents remain.', code: 'discovery-limit' }
  ]);
  assert.equal(status.sources[0].status, 'partial');
});

test('Campobasso bounded HTML continuation keeps PDF discovery count separate from its local residual queue', async (t) => {
  const fixture = campobassoDiscoveryFixture;
  const source = findSource(fixture.sourceId);
  assert.equal(source.url, fixture.sourceUrl);
  const tempCache = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'cai-campobasso-continuation-'));
  t.after(() => fs.promises.rm(tempCache, { recursive: true, force: true }));
  const fetched = [];
  const priorIssue = {
    url: fixture.sourceUrl,
    message: `Discovery budget reached; ${fixture.priorRemaining} candidate documents remain.`,
    code: 'discovery-limit'
  };
  const priorStatus = {
    sources: [{
      id: source.id,
      status: 'partial',
      updatedAt: '2026-10-19T18:24:35.762Z',
      documents: [{ url: fixture.sourceUrl, hash: 'prior-pdf-hash', events: 48, method: 'pdf-text' }],
      methods: ['pdf-text'],
      extractedEvents: 304,
      issues: [priorIssue]
    }]
  };
  const collection = await scrapeDeterministic(source, {
    now: DateTime.fromISO('2026-10-22T12:00:00', { zone: 'Europe/Rome' }),
    cacheDir: tempCache,
    maxDocuments: 1,
    budgetMs: 120_000,
    initialUrls: [fixture.continuationUrl],
    previousStatus: priorStatus,
    fetchDoc: async (url) => {
      fetched.push(url);
      return {
        url,
        text: fixture.html,
        hash: 'fixture-html-hash',
        contentType: 'text/html'
      };
    }
  });

  assert.deepEqual(fetched, [fixture.continuationUrl], 'only the requested index is fetched; discovered child stays queued');
  assert.equal(collection.documents.length, 1);
  assert.equal(collection.discovery.complete, false);
  assert.equal(collection.discovery.remainingCandidates, 1);
  assert.deepEqual(collection.issues, [fixture.expectedContinuationIssue]);

  const status = buildScrapeStatus({
    sources: [source],
    existingStatus: priorStatus,
    result: {
      excursions: collection.excursions,
      results: [{ source, ...collection }],
      failures: []
    },
    continuationSourceId: source.id,
    continuationSourceUrls: [fixture.continuationUrl],
    generatedAt: '2026-10-22T12:00:00.000Z'
  });
  assert.equal(status.sources[0].status, 'partial');
  assert.deepEqual(status.sources[0].issues, [priorIssue, fixture.expectedContinuationIssue]);
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
