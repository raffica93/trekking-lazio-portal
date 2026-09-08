const { test } = require("node:test");
const assert = require("node:assert/strict");
const { LOMBARDIA_SOURCES, findSource } = require('../sources');

const BRESCIA_PDF = 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf';
const VALTELLINESE_PDF = 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite.pdf';
const TEGLIO_PDF = 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite_CAI_TEGLIO.pdf';
const VIMERCATE_PDF = 'https://www.caivimercate.it/wp-content/uploads/2026/03/Programma-Escursionismo-2026-x-stampa-D-.pdf';
const MERATE_PDF = 'https://www.caimerate.it/wp/wp-content/uploads/programma-attivita-2026.pdf';
const MARIANO_PDF = 'http://www.caimariano.it/wp-content/uploads/2025/12/LibretttoCAI-2026.pdf';
const MEDA_PDF = 'https://www.comune.meda.mb.it/export/sites/default/.galleries/documenti/eventi-news/IDS26_Meda_LOCANDINA_.pdf';
const MANTOVA_ICS = 'https://organizzazione.cai.it/sez-mantova/eventi/?ical=1';
const GALLARATE_ICS = 'https://organizzazione.cai.it/sez-gallarate/eventi/?ical=1';
const PREMANA_ICS = 'https://organizzazione.cai.it/sez-premana/eventi/?ical=1';

const BRESCIA_PDF_IDS = [
  'cai-bagolino-9116018',
  'cai-brescia-9216005',
  'cai-cidneo-o-m-9116019',
  'cai-collebeato-9116110',
  'cai-iseo-diventata-sezione-9116023',
  'cai-manerbio-9116106',
  'cai-marone-9116024',
  'cai-nave-9116093',
  'cai-odolo-9116025',
  'cai-provaglio-d-iseo-9116123',
  'cai-santicolo-9116029',
];

const VALTELLINESE_PDF_IDS = [
  'cai-berbenno-9116142',
  'cai-ponte-in-valtellina-9116109',
  'cai-tirano-9116089',
  'cai-valdidentro-9116140',
  'cai-valtellinese-sondrio-9216001',
];

const TEGLIO_PDF_IDS = [
  'cai-teglio-9216158',
  'cai-teglio-diventata-sezione-9116143',
];

const VIMERCATE_PDF_IDS = [
  'cai-arcore-9116092',
  'cai-burago-molgora-9116134',
  'cai-cavenago-brianza-9116136',
  'cai-sulbiate-9116121',
  'cai-vimercate-9216048',
];

const MERATE_PDF_IDS = [
  'cai-merate-9216023',
  'cai-usmate-9116064',
];

const MARIANO_PDF_IDS = [
  'cai-arosio-9116060',
  'cai-mariano-comense-9216077',
];

const MEDA_PDF_IDS = [
  'cai-lentate-sul-seveso-9116061',
  'cai-meda-9216042',
];

const MANTOVA_ICS_IDS = [
  'cai-mantova-9216025',
  'cai-quistello-9116059',
  'cai-suzzara-9116097',
];

const GALLARATE_ICS_IDS = [
  'cai-casorate-sempione-9116045',
  'cai-gallarate-9216015',
];

const PREMANA_ICS_IDS = [
  'cai-esino-lario-9116099',
  'cai-premana-9216089',
];

test("Lombardia overrides win over registry discover stubs", () => {
  assert.equal(LOMBARDIA_SOURCES.length, 87);

  const pdfCount = LOMBARDIA_SOURCES.filter((s) => s.kind === "pdf").length;
  const icsCount = LOMBARDIA_SOURCES.filter((s) => s.kind === "ics").length;
  assert.equal(pdfCount, 59);
  assert.equal(icsCount, 28);

  for (const raw of LOMBARDIA_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.region, "Lombardia", raw.id);
    assert.equal(source.status, "calendar-found", raw.id);
    // Override wins as calendarUrls[0] over registry discover stubs.
    assert.equal(source.calendarUrls[0], source.url, raw.id);
    assert.equal(source.url, raw.url, raw.id);
    if (raw.kind === "ics") {
      assert.equal(source.kind, "ics", raw.id);
      assert.equal(source.template, "icalendar", raw.id);
      assert.equal(source.extractor, "deterministic", raw.id);
    } else {
      assert.equal(source.kind, "pdf", raw.id);
      assert.equal(source.template, "pdf-programma", raw.id);
      assert.equal(source.extractor, "gemini", raw.id);
    }
  }
});

