const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const axios = require('axios');
const { DateTime } = require('luxon');
const { VERSION, monthFloor, parseDates, normalizeEvent, parseIcs, parseJsonLd, parseWordPress, parseCalendarLines, parseTivoliPdf, parseHtmlCalendar, discoverLinks, fetchDocument, scrapeDeterministic, pdfText } = require('../adapters/deterministic');
const { parseScrapeArgs, scrapeAll } = require('../pipeline');
const source = { id: 'test-section', organizer: 'CAI Prova', region: 'Lombardia', url: 'https://section.example/calendario-2026/', enabled: true, extractor: 'deterministic' };
const now = DateTime.fromISO('2026-09-05T12:00:00', { zone: 'Europe/Rome' });
const quiet = { log() {}, error() {} };

test('calendar floor follows Rome across UTC month boundary and has no future cap', () => {
  assert.equal(monthFloor(DateTime.fromISO('2026-08-31T22:30:00Z')), '2026-09-01');
  assert.equal(parseDates('31 dicembre - 2 gennaio', 2026).dateEnd, '2027-01-02');
  assert.equal(parseDates('12/10 Monte Rosa', 2026).date, '2026-10-12');
  assert.equal(parseDates('12/10 Monte Rosa')?.date, undefined);
  assert.equal(parseDates('31/02/2026 Monte Rosa', 2026).date, null);
  assert.equal(parseDates('5-6 settembre 2026', 2026).dateEnd, '2026-09-06');
});

test('ICS unfolds text and converts exclusive all-day end, without invented recurring instances', () => {
  const calendar = 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20260830\r\nDTEND;VALUE=DATE:20260902\r\nSUMMARY:Traversata del\r\n la valle\r\nLOCATION:Monte Rosa\r\nEND:VEVENT\r\nEND:VCALENDAR';
  const result = parseIcs(calendar, source, source.url);
  assert.equal(result.recognized, true);
  assert.equal(result.events[0].title, 'Traversata della valle');
  assert.equal(result.events[0].dateEnd, '2026-09-01');
  assert.equal(result.events[0].days, 3);
  assert.equal(result.events[0].organizerRegion, 'Lombardia');
  assert.equal(result.events[0].lat, undefined);
});

test('JSON-LD extracts only event-location coordinates and skips cancelled events', () => {
  const html = `<script type="application/ld+json">${JSON.stringify({ '@graph': [
    { '@type': 'Organization', geo: { latitude: 45, longitude: 9 } },
    { '@type': 'Event', name: 'Monte Rosa escursione', startDate: '2026-10-10', location: { name: 'Rifugio in Piemonte', geo: { latitude: 45.9, longitude: 7.8 } } },
    { '@type': 'Event', name: 'Escursione annullata', startDate: '2026-10-11', eventStatus: 'https://schema.org/EventCancelled' }
  ] })}</script>`;
  const result = parseJsonLd(html, source, source.url);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].lat, 45.9);
  assert.equal(result.events[0].region, 'Piemonte');
  assert.equal(result.events[0].coordinatesQuality, 'source');
});

test('blank coordinates, headquarters and source region never become route destination coordinates', () => {
  const raw = { title: 'Escursione sulle Alpi', date: '2026-12-01', lat: '', lng: '' };
  assert.equal(normalizeEvent(raw, source, source.url, 'test').lat, undefined);
  assert.equal(normalizeEvent(raw, source, source.url, 'test').region, 'Altro');
  assert.equal(normalizeEvent({ ...raw, lat: 45, lng: 9, location: 'Sede sociale CAI' }, source, source.url, 'test').lat, undefined);
  assert.equal(normalizeEvent({ ...raw, lat: 45, lng: 9 }, { ...source, headquartersCoordinates: { latitude: 45, longitude: 9 } }, source.url, 'test').lat, undefined);
});

test('calendar HTML joins table cells and respects explicit annual context', () => {
  const html = '<h1>Programma 2026</h1><table><tr><th>Settembre</th></tr><tr><td>6</td><td>Escursione Monte Rosa</td></tr><tr><td>12/10</td><td>Anello del Monte Bianco</td></tr></table>';
  const result = parseHtmlCalendar(html, source, source.url, now);
  assert.deepEqual(result.events.map((event) => event.date), ['2026-09-06', '2026-10-12']);
  const datedArticle = '<h1>Notizie</h1><article><div class="entry-meta"><time class="published">5 settembre 2026</time></div><p>La prima escursione è in programma sabato 5 settembre e le iscrizioni sono aperte.</p></article>';
  assert.equal(parseHtmlCalendar(datedArticle, source, source.url, now).events.length, 0);
});

