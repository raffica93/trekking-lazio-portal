const { test } = require('node:test');
const assert = require('node:assert/strict');
const { FRIULI_SOURCES, findSource } = require('../sources');

const ASCA_PDF = 'https://caitolmezzo.it/escursioni.pdf';
const SAF_PDF = 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf';
const SAG_PDF = 'https://caisag.ts.it/wp-content/uploads/2026/06/SAG-AXXXO-CALENDARIO-2026-giu.pdf';

const ASCA_IDS = [
  'cai-tolmezzo-9222002',
  'cai-forni-di-sopra-9222021',
  'cai-ravascletto-9222020',
  'cai-sappada-9220033',
  'cai-forni-avoltri-9222022',
  'cai-moggio-udinese-9222013',
  'cai-tarvisio-9222010'
];

const SAF_IDS = [
  'cai-s-a-f-udine-9222003',
  'cai-artegna-9122009',
  'cai-palmanova-9122020',
  'cai-pasian-di-prato-9122012',
  'cai-s-daniele-del-friuli-9122014',
  'cai-tarcento-cai-udine-9122015'
];

const SAG_IDS = [
  'cai-s-a-g-trieste-9222001',
  'cai-xxx-ottobre-9222011'
];

test('Friuli overrides win over registry discover stubs', () => {
  assert.equal(FRIULI_SOURCES.length, 27);

  for (const raw of FRIULI_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.region, 'Friuli-Venezia Giulia', raw.id);
    assert.equal(source.status, 'calendar-found', raw.id);
    assert.equal(source.kind, 'pdf', raw.id);
    assert.equal(source.template, 'pdf-programma', raw.id);
    assert.equal(source.extractor, 'gemini', raw.id);
    // Override wins as calendarUrls[0] over registry discover stubs.
    assert.equal(source.calendarUrls[0], source.url, raw.id);
    assert.equal(source.url, raw.url, raw.id);
  }

  // Buja keeps HTTP URL (caigemona.it).
  const buja = findSource('cai-buja-9122003');
  assert.match(buja.url, /^http:\/\/www\.caigemona\.it\//);
  assert.equal(
    buja.url,
    'http://www.caigemona.it/dati/images/pdf/gjoldi_de_mont/GjoldileMontdeVierte_2026.pdf'
  );
  assert.equal(buja.sectionType, 'subsection');
  assert.equal(buja.parentSectionId, 'cai-gemona-del-friuli-9222007');

  // SAF sottosezioni retain registry parent links.
  const artegna = findSource('cai-artegna-9122009');
  assert.equal(artegna.sectionType, 'subsection');
  assert.equal(artegna.parentSectionId, 'cai-s-a-f-udine-9222003');

  const palmanova = findSource('cai-palmanova-9122020');
  assert.equal(palmanova.parentSectionId, 'cai-s-a-f-udine-9222003');

  const udine = findSource('cai-s-a-f-udine-9222003');
  assert.equal(udine.directoryId, '9222003');
  assert.equal(udine.sectionType, 'section');
});

test('Friuli shared hub PDF ids', () => {
  for (const id of ASCA_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, ASCA_PDF, id);
  }
  assert.equal(ASCA_IDS.length, 7);

  for (const id of SAF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, SAF_PDF, id);
  }
  assert.equal(SAF_IDS.length, 6);

  for (const id of SAG_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, SAG_PDF, id);
  }
  assert.equal(SAG_IDS.length, 2);

  // Hub PDF groups are disjoint from sezionali.
  const hubIds = new Set([...ASCA_IDS, ...SAF_IDS, ...SAG_IDS]);
  const sezionali = FRIULI_SOURCES.filter((s) => !hubIds.has(s.id));
  assert.equal(sezionali.length, 12);
  for (const s of sezionali) {
    assert.notEqual(s.url, ASCA_PDF, s.id);
    assert.notEqual(s.url, SAF_PDF, s.id);
    assert.notEqual(s.url, SAG_PDF, s.id);
  }

  // Pontebba has its own ASCA-named PDF, not the shared Tolmezzo hub URL.
  const pontebba = findSource('cai-pontebba-9222023');
  assert.equal(pontebba.url, 'https://www.caipontebba.it/gite/asca_2026.pdf');
});
