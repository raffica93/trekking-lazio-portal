const { test } = require('node:test');
const assert = require('node:assert/strict');
const { TRENTINO_SOURCES, findSource } = require('../sources');

const APPIANO_PDF =
  'https://organizzazione.cai.it/sez-appiano-caiaa/wp-content/uploads/sites/152/2025/12/PROGRAMMA-ATTIVITA-CAI-APPIANO-2026.pdf';
const BOLZANO_PDF =
  'https://organizzazione.cai.it/sez-bolzano-caiaa/wp-content/uploads/sites/6/2025/12/Attivita-Cai-2026_compressed.pdf';
const BRONZOLO_PDF =
  'https://organizzazione.cai.it/sez-bronzolo/wp-content/uploads/sites/163/2026/01/Calendario-2026-Cai-Bronzolo_Optimized-1.pdf';
const EGNA_PDF = 'http://www.caiegna.it/wp-content/uploads/Programma-2026_2_compressed.pdf';
const LEDRENSE_PDF = 'https://www.satledrense.it/wp-content/uploads/2026/02/Attivita-SAT-2026.pdf';
const MALE_PDF = 'http://www.satmale.it/wp-content/uploads/2026/02/Sat-di-Male-programma-attivita-2026.pdf';
const MORI_PDF =
  'https://www.sat-mori.it/app/download/15433973123/Sat+Mori+2026_Libretto_v3_Optimized3.pdf?t=1785509041';
const PERGINE_PDF = 'https://www.satpergine.it/wp-content/uploads/2026/02/SAT_Programma-2026-WEB.pdf';
const SOSAT_PDF = 'https://www.sosat.it/wp-content/uploads/2026/01/SOSAT_Programma-guide-2026_WEB.pdf';
const TRENTO_PDF = "http://www.sattrento.it/PROGRAMMA%20ATTIVITA'%20SAT%20TRENTO%202026_def.pdf";
const CAVALESE_ICS = 'https://www.satcavalese.it/events/?ical=1';

const ALTO_ADIGE_PDF_IDS = [
  'cai-appiano-c-a-i-a-a-9219001',
  'cai-bolzano-9219002',
  'cai-bronzolo-c-a-i-a-a-9219004',
  'cai-egna-c-a-i-a-a-9219007'
];

const SAT_PDF_IDS = [
  'cai-s-a-t-ledrense-9118033',
  'cai-s-a-t-male-9118036',
  'cai-s-a-t-mori-9118041',
  'cai-s-a-t-pergine-9118043',
  'cai-s-a-t-s-o-s-a-t-9118061',
  'cai-s-a-t-trento-9118068'
];

test('Trentino-Alto Adige overrides win over registry discover stubs', () => {
  assert.equal(TRENTINO_SOURCES.length, 11);

  const pdfCount = TRENTINO_SOURCES.filter((s) => s.kind === 'pdf').length;
  const icsCount = TRENTINO_SOURCES.filter((s) => s.kind === 'ics').length;
  assert.equal(pdfCount, 10);
  assert.equal(icsCount, 1);

  for (const raw of TRENTINO_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.region, 'Trentino-Alto Adige', raw.id);
    assert.equal(source.status, 'calendar-found', raw.id);
    // Override wins as calendarUrls[0] over registry discover stubs.
    assert.equal(source.calendarUrls[0], source.url, raw.id);
    assert.equal(source.url, raw.url, raw.id);
    if (raw.kind === 'ics') {
      assert.equal(source.kind, 'ics', raw.id);
      assert.equal(source.template, 'icalendar', raw.id);
      assert.equal(source.extractor, 'deterministic', raw.id);
    } else {
      assert.equal(source.kind, 'pdf', raw.id);
      assert.equal(source.template, 'pdf-programma', raw.id);
      assert.equal(source.extractor, 'gemini', raw.id);
    }
  }
});

test('Trentino Alto Adige PDF + SAT PDF/ICS urls', () => {
  assert.equal(findSource('cai-appiano-c-a-i-a-a-9219001').url, APPIANO_PDF);
  assert.equal(findSource('cai-bolzano-9219002').url, BOLZANO_PDF);
  assert.equal(findSource('cai-bronzolo-c-a-i-a-a-9219004').url, BRONZOLO_PDF);
  assert.equal(findSource('cai-egna-c-a-i-a-a-9219007').url, EGNA_PDF);
  assert.equal(findSource('cai-s-a-t-ledrense-9118033').url, LEDRENSE_PDF);
  assert.equal(findSource('cai-s-a-t-male-9118036').url, MALE_PDF);
  assert.equal(findSource('cai-s-a-t-mori-9118041').url, MORI_PDF);
  assert.equal(findSource('cai-s-a-t-pergine-9118043').url, PERGINE_PDF);
  assert.equal(findSource('cai-s-a-t-s-o-s-a-t-9118061').url, SOSAT_PDF);
  assert.equal(findSource('cai-s-a-t-trento-9118068').url, TRENTO_PDF);

  const cavalese = findSource('cai-s-a-t-cavalese-9118022');
  assert.equal(cavalese.url, CAVALESE_ICS);
  assert.equal(cavalese.kind, 'ics');
  assert.equal(cavalese.template, 'icalendar');
  assert.equal(cavalese.extractor, 'deterministic');

  // HTTP URLs preserved (Egna, Male', Trento).
  assert.match(findSource('cai-egna-c-a-i-a-a-9219007').url, /^http:\/\/www\.caiegna\.it\//);
  assert.match(findSource('cai-s-a-t-male-9118036').url, /^http:\/\/www\.satmale\.it\//);
  assert.match(findSource('cai-s-a-t-trento-9118068').url, /^http:\/\/www\.sattrento\.it\//);

  assert.equal(ALTO_ADIGE_PDF_IDS.length, 4);
  assert.equal(SAT_PDF_IDS.length, 6);

  // Alto Adige sezioni are top-level sections.
  for (const id of ALTO_ADIGE_PDF_IDS) {
    const source = findSource(id);
    assert.equal(source.sectionType, 'section', id);
  }

  // SAT sottosezioni retain registry parent link to SAT centrale.
  for (const id of [...SAT_PDF_IDS, 'cai-s-a-t-cavalese-9118022']) {
    const source = findSource(id);
    assert.equal(source.sectionType, 'subsection', id);
    assert.equal(source.parentSectionId, 'cai-s-a-t-9218001', id);
  }

  const bolzano = findSource('cai-bolzano-9219002');
  assert.equal(bolzano.directoryId, '9219002');
  assert.equal(bolzano.sectionType, 'section');

  // Registry ICS stubs for Appiano/Bolzano/Bronzolo overridden by PDF.
  for (const id of [
    'cai-appiano-c-a-i-a-a-9219001',
    'cai-bolzano-9219002',
    'cai-bronzolo-c-a-i-a-a-9219004'
  ]) {
    const source = findSource(id);
    assert.equal(source.kind, 'pdf', id);
    assert.ok(!/ical=1/.test(source.url), id);
  }
});
