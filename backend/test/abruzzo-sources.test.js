const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ABRUZZO_SOURCES, findSource } = require('../sources');

test('Abruzzo batch 1 overrides win over registry discover stubs', () => {
  assert.equal(ABRUZZO_SOURCES.length, 11);

  const pescara = findSource('cai-pescara-9234005');
  assert.ok(pescara);
  assert.equal(pescara.enabled, true);
  assert.equal(pescara.kind, 'pdf');
  assert.equal(pescara.template, 'pdf-programma');
  assert.equal(pescara.extractor, 'gemini');
  assert.equal(pescara.region, 'Abruzzo');
  assert.match(pescara.url, /programma_2026_cai_pescara/);
  assert.equal(pescara.directoryId, '9234005');

  const torre = findSource('cai-torre-de-passeri-9134014');
  const popoli = findSource('cai-popoli-9234016');
  assert.ok(torre && popoli);
  assert.equal(torre.url, popoli.url);
  assert.equal(torre.parentSectionId, 'cai-popoli-9234016');
  assert.equal(torre.sectionType, 'subsection');
  assert.equal(torre.extractor, 'gemini');
  assert.equal(torre.enabled, true);
});

test('Abruzzo batch 2: PDF gemini + Chieti ICS deterministic', () => {
  const carsoli = findSource('cai-carsoli-9234024');
  assert.ok(carsoli);
  assert.equal(carsoli.enabled, true);
  assert.equal(carsoli.kind, 'pdf');
  assert.equal(carsoli.template, 'pdf-programma');
  assert.equal(carsoli.extractor, 'gemini');
  assert.equal(carsoli.region, 'Abruzzo');
  assert.match(carsoli.url, /calendario-sociale-2026\.pdf$/);

  const arsita = findSource('cai-arsita-9234026');
  assert.ok(arsita);
  assert.equal(arsita.kind, 'pdf');
  assert.equal(arsita.extractor, 'gemini');
  assert.match(arsita.url, /PROGRAMMA-CAI-Arsita-2026\.pdf$/);

  const valVibrata = findSource('cai-val-vibrata-monti-gemelli-9234027');
  assert.ok(valVibrata);
  assert.equal(valVibrata.kind, 'pdf');
  assert.equal(valVibrata.extractor, 'gemini');
  // Keep upstream typo PIeghevole in the published URL.
  assert.match(valVibrata.url, /VAL-VIBRATA-PIeghevole-calendario-26SITO\.pdf$/);

  const chieti = findSource('cai-chieti-9234001');
  assert.ok(chieti);
  assert.equal(chieti.enabled, true);
  assert.equal(chieti.kind, 'ics');
  assert.equal(chieti.template, 'icalendar');
  assert.equal(chieti.extractor, 'deterministic');
  assert.equal(chieti.region, 'Abruzzo');
  assert.match(chieti.url, /Calendario_Sezionale_CAI_Chieti_2026\.ics$/);
  assert.equal(chieti.calendarUrls[0], chieti.url);

  const atessa = findSource('cai-atessa-9234011');
  assert.ok(atessa);
  assert.equal(atessa.enabled, true);
  assert.equal(atessa.kind, 'pdf');
  assert.equal(atessa.template, 'pdf-programma');
  assert.equal(atessa.extractor, 'gemini');
  assert.match(atessa.url, /CALENDARIO-CAI-2026\.pdf$/);
  // Override wins over registry ics primary.
  assert.equal(atessa.calendarUrls[0], atessa.url);
});