test("Lombardia shared hub PDF + ICS urls", () => {
  for (const id of BRESCIA_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, BRESCIA_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(BRESCIA_PDF_IDS.length, 11);

  for (const id of VALTELLINESE_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, VALTELLINESE_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(VALTELLINESE_PDF_IDS.length, 5);

  for (const id of TEGLIO_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, TEGLIO_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(TEGLIO_PDF_IDS.length, 2);

  for (const id of VIMERCATE_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, VIMERCATE_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(VIMERCATE_PDF_IDS.length, 5);

  for (const id of MERATE_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, MERATE_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(MERATE_PDF_IDS.length, 2);

  for (const id of MARIANO_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, MARIANO_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(MARIANO_PDF_IDS.length, 2);

  for (const id of MEDA_PDF_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, MEDA_PDF, id);
    assert.equal(source.kind, "pdf", id);
  }
  assert.equal(MEDA_PDF_IDS.length, 2);

  for (const id of MANTOVA_ICS_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, MANTOVA_ICS, id);
    assert.equal(source.kind, "ics", id);
    assert.equal(source.template, "icalendar", id);
    assert.equal(source.extractor, "deterministic", id);
  }
  assert.equal(MANTOVA_ICS_IDS.length, 3);

  for (const id of GALLARATE_ICS_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, GALLARATE_ICS, id);
    assert.equal(source.kind, "ics", id);
    assert.equal(source.template, "icalendar", id);
    assert.equal(source.extractor, "deterministic", id);
  }
  assert.equal(GALLARATE_ICS_IDS.length, 2);

  for (const id of PREMANA_ICS_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, PREMANA_ICS, id);
    assert.equal(source.kind, "ics", id);
    assert.equal(source.template, "icalendar", id);
    assert.equal(source.extractor, "deterministic", id);
  }
  assert.equal(PREMANA_ICS_IDS.length, 2);

  // Hub groups are disjoint from remaining sezionali.
  const hubIds = new Set([
    ...BRESCIA_PDF_IDS,
    ...VALTELLINESE_PDF_IDS,
    ...TEGLIO_PDF_IDS,
    ...VIMERCATE_PDF_IDS,
    ...MERATE_PDF_IDS,
    ...MARIANO_PDF_IDS,
    ...MEDA_PDF_IDS,
    ...MANTOVA_ICS_IDS,
    ...GALLARATE_ICS_IDS,
    ...PREMANA_ICS_IDS
  ]);
  assert.equal(hubIds.size, 36);
  const sezionali = LOMBARDIA_SOURCES.filter((s) => !hubIds.has(s.id));
  assert.equal(sezionali.length, 51);
  for (const s of sezionali) {
    assert.notEqual(s.url, BRESCIA_PDF, s.id);
    assert.notEqual(s.url, VALTELLINESE_PDF, s.id);
    assert.notEqual(s.url, TEGLIO_PDF, s.id);
    assert.notEqual(s.url, VIMERCATE_PDF, s.id);
    assert.notEqual(s.url, MERATE_PDF, s.id);
    assert.notEqual(s.url, MARIANO_PDF, s.id);
    assert.notEqual(s.url, MEDA_PDF, s.id);
    assert.notEqual(s.url, MANTOVA_ICS, s.id);
    assert.notEqual(s.url, GALLARATE_ICS, s.id);
    assert.notEqual(s.url, PREMANA_ICS, s.id);
  }

  // Registry parent links retained for Mantova hub sottosezioni.
  const quistello = findSource("cai-quistello-9116059");
  assert.equal(quistello.sectionType, "subsection");
  assert.equal(quistello.parentSectionId, "cai-mantova-9216025");

  const mantova = findSource("cai-mantova-9216025");
  assert.equal(mantova.directoryId, "9216025");
  assert.equal(mantova.sectionType, "section");
});
