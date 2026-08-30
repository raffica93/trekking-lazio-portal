const test = require('node:test');
const assert = require('node:assert/strict');
const { DateTime } = require('luxon');
const {
  buildRequestBody,
  extractFromSource,
  htmlToText,
  normalizeExtracted
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
                durationHours: 5
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
                durationHours: null
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
});