test('annual line patterns exclude narrative dates and unknown years', () => {
  assert.equal(parseCalendarLines(['12 settembre Escursione Monte Rosa'], source, source.url, undefined, 'pdf').length, 0);
  assert.equal(parseCalendarLines(['La prima escursione è sabato 12 settembre'], source, source.url, 2026, 'pdf').length, 0);
  assert.equal(parseCalendarLines(['SETTEMBRE', '12 Escursionismo'], source, source.url, 2026, 'pdf').length, 0);
});

test('Cernusco OCR cross-column side-panel text does not contaminate the October event', async () => {
  const fixture = JSON.parse(await fs.readFile(
    path.join(__dirname, 'fixtures', 'cai-cernusco-2026-ocr-cross-column.json'), 'utf8'
  ));
  const section = {
    id: fixture.sourceId,
    organizer: 'CAI Cernusco Sul Naviglio',
    region: 'Lombardia'
  };
  const events = parseCalendarLines([fixture.ocrLine], section, fixture.officialPdf, 2026, fixture.method);
  assert.equal(events.length, 1);
  assert.equal(events[0].date, fixture.expectedDate);
  assert.equal(events[0].title, fixture.expectedTitle);
  assert.equal(events[0].sourceDocument, fixture.officialPdf);
  const control = parseCalendarLines([fixture.controlLine], section, fixture.officialPdf, 2026, fixture.method);
  assert.equal(control.length, 1);
  assert.equal(control[0].title, fixture.expectedControlTitle, 'cleanup must not affect other OCR rows from the same PDF');
});

test('deterministic parser version invalidates a cached Cernusco PDF extraction from v11', async (t) => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-parser-version-cache-'));
  t.after(() => fs.rm(tmp, { recursive: true, force: true }));
  const pdfBytes = await fs.readFile(path.join(__dirname, 'fixtures', 'cai-valmadrera-2026-calendar.pdf'));
  const sourceId = 'cai-cernusco-sul-naviglio-9216051';
  const url = 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf';
  const hash = crypto.createHash('sha256').update(pdfBytes).digest('hex');
  const pageRanges = JSON.parse(process.env.SCRAPE_PDF_PAGE_RANGES || '{}');
  const ocrPages = JSON.parse(process.env.SCRAPE_PDF_OCR_PAGES || '{}');
  const pageRangeKey = JSON.stringify(pageRanges[sourceId] || null);
  const ocrPageKey = JSON.stringify(ocrPages[sourceId] || null);
  const previousKey = crypto.createHash('sha256')
    .update(`11|${sourceId}|${hash}|${now.year}|${pageRangeKey}|${ocrPageKey}`).digest('hex');
  const previousCachePath = path.join(tmp, `events-${previousKey}.json`);
  const staleEvent = {
    id: `${sourceId}-cb33842fc3c2`,
    title: 'Alpe Devero (VB) j Cesare Andreoni 2026 Feigao ae SS a',
    date: '2026-10-25'
  };
  await fs.writeFile(previousCachePath, JSON.stringify({
    events: [staleEvent], recognized: true, method: 'pdf-ocr', issues: []
  }));

  const result = await scrapeDeterministic({
    id: sourceId,
    organizer: 'CAI Cernusco Sul Naviglio',
    region: 'Lombardia',
    url,
    website: 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/'
  }, {
    now,
    cacheDir: tmp,
    initialUrls: [url],
    previousStatus: { sources: [] },
    fetchDoc: async (requestedUrl) => ({
      url: requestedUrl,
      buffer: pdfBytes,
      contentType: 'application/pdf',
      hash
    })
  });

  assert.equal(VERSION, 12);
  assert.equal(result.documents[0].method, 'pdf-text');
  assert.equal(result.excursions.some((event) => event.id === staleEvent.id), false);
  assert.equal(result.excursions.some((event) => event.title === staleEvent.title), false);
  assert.equal(JSON.parse(await fs.readFile(previousCachePath, 'utf8')).events[0].title, staleEvent.title);
  const currentKey = crypto.createHash('sha256')
    .update(`${VERSION}|${sourceId}|${hash}|${now.year}|${pageRangeKey}|${ocrPageKey}`).digest('hex');
  await assert.doesNotReject(fs.access(path.join(tmp, `events-${currentKey}.json`)));
});

