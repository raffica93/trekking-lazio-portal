const { test } = require('node:test');
const assert = require('node:assert/strict');
const { VENETO_SOURCES, findSource } = require('../sources');

test('Veneto overrides win over registry discover stubs', () => {
  assert.equal(VENETO_SOURCES.length, 23);

  for (const raw of VENETO_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.kind, 'pdf', raw.id);
    assert.equal(source.template, 'pdf-programma', raw.id);
    assert.equal(source.extractor, 'gemini', raw.id);
    assert.equal(source.region, 'Veneto', raw.id);
    assert.equal(source.status, 'calendar-found', raw.id);
    // Override wins as calendarUrls[0] over registry discover stubs.
    assert.equal(source.calendarUrls[0], source.url, raw.id);
    assert.equal(source.url, raw.url, raw.id);
  }

  // Asiago/Spresiano keep HTTP URLs (HTTPS SSL broken / 999).
  const asiago = findSource('cai-asiago-9220040');
  assert.match(asiago.url, /^http:\/\/www\.caiasiago\.it\//);
  assert.equal(
    asiago.url,
    'http://www.caiasiago.it/documenti/Libretto%20CAI%20Asiago%202026.pdf'
  );

  const spresiano = findSource('cai-spresiano-9220056');
  assert.match(spresiano.url, /^http:\/\/www\.cai-spresiano\.it\//);
  assert.equal(
    spresiano.url,
    'http://www.cai-spresiano.it/escursioni26/prgm_short2026.pdf'
  );

  // Pieve shares Calalzo estate opuscolo PDF.
  const calalzo = findSource('cai-calalzo-di-cadore-9220035');
  const pieve = findSource('cai-pieve-di-cadore-9220022');
  assert.equal(pieve.url, calalzo.url);
  assert.match(calalzo.url, /Escursioni-estate-2026-opuscolo\.pdf$/);

  // Pedemontana Grappa uses Feltre parent Annuario PDF.
  // Feltre itself stays registry-only (already html-calendar; not in VENETO_SOURCES).
  const pedemontana = findSource('cai-pedemontana-grappa-9120023');
  assert.match(pedemontana.url, /Annuario-CAI-Feltre-2026\.pdf$/);
  assert.equal(pedemontana.parentSectionId, 'cai-feltre-9220013');
  assert.equal(pedemontana.sectionType, 'subsection');
  assert.ok(!VENETO_SOURCES.some((s) => s.id === 'cai-feltre-9220013'));
  const feltre = findSource('cai-feltre-9220013');
  assert.ok(feltre);
  assert.notEqual(feltre.kind, 'pdf');
  assert.notEqual(feltre.template, 'pdf-programma');

  // Subsections retain registry parent links.
  const canal = findSource('cai-canal-di-brenta-9120022');
  assert.equal(canal.sectionType, 'subsection');
  assert.equal(canal.parentSectionId, 'cai-bassano-del-grappa-9220010');

  const famiglia = findSource('cai-famiglia-alpinistica-9120013');
  assert.equal(famiglia.sectionType, 'subsection');
  assert.equal(famiglia.parentSectionId, 'cai-verona-9220003');

  const verona = findSource('cai-verona-9220003');
  assert.equal(verona.directoryId, '9220003');
  assert.match(verona.url, /libretto-2026\.pdf$/);
});
