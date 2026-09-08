const { test } = require('node:test');
const assert = require('node:assert/strict');
const { CALABRIA_SOURCES, SARDEGNA_SOURCES, findSource } = require('../sources');

test('Calabria overrides win over registry discover stubs', () => {
  assert.equal(CALABRIA_SOURCES.length, 5);

  const castrovillari = findSource('cai-castrovillari-9244005');
  assert.ok(castrovillari);
  assert.equal(castrovillari.enabled, true);
  assert.equal(castrovillari.kind, 'pdf');
  assert.equal(castrovillari.template, 'pdf-programma');
  assert.equal(castrovillari.extractor, 'gemini');
  assert.equal(castrovillari.region, 'Calabria');
  assert.match(castrovillari.url, /programma2026\.pdf$/);
  assert.equal(castrovillari.directoryId, '9244005');

  const cerchiara = findSource('cai-cerchiara-di-calabria-9144003');
  assert.ok(cerchiara);
  assert.equal(cerchiara.enabled, true);
  assert.equal(cerchiara.kind, 'pdf');
  assert.equal(cerchiara.template, 'pdf-programma');
  assert.equal(cerchiara.extractor, 'gemini');
  assert.equal(cerchiara.region, 'Calabria');
  assert.match(cerchiara.url, /programmacerchiara26\.pdf$/);
  assert.equal(cerchiara.parentSectionId, 'cai-castrovillari-9244005');
  assert.equal(cerchiara.sectionType, 'subsection');

  const cosenza = findSource('cai-cosenza-9244002');
  assert.ok(cosenza);
  assert.equal(cosenza.enabled, true);
  assert.equal(cosenza.kind, 'pdf');
  assert.equal(cosenza.template, 'pdf-programma');
  assert.equal(cosenza.extractor, 'gemini');
  assert.equal(cosenza.region, 'Calabria');
  assert.match(cosenza.url, /programma-cai-cosenza-2026\.pdf$/);

  const mendicino = findSource('cai-mendicino-9144004');
  assert.ok(mendicino);
  assert.equal(mendicino.url, cosenza.url);
  assert.equal(mendicino.parentSectionId, 'cai-cosenza-9244002');
  assert.equal(mendicino.sectionType, 'subsection');
  assert.equal(mendicino.extractor, 'gemini');
  assert.equal(mendicino.enabled, true);
  assert.equal(mendicino.region, 'Calabria');

  const reggio = findSource('cai-reggio-calabria-9244001');
  assert.ok(reggio);
  assert.equal(reggio.enabled, true);
  assert.equal(reggio.kind, 'pdf');
  assert.equal(reggio.template, 'pdf-programma');
  assert.equal(reggio.extractor, 'gemini');
  assert.equal(reggio.region, 'Calabria');
  assert.match(reggio.url, /drive\.google\.com\/uc\?export=download&id=10kXORYlyXLWHHRmG7ZB11iCXdeeEPoUh$/);
  // Override wins over registry ics primary.
  assert.equal(reggio.calendarUrls[0], reggio.url);
});

test('Sardegna overrides win over registry discover stubs', () => {
  assert.equal(SARDEGNA_SOURCES.length, 3);

  const cagliari = findSource('cai-cagliari-9248001');
  assert.ok(cagliari);
  assert.equal(cagliari.enabled, true);
  assert.equal(cagliari.kind, 'pdf');
  assert.equal(cagliari.template, 'pdf-programma');
  assert.equal(cagliari.extractor, 'gemini');
  assert.equal(cagliari.region, 'Sardegna');
  assert.match(cagliari.url, /PAE2026s\.pdf$/);
  assert.equal(cagliari.calendarUrls[0], cagliari.url);

  const nuoro = findSource('cai-nuoro-9248002');
  assert.ok(nuoro);
  assert.equal(nuoro.enabled, true);
  assert.equal(nuoro.kind, 'pdf');
  assert.equal(nuoro.template, 'pdf-programma');
  assert.equal(nuoro.extractor, 'gemini');
  assert.equal(nuoro.region, 'Sardegna');
  assert.match(nuoro.url, /Calendario-Escursionistico-Cai-Nuoro-2026-3\.pdf$/);
  // Override wins over registry ics primary.
  assert.equal(nuoro.calendarUrls[0], nuoro.url);

  const oristano = findSource('cai-oristano-9248004');
  assert.ok(oristano);
  assert.equal(oristano.enabled, true);
  assert.equal(oristano.kind, 'pdf');
  assert.equal(oristano.template, 'pdf-programma');
  assert.equal(oristano.extractor, 'gemini');
  assert.equal(oristano.region, 'Sardegna');
  assert.match(oristano.url, /2026-calendario-completo\.pdf$/);
  // Override wins over registry ics primary.
  assert.equal(oristano.calendarUrls[0], oristano.url);
});