test('Valmadrera 2026 PDF month grid maps labels to weekday cells and preserves non-trekking candidates', async () => {
  // The binary fixture is the cached official PDF; the text fixture retains its production pdf.js output.
  const pdfBytes = await fs.readFile(path.join(__dirname, 'fixtures', 'cai-valmadrera-2026-calendar.pdf'));
  assert.equal(crypto.createHash('sha256').update(pdfBytes).digest('hex'), 'f3939cb69b55824e4db4026d989acea993a58e7fa81671d8c7a3093d3b4103e9');
  const extracted = await pdfText(pdfBytes);
  assert.equal(extracted.pageCount, 12);
  const fixtureLines = (await fs.readFile(path.join(__dirname, 'fixtures', 'cai-valmadrera-2026-calendar-pdfjs.txt'), 'utf8')).split(/\r?\n/);
  const valmadrera = { id: 'cai-valmadrera-9216081', organizer: 'CAI Valmadrera', region: 'Lombardia' };
  const pdfUrl = 'https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf';
  const expected = [
    ['2026-10-04', 'Scuola PIACCO CORSO ARRAMPICATA'],
    ['2026-10-10', 'Scuola PIACCO CORSO ARRAMPICATA'],
    ['2026-10-11', 'GITA SOCIALE MEDIA MONTAGNA Presolana'],
    ['2026-10-17', 'RACCONTAMI LA MONTAGNA'],
    ['2026-10-18', 'VIVI IL MOREGALLO'],
    ['2026-10-17', 'Alp. Giovanile Uscita corso'],
    ['2026-10-18', 'Alp. Giovanile Uscita corso'],
    ['2026-10-25', 'Scuola PIACCO CORSO ARRAMPICATA'],
    ['2026-11-01', 'GITA SOCIALE MEDIA MONTAGNA Valmalenco'],
    ['2026-11-08', 'Scuola PIACCO CORSO ARRAMPICATA'],
    ['2026-11-14', 'Scuola PIACCO CORSO ARRAMPICATA'],
    ['2026-11-15', 'Scuola PIACCO CORSO ARRAMPICATA'],
    ['2026-11-22', 'GITA CULTURALE Enogastronomica'],
    ['2026-12-04', 'CENA SOCIALE']
  ];
  const verifyEvents = (events, label) => {
    const futureEvents = events.filter((event) => event.date >= '2026-10-01');
    const byDateAndTitle = new Map(futureEvents.map((event) => [`${event.date}|${event.title}`, event]));
    assert.equal(futureEvents.length, 14, `${label}: October–December event count`);
    for (const [date, title] of expected) assert.ok(byDateAndTitle.has(`${date}|${title}`), `${label}: missing ${date} ${title}`);
    assert.equal(byDateAndTitle.has('2026-10-24|Scuola PIACCO CORSO ARRAMPICATA'), false, `${label}: Oct 24 must remain blank`);
    for (const event of events) {
      assert.equal(event.sourceDocument, pdfUrl);
      assert.equal(event.location, 'Località da verificare');
      assert.equal(event.lat, undefined);
      assert.equal(event.lng, undefined);
    }
  };
  verifyEvents(parseCalendarLines(fixtureLines, valmadrera, pdfUrl, 2026, 'pdf-text'), 'captured pdf.js fixture');
  verifyEvents(parseCalendarLines(extracted.lines, valmadrera, pdfUrl, 2026, 'pdf-text'), 'production PDF extraction');
});

test('Tivoli booklet associates title before day, region after day and official difficulty', () => {
  const lines = ['SETTEMBRE', 'Monte Amaro (2793 m)', '5', 'Parco Nazionale della Maiella', 'Sabato', 'da Fonte di Nunzio', 'Difficoltà EE', 'Escursionismo', 'T. complessivo 9 h', 'DDE Mario Rossi'];
  const events = parseTivoliPdf(lines, { ...source, id: 'tivoli' }, source.url, 2026);
  assert.equal(events[0].title, 'Monte Amaro (2793 m)');
  assert.equal(events[0].location, 'Parco Nazionale della Maiella');
  assert.equal(events[0].category, 'EE');
  assert.equal(events[0].durationHours, 9);
});

