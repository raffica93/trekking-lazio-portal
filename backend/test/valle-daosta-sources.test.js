const { test } = require('node:test');
const assert = require('node:assert/strict');
const { VALLE_DAOSTA_SOURCES, findSource } = require('../sources');

test("Valle d'Aosta overrides win over registry discover stubs", () => {
  assert.equal(VALLE_DAOSTA_SOURCES.length, 4);

  const aosta = findSource('cai-aosta-9214001');
  assert.ok(aosta);
  assert.equal(aosta.enabled, true);
  assert.equal(aosta.kind, 'pdf');
  assert.equal(aosta.template, 'pdf-programma');
  assert.equal(aosta.extractor, 'gemini');
  assert.equal(aosta.region, "Valle d'Aosta");
  assert.match(aosta.url, /annuario-2026-cai-aosta\.pdf$/);
  assert.equal(aosta.directoryId, '9214001');
  // Override wins over registry missing-website / empty calendars.
  assert.equal(aosta.calendarUrls[0], aosta.url);
  assert.equal(aosta.status, 'calendar-found');

  const barthelemy = findSource('cai-barthelemy-9114002');
  assert.ok(barthelemy);
  assert.equal(barthelemy.enabled, true);
  assert.equal(barthelemy.kind, 'pdf');
  assert.equal(barthelemy.template, 'pdf-programma');
  assert.equal(barthelemy.extractor, 'gemini');
  assert.equal(barthelemy.region, "Valle d'Aosta");
  assert.match(barthelemy.url, /CAI-StB-Annuario-2026\.pdf$/);
  assert.equal(barthelemy.parentSectionId, 'cai-aosta-9214001');
  assert.equal(barthelemy.sectionType, 'subsection');
  assert.equal(barthelemy.calendarUrls[0], barthelemy.url);
  assert.equal(barthelemy.status, 'calendar-found');

  const chatillon = findSource('cai-chatillon-9214004');
  assert.ok(chatillon);
  assert.equal(chatillon.enabled, true);
  assert.equal(chatillon.kind, 'pdf');
  assert.equal(chatillon.template, 'pdf-programma');
  assert.equal(chatillon.extractor, 'gemini');
  assert.equal(chatillon.region, "Valle d'Aosta");
  assert.match(chatillon.url, /Pieghevole-2026\.pdf$/);
  // Override wins as calendarUrls[0] over registry Classificazione_difficolta.pdf.
  assert.equal(chatillon.calendarUrls[0], chatillon.url);
  assert.ok(
    !chatillon.calendarUrls.includes(chatillon.url) || chatillon.calendarUrls[0] === chatillon.url
  );
  assert.equal(chatillon.status, 'calendar-found');

  const verres = findSource('cai-verres-9214003');
  assert.ok(verres);
  assert.equal(verres.enabled, true);
  assert.equal(verres.kind, 'pdf');
  assert.equal(verres.template, 'pdf-programma');
  assert.equal(verres.extractor, 'gemini');
  assert.equal(verres.region, "Valle d'Aosta");
  assert.match(verres.url, /CAI%20Verres%20-%20Opuscolo%202026\.pdf$/);
  assert.equal(verres.calendarUrls[0], verres.url);
  assert.equal(verres.status, 'calendar-found');

  // Gressoney explicitly out of this batch.
  const gressoney = findSource('cai-gressoney-9214002');
  assert.ok(gressoney);
  assert.notEqual(gressoney.kind, 'pdf');
  assert.equal(gressoney.enabled, false);
});
