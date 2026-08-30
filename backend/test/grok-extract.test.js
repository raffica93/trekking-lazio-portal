const test = require('node:test');
const assert = require('node:assert/strict');
const { DateTime } = require('luxon');
const {
  buildRequestBody,
  classifyGeminiError,
  extractFromSource,
  fetchDocument,
  geminiZoneCoords,
  htmlToText,
  isFacebookUrl,
  isGeminiQuotaError,
  resetGeminiQuotaExhausted,
  normalizeExtracted,
  userPrompt
} = require('../grok-extract');

const TIVOLI = {
  id: 'tivoli',
  organizer: 'CAI Tivoli',
  url: 'https://www.caitivoli.it/programma.pdf',
  kind: 'pdf',
  extractor: 'grok'
};

const VITERBO = {
  id: 'viterbo',
  organizer: 'CAI Viterbo',
  url: 'https://www.caiviterbo.it/index.php/programma',
  kind: 'html',
  extractor: 'grok'
};

const now = DateTime.fromISO('2026-08-30', { zone: 'Europe/Rome' });

test('htmlToText drops scripts and keeps row breaks', () => {
  const text = htmlToText(`
    <html><head><script>window.x=1</script></head>
    <body>
      <p>Dom 20 set</p>
      <div>Monti Reatini<br>Monte Pozzoni</div>
    </body></html>
  `);
  assert.match(text, /Dom 20 set/);
  assert.match(text, /Monte Pozzoni/);
  assert.doesNotMatch(text, /window\.x/);
});

test('normalizeExtracted builds a stable id and fills CAI defaults', () => {
  const excursion = normalizeExtracted({
    title: 'Anello Monte Morra',
    date: '2026-09-20',
    dateEnd: null,
    category: 'E',
    location: 'Monti Lucretili',
    link: '/uscita/morra',
    time: '6 h',
    transport: 'auto private',
    distanceKm: 13,
    durationHours: 6
  }, TIVOLI, { now });

  assert.equal(excursion.id.startsWith('tivoli-'), true);
  assert.equal(excursion.organizer, 'CAI Tivoli');
  assert.equal(excursion.dateEnd, '2026-09-20');
  assert.equal(excursion.days, 1);
  assert.equal(excursion.region, 'Lazio');
  assert.equal(excursion.privateCar, true);
  assert.equal(excursion.distanceKm, 13);
  assert.match(excursion.link, /uscita\/morra$/);
  assert.equal(excursion.lat, 42.148);
  assert.equal(excursion.lng, 12.894);
  assert.equal(excursion.coordinatesQuality, 'massif');
});

test('normalizeExtracted does not pin unknown places to Rome', () => {
  const excursion = normalizeExtracted({
    title: 'Open day arrampicata',
    date: '2026-09-20',
    dateEnd: null,
    category: 'E',
    location: 'Non specificato',
    link: null,
    time: null,
    transport: null,
    distanceKm: null,
    durationHours: null
  }, VITERBO, { now });

  assert.equal(excursion.lat, undefined);
  assert.equal(excursion.lng, undefined);
});

test('normalizeExtracted accepts a confident Gemini hiking zone', () => {
  const excursion = normalizeExtracted({
    title: 'Anello Monte Nuria',
    date: '2026-09-20',
    dateEnd: null,
    category: 'E',
    location: 'Monte Nuria e Rascino',
    link: null,
    time: null,
    transport: null,
    distanceKm: null,
    durationHours: null,
    latitude: 42.291,
    longitude: 13.121,
    coordinatesQuality: 'massif',
    coordinatesConfidence: 0.91
  }, VITERBO, { now });

  assert.equal(excursion.lat, 42.291);
  assert.equal(excursion.lng, 13.121);
  assert.equal(excursion.coordinatesQuality, 'massif');
});

test('Gemini zones reject low confidence and a non-Rome outing pinned to Rome', () => {
  assert.equal(geminiZoneCoords({
    latitude: 42.291,
    longitude: 13.121,
    coordinatesQuality: 'massif',
    coordinatesConfidence: 0.4
  }, { title: 'Monte Nuria', location: 'Rascino' }), null);

  assert.equal(geminiZoneCoords({
    latitude: 41.891,
    longitude: 12.492,
    coordinatesQuality: 'massif',
    coordinatesConfidence: 0.99
  }, { title: 'Monte Nuria', location: 'Rascino' }), null);
});

test('normalizeExtracted drops past dates and invalid rows', () => {
  assert.equal(normalizeExtracted({
    title: 'Vecchia gita',
    date: '2026-01-01',
    dateEnd: '2026-01-02',
    category: 'E',
    location: 'Simbruini',
    link: null,
    time: null,
    transport: null,
    distanceKm: null,
    durationHours: null
  }, TIVOLI, { now }), null);

  assert.equal(normalizeExtracted({ title: '', date: '2026-09-20' }, TIVOLI, { now }), null);
});