test('discovery prioritizes annual PDFs and skips tracking links and old programs', () => {
  const links = discoverLinks('<a href="/programma-2026.pdf">Programma</a><a href="/programma-2025.pdf">Programma</a><a href="https://x.com/intent/tweet?url=calendario">Condividi</a><a href="https://user:pass@section.example/programma">Programma</a><a href="https://127.0.0.1/eventi">Eventi</a>', source.url, now);
  assert.deepEqual(links.map((link) => link.url), ['https://section.example/programma-2026.pdf']);
});

test('structured empty calendar is distinct from unreadable HTML', async () => {
  const run = async (text) => scrapeDeterministic(source, { now, fetchDoc: async (url) => ({ url, text, hash: 'a', contentType: 'text/html' }) });
  assert.equal((await run('BEGIN:VCALENDAR\nEND:VCALENDAR')).status, 'no-upcoming');
  assert.equal((await run('<h1>Sezione CAI</h1>')).status, 'unsupported');
});

test('explicit continuation URLs replace source seeds and remain inside the official-host queue', async (t) => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-explicit-continuation-'));
  t.after(() => fs.rm(tmp, { recursive: true, force: true }));
  const targets = ['https://section.example/queued-a', 'https://section.example/queued-b'];
  const calls = [];
  const redirectPolicies = [];
  const result = await scrapeDeterministic({
    ...source,
    url: 'https://section.example/index',
    website: 'https://section.example/',
    calendarUrls: ['https://section.example/seed-calendar']
  }, {
    now,
    cacheDir: tmp,
    previousStatus: { sources: [] },
    initialUrls: targets,
    fetchDoc: async (url, options) => {
      calls.push(url);
      redirectPolicies.push(options.redirectPolicy);
      return { url, text: '<h1>Pagina senza link aggiuntivi</h1>', hash: url, contentType: 'text/html' };
    }
  });
  assert.deepEqual(calls, targets);
  assert.deepEqual(result.documents.map((document) => document.url), targets);
  assert.deepEqual(redirectPolicies, targets.map(() => ({ host: 'section.example' })));
  assert.equal(calls.includes(source.url), false);
  assert.deepEqual(result.discovery, {
    complete: false, knownCandidates: targets.length, visitedCandidates: targets.length, remainingCandidates: 0
  }, 'selected continuation URLs are only a subset, not proof of queue exhaustion');

  const defaultCalls = [];
  const defaults = {
    ...source,
    url: 'https://section.example/index',
    website: 'https://section.example/about',
    calendarUrls: ['https://section.example/seed-calendar']
  };
  const fullDiscovery = await scrapeDeterministic(defaults, {
    now, cacheDir: tmp, previousStatus: { sources: [] },
    fetchDoc: async (url) => { defaultCalls.push(url); return { url, text: '<h1>Pagina senza link aggiuntivi</h1>', hash: `default-${url}`, contentType: 'text/html' }; }
  });
  assert.deepEqual(defaultCalls, [defaults.calendarUrls[0], defaults.url, defaults.website]);
  assert.deepEqual(fullDiscovery.discovery, {
    complete: true, knownCandidates: defaults.calendarUrls.length + 2,
    visitedCandidates: defaults.calendarUrls.length + 2, remainingCandidates: 0
  }, 'full seed traversal with no residual candidates proves the discovered queue was exhausted');
});

test('continuation fetch blocks a same-host URL redirecting to an external private host', async (t) => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-redirect-guard-'));
  t.after(() => fs.rm(tmp, { recursive: true, force: true }));
  const originalGet = axios.get;
  try {
    axios.get = async (url, options) => {
      assert.equal(url, 'https://section.example/allowlisted-calendar');
      assert.equal(typeof options.beforeRedirect, 'function');
      assert.doesNotThrow(() => options.beforeRedirect({ protocol: 'https:', hostname: 'section.example', port: '443' }));
      options.beforeRedirect({ protocol: 'http:', hostname: '127.0.0.1', port: '80' });
      throw new Error('redirect guard should reject the private target');
    };
    await assert.rejects(fetchDocument('https://section.example/allowlisted-calendar', {
      cacheDir: tmp,
      redirectPolicy: { host: 'section.example' }
    }), /Blocked redirect outside official HTTPS host section.example/);
  } finally {
    axios.get = originalGet;
  }
});

