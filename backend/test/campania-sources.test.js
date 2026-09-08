const { test } = require('node:test');
const assert = require('node:assert/strict');
const { CAMPANIA_SOURCES, findSource } = require('../sources');

test('Campania overrides win over registry discover stubs', () => {
  assert.equal(CAMPANIA_SOURCES.length, 6);

  const avellino = findSource('cai-avellino-9238004');
  assert.ok(avellino);
  assert.equal(avellino.enabled, true);
  assert.equal(avellino.kind, 'pdf');
  assert.equal(avellino.template, 'pdf-programma');
  assert.equal(avellino.extractor, 'gemini');
  assert.equal(avellino.region, 'Campania');
  assert.match(avellino.url, /Programma_Attivita_CAI_Avellino_2026\.pdf$/);
  assert.equal(avellino.directoryId, '9238004');
  // Override wins over registry unreachable / empty calendars.
  assert.equal(avellino.calendarUrls[0], avellino.url);
  assert.equal(avellino.status, 'calendar-found');

  const avella = findSource('cai-avella-9138007');
  assert.ok(avella);
  assert.equal(avella.url, avellino.url);
  assert.equal(avella.parentSectionId, 'cai-avellino-9238004');
  assert.equal(avella.sectionType, 'subsection');
  assert.equal(avella.extractor, 'gemini');
  assert.equal(avella.enabled, true);
  assert.equal(avella.region, 'Campania');
  assert.equal(avella.calendarUrls[0], avella.url);
  assert.equal(avella.status, 'calendar-found');

  const benevento = findSource('cai-benevento-9238008');
  assert.ok(benevento);
  assert.equal(benevento.enabled, true);
  assert.equal(benevento.kind, 'pdf');
  assert.equal(benevento.template, 'pdf-programma');
  assert.equal(benevento.extractor, 'gemini');
  assert.equal(benevento.region, 'Campania');
  assert.match(benevento.url, /Programma_CAI_BN_2026\.pdf$/);
  assert.equal(benevento.calendarUrls[0], benevento.url);
  assert.equal(benevento.status, 'calendar-found');

  const caserta = findSource('cai-caserta-9238006');
  assert.ok(caserta);
  assert.equal(caserta.enabled, true);
  assert.equal(caserta.kind, 'pdf');
  assert.equal(caserta.template, 'pdf-programma');
  assert.equal(caserta.extractor, 'gemini');
  assert.equal(caserta.region, 'Campania');
  assert.match(caserta.url, /Calendario%20escursionistico%202026\.pdf$/);
  // Override wins as calendarUrls[0] even when registry already listed this URL.
  assert.equal(caserta.calendarUrls[0], caserta.url);

  const piedimonte = findSource('cai-piedimonte-matese-9238005');
  assert.ok(piedimonte);
  assert.equal(piedimonte.enabled, true);
  assert.equal(piedimonte.kind, 'pdf');
  assert.equal(piedimonte.template, 'pdf-programma');
  assert.equal(piedimonte.extractor, 'gemini');
  assert.equal(piedimonte.region, 'Campania');
  assert.match(piedimonte.url, /programma_sezionale_2026\.pdf$/);
  assert.equal(piedimonte.calendarUrls[0], piedimonte.url);

  const monteBulgheria = findSource('cai-monte-bulgheria-9238010');
  assert.ok(monteBulgheria);
  assert.equal(monteBulgheria.enabled, true);
  assert.equal(monteBulgheria.kind, 'pdf');
  assert.equal(monteBulgheria.template, 'pdf-programma');
  assert.equal(monteBulgheria.extractor, 'gemini');
  assert.equal(monteBulgheria.region, 'Campania');
  assert.match(monteBulgheria.url, /Programma_Sez_MB_2026\.pdf$/);
  assert.equal(monteBulgheria.calendarUrls[0], monteBulgheria.url);
});