test('classifyGeminiError treats billing 429 as quota and other 429 as rate limits', () => {
  const quota = classifyGeminiError(429, 'You exceeded your current quota, please check your plan and billing details.');
  assert.equal(quota.kind, 'quota');
  assert.equal(quota.retryAfterMs, null);
  assert.equal(isGeminiQuotaError({ kind: 'quota' }), true);

  const rate = classifyGeminiError(429, '{"error":{"status":"RESOURCE_EXHAUSTED","retryDelay":"12s"}}');
  assert.equal(rate.kind, 'rate_limit');
  assert.equal(rate.retryAfterMs, 12_000);

  const busy = classifyGeminiError(503, 'high demand');
  assert.equal(busy.kind, 'unavailable');
});

test('extractFromSource does not retry a quota 429', async () => {
  resetGeminiQuotaExhausted();
  let calls = 0;
  await assert.rejects(
    () => extractFromSource(VITERBO, { kind: 'html', text: 'calendario' }, {
      apiKey: 'test-key',
      now,
      retries: 2,
      sleep: async () => {
        throw new Error('quota must not sleep-retry');
      },
      fetchImpl: async () => {
        calls += 1;
        return {
          ok: false,
          status: 429,
          headers: { get: () => null },
          text: async () => '{"error":{"message":"You exceeded your current quota, please check your plan and billing details."}}'
        };
      }
    }),
    /quota/
  );
  assert.equal(calls, 1);
  assert.equal(process.env.GEMINI_QUOTA_EXHAUSTED, '1');
  resetGeminiQuotaExhausted();
});

test('Facebook pages skip HTML fetch and ask Gemini to search the profile', async () => {
  const gallinaro = {
    id: 'gallinaro',
    organizer: 'CAI Gallinaro',
    url: 'https://www.facebook.com/p/CAI-Gallinaro-6157261685',
    kind: 'discover',
    template: 'facebook',
    extractor: 'gemini'
  };

  assert.equal(isFacebookUrl(gallinaro.url), true);
  await assert.rejects(
    () => fetchDocument(gallinaro, { axiosImpl: { get: async () => { throw new Error('should not fetch Facebook'); } } }),
    /Facebook/
  );

  const prompt = userPrompt(gallinaro, { kind: 'discover', text: '' }, { now });
  assert.match(prompt, /Facebook/);
  const body = buildRequestBody(gallinaro, { kind: 'discover', text: '' }, { now });
  assert.deepEqual(body.tools, [{ googleSearch: {} }]);
});

test('buildRequestBody attaches the PDF and enables Gemini search for discover', () => {
  const pdfBody = buildRequestBody(TIVOLI, { kind: 'pdf', bytes: Buffer.from('%PDF-1.4 test') }, { now });
  const parts = pdfBody.contents[0].parts;
  assert.equal(parts.some((part) => part.inline_data?.mime_type === 'application/pdf'), true);
  assert.equal(pdfBody.tools, undefined);

  const discoverBody = buildRequestBody({
    ...VITERBO,
    kind: 'discover'
  }, { kind: 'discover', text: 'programma' }, { now });
  assert.deepEqual(discoverBody.tools, [{ googleSearch: {} }]);
});

test('extractFromSource parses Gemini JSON and ignores past rows', async () => {
  const payload = {
    candidates: [{
      content: {
        parts: [{
          text: JSON.stringify({
            excursions: [
              {
                title: 'Selva di Malano',
                date: '2026-09-28',
                dateEnd: null,
                category: 'E',
                location: 'Tuscia',
                link: null,
                time: '5 ore',
                transport: 'pullman',
                distanceKm: 11,
                durationHours: 5,
                latitude: 42.42,
                longitude: 12.1,
                coordinatesQuality: 'massif',
                coordinatesConfidence: 0.95
              },
              {
                title: 'Capodanno',
                date: '2026-01-01',
                dateEnd: null,
                category: 'T',
                location: 'Viterbo',
                link: null,
                time: null,
                transport: null,
                distanceKm: null,
                durationHours: null,
                latitude: null,
                longitude: null,
                coordinatesQuality: null,
                coordinatesConfidence: null
              }
            ]
          })
        }]
      }
    }]
  };

  const excursions = await extractFromSource(VITERBO, { kind: 'html', text: 'calendario' }, {
    apiKey: 'test-key',
    now,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      json: async () => payload,
      text: async () => JSON.stringify(payload)
    })
  });

  assert.equal(excursions.length, 1);
  assert.equal(excursions[0].title, 'Selva di Malano');
  assert.equal(excursions[0].id.startsWith('viterbo-'), true);
  assert.equal(excursions[0].privateCar, false);
  assert.equal(excursions[0].organizer, 'CAI Viterbo');
  assert.equal(excursions[0].lat, 42.417);
  assert.equal(excursions[0].coordinatesQuality, 'massif');
});