test('explicit continuation URLs reject malformed and cross-host values before any fetch', async (t) => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-explicit-continuation-reject-'));
  t.after(() => fs.rm(tmp, { recursive: true, force: true }));
  for (const invalid of ['not a URL', 'https://other.example/calendar', 'https://user:pass@section.example/calendar']) {
    let calls = 0;
    await assert.rejects(scrapeDeterministic(source, {
      now, cacheDir: tmp, initialUrls: [invalid],
      fetchDoc: async () => { calls += 1; throw new Error('must not fetch'); }
    }), /Invalid continuation URL|Continuation URL host/);
    assert.equal(calls, 0);
  }
});

test('explicit continuation still honors persisted cooldown for a failed target URL', async (t) => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-explicit-continuation-cooldown-'));
  t.after(() => fs.rm(tmp, { recursive: true, force: true }));
  const blocked = 'https://section.example/temporarily-unavailable';
  const reachable = 'https://section.example/reachable';
  const updatedAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const calls = [];
  const result = await scrapeDeterministic(source, {
    now, cacheDir: tmp, initialUrls: [blocked, reachable],
    previousStatus: { sources: [{ id: source.id, updatedAt, issues: [{ url: blocked, message: 'Request failed with status code 503' }] }] },
    fetchDoc: async (url) => { calls.push(url); return { url, text: '<h1>Calendario CAI</h1>', hash: url, contentType: 'text/html' }; }
  });
  assert.deepEqual(calls, [reachable]);
  assert.equal(result.issues.some((issue) => issue.url === blocked && issue.code === 'previous-unavailable-skipped'), true);
});

test('recent transient failures are skipped with their original timestamp and bounded error detail', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-prior-transient-fresh-'));
  const unavailable = 'https://section.example/programma-2026.pdf';
  const previousStatus = { sources: [{
    id: source.id,
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    issues: [{ url: unavailable, message: 'Request failed with status code 503' }]
  }] };
  let calls = 0;
  try {
    const result = await scrapeDeterministic({ ...source, url: 'https://section.example/index', calendarUrls: [unavailable] }, {
      now, cacheDir: tmp, previousStatus,
      fetchDoc: async (url) => { calls += 1; return { url, text: '<h1>Sezione CAI</h1>', hash: 'index', contentType: 'text/html' }; }
    });
    const skipped = result.issues.find((issue) => issue.url === unavailable);
    assert.equal(calls, 1); // The official index is still consulted.
    assert.equal(skipped.code, 'previous-unavailable-skipped');
    assert.equal(skipped.httpStatus, 503);
    assert.equal(skipped.failureMessage, 'Request failed with status code 503');
    assert.equal(skipped.failureAt, previousStatus.sources[0].updatedAt);
    assert.match(skipped.message, /transient/);
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});

test('expired removed URL is rechecked once while the official index can discover its replacement', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-prior-removed-expired-'));
  const removed = 'https://section.example/programma-2025.pdf';
  const index = 'https://section.example/index';
  const replacement = 'https://section.example/programma-2026';
  const previousStatus = { sources: [{
    id: source.id,
    updatedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString(),
    issues: [{ url: removed, message: 'Request failed with status code 404' }]
  }] };
  const calls = [];
  try {
    const result = await scrapeDeterministic({ ...source, url: index, website: 'https://section.example/', calendarUrls: [removed] }, {
      now, cacheDir: tmp, previousStatus,
      fetchDoc: async (url) => {
        calls.push(url);
        if (url === removed) { const error = new Error('Request failed with status code 404'); error.response = { status: 404 }; throw error; }
        if (url === index || url === 'https://section.example/') return { url, text: `<h1>Calendario CAI</h1><a href="${replacement}">Programma 2026</a>`, hash: `index-${url}`, contentType: 'text/html' };
        return { url, text: '<h1>Programma 2026</h1><table><tr><th>Ottobre</th></tr><tr><td>25</td><td>Escursione Monte Rosa</td></tr></table>', hash: 'new-calendar', contentType: 'text/html' };
      }
    });
    assert.equal(calls.filter((url) => url === removed).length, 1);
    assert.equal(calls.includes(replacement), true);
    assert.equal(result.excursions.some((event) => event.title === 'Escursione Monte Rosa' && event.date === '2026-10-25'), true);
    assert.equal(result.issues.some((issue) => issue.url === removed && issue.code === 'http-removed'), true);
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});

