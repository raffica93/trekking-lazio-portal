const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ABRUZZO_SOURCES, findSource } = require('../sources');

test('Abruzzo batch 1 overrides win over registry discover stubs', () => {
  assert.equal(ABRUZZO_SOURCES.length, 6);

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
