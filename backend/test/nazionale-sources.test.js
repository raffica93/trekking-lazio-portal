const { test } = require('node:test');
const assert = require('node:assert/strict');
const { NAZIONALE_SOURCES, findSource } = require('../sources');

const LOMBARDIA_PDF =
  'https://guidealpine.lombardia.it/wp-content/uploads/2025/10/All.B3_Calendario-GA-2026.pdf';
const PIEMONTE_PDF = 'https://www.guidealpinepiemonte.it/res/download/pdf/988_it.pdf';
const CAMPANIA_PDF =
  'https://www.guidealpinevulcanologichecampania.it/wp-content/uploads/2025/11/Locandina-corso-FPC-02-25_crgavc.pdf';

const EXPECTED = [
  {
    id: 'cai-agai-coll-lombardia-9102003',
    url: LOMBARDIA_PDF,
    directoryId: '9102003'
  },
  {
    id: 'cai-agai-coll-piemonte-9102001',
    url: PIEMONTE_PDF,
    directoryId: '9102001'
  },
  {
    id: 'cai-agai-coll-campania-9102013',
    url: CAMPANIA_PDF,
    directoryId: '9102013'
  }
];

test('Nazionale AGAI overrides win over registry discover stubs', () => {
  assert.equal(NAZIONALE_SOURCES.length, 3);

  for (const raw of NAZIONALE_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.region, 'Nazionale', raw.id);
    assert.equal(source.status, 'calendar-found', raw.id);
    assert.equal(source.kind, 'pdf', raw.id);
    assert.equal(source.template, 'pdf-programma', raw.id);
    assert.equal(source.extractor, 'gemini', raw.id);
    // Override wins as calendarUrls[0] over registry discover stubs.
    assert.equal(source.calendarUrls[0], source.url, raw.id);
    assert.equal(source.url, raw.url, raw.id);
  }
});

test('Nazionale AGAI collegio PDF urls', () => {
  for (const expected of EXPECTED) {
    const source = findSource(expected.id);
    assert.ok(source, expected.id);
    assert.equal(source.url, expected.url, expected.id);
    assert.equal(source.directoryId, expected.directoryId, expected.id);
    assert.equal(source.kind, 'pdf', expected.id);
    assert.equal(source.template, 'pdf-programma', expected.id);
    assert.equal(source.extractor, 'gemini', expected.id);
    assert.equal(source.enabled, true, expected.id);
    assert.equal(source.region, 'Nazionale', expected.id);
  }

  // Out of scope for this batch: Marche HTML, CAAI/CNSAS hubs, unreachable AGAI nazionale.
  const marche = findSource('cai-agai-coll-marche-9102009');
  assert.ok(marche);
  assert.notEqual(marche.kind, 'pdf');
  assert.equal(marche.enabled, false);

  const agaiNaz = findSource('cai-assoc-guide-alpine-ital-9200002');
  assert.ok(agaiNaz);
  assert.notEqual(agaiNaz.kind, 'pdf');
  assert.equal(agaiNaz.enabled, false);
});