test('expired previous failures have a per-source retry cap without blocking new official pages', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-prior-retry-cap-'));
  const urls = [1, 2, 3].map((n) => `https://section.example/old-calendar-${n}`);
  const previousStatus = { sources: [{
    id: source.id,
    updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    issues: urls.map((url) => ({ url, message: 'Request failed with status code 503' }))
  }] };
  const calls = [];
  try {
    const result = await scrapeDeterministic({ ...source, url: urls[0], calendarUrls: urls }, {
      now, cacheDir: tmp, previousStatus,
      fetchDoc: async (url) => { calls.push(url); return { url, text: '<h1>Programma CAI</h1>', hash: url, contentType: 'text/html' }; }
    });
    assert.equal(calls.filter((url) => urls.includes(url)).length, 2);
    assert.equal(result.issues.some((issue) => issue.url === urls[2] && issue.code === 'previous-retry-budget-skipped'), true);
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});

test('transient download failure leaves a valid isolated cache entry untouched', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-download-cache-preserve-'));
  const server = http.createServer((_request, response) => { response.writeHead(503); response.end('temporarily unavailable'); });
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    const url = `http://127.0.0.1:${port}/calendar.pdf`;
    const key = crypto.createHash('sha256').update(url).digest('hex');
    const metaPath = path.join(tmp, `${key}.json`);
    const bodyPath = path.join(tmp, `${key}.bin`);
    const originalMeta = JSON.stringify({ url, hash: 'previous-valid-pdf', contentType: 'application/pdf', bytes: 15, etag: 'prior-etag' });
    const originalBody = Buffer.from('%PDF-valid-cache');
    await fs.writeFile(metaPath, originalMeta);
    await fs.writeFile(bodyPath, originalBody);
    await assert.rejects(fetchDocument(url, { timeoutMs: 1000, cacheDir: tmp }), /503/);
    assert.equal(await fs.readFile(metaPath, 'utf8'), originalMeta);
    assert.deepEqual(await fs.readFile(bodyPath), originalBody);
    assert.deepEqual((await fs.readdir(tmp)).sort(), [`${key}.bin`, `${key}.json`].sort());
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(tmp, { recursive: true, force: true });
  }
});

test('deterministic pipeline retains current-month/cache data, skips past months and keeps future years', async () => {
  const cached = [
    { id: 'test-section-old', sourceId: source.id, title: 'Escursione di agosto', date: '2026-08-12' },
    { id: 'test-section-current', sourceId: source.id, title: 'Escursione di settembre', date: '2026-09-01', coordinatesQuality: 'peak', lat: 45.9, lng: 7.8, summary: 'Verified route' }
  ];
  const future = normalizeEvent({ title: 'Escursione futura', date: '2027-09-01' }, source, source.url, 'test');
  const result = await scrapeAll({ sources: [source], now, existingPayload: { excursions: cached }, adapter: async () => ({ status: 'partial', excursions: [future], issues: [{ message: 'PDF unreadable' }] }), log: quiet });
  assert.deepEqual(result.excursions.map((event) => event.date), ['2026-09-01', '2027-09-01']);
  assert.equal(result.excursions[0].lat, 45.9);
  assert.equal(result.excursions[1].lat, undefined);
  assert.equal(result.coverage.parsed, 1);
});

test('national CLI validates regions and concurrency arguments', () => {
  assert.deepEqual(parseScrapeArgs(['--all', '--region', 'Lombardia', '--concurrency', '8', '--strict']), { dryRun: false, sources: [], sourceUrls: [], all: true, region: 'Lombardia', concurrency: 8, strict: true });
  assert.throws(() => parseScrapeArgs(['--concurrency=0']), /Concurrency/);
});
