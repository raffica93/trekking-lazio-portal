const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PIEMONTE_SOURCES, findSource } = require('../sources');

const EST_MONTEROSA_PDF =
  'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf';
const ALTO_CANAVESE_PDF =
  'https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf';
const PINEROLO_PDF =
  'https://www.caipinerolo.it/wp/wp-content/uploads/2025/11/Programma-gite-con-descrizioni-.pdf';
const VARALLO_ICS = 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1';
const BARDONECCHIA_PDF =
  'https://www.caibardonecchia.it/wp-content/uploads/2025/10/CAI_Bardonecchia-PROGRAMMA_2026-V0.pdf';
const CHIVASSO_PDF =
  'https://www.caichivasso.it/media/news/attachment/Trekking_sezionali_2026.pdf';

const EST_MONTEROSA_IDS = [
  'cai-borgomanero-9212025',
  'cai-domodossola-9212003',
  'cai-formazza-9212070',
  'cai-macugnaga-9212050',
  'cai-novara-9212014',
  'cai-omegna-9212020',
  'cai-pallanza-9212027',
  'cai-piedimulera-9212028',
  'cai-valle-vigezzo-9212056',
  'cai-varzo-9212055',
  'cai-verbano-verbania-9212007'
];

const ALTO_CANAVESE_IDS = [
  'cai-cuorgne-9212072',
  'cai-forno-canavese-9212067',
  'cai-rivarolo-canavese-9212041',
  'cai-sparone-9112033'
];

const PINEROLO_IDS = [
  'cai-cumiana-9212060',
  'cai-pinerolo-9212009',
  'cai-valgermanasca-9212049'
];

const VARALLO_ICS_IDS = [
  'cai-alagna-9112025',
  'cai-borgosesia-9112026',
  'cai-ghemme-9112027',
  'cai-grignasco-9112028',
  'cai-romagnano-9112029',
  'cai-scopello-9112030',
  'cai-varallo-sesia-9212002'
];

const BARDONECCHIA_IDS = [
  'cai-avigliana-9112002',
  'cai-bardonecchia-9212052',
  'cai-sauze-d-oulx-9112054'
];

const CHIVASSO_IDS = [
  'cai-chivasso-9212013',
  'cai-foglizzo-9112039',
  'cai-saluggia-9112009'
];

test('Piemonte overrides win over registry discover stubs', () => {
  assert.equal(PIEMONTE_SOURCES.length, 62);

  const pdfCount = PIEMONTE_SOURCES.filter((s) => s.kind === 'pdf').length;
  const icsCount = PIEMONTE_SOURCES.filter((s) => s.kind === 'ics').length;
  assert.equal(pdfCount, 47);
  assert.equal(icsCount, 15);

  for (const raw of PIEMONTE_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.region, 'Piemonte', raw.id);
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

test('Piemonte shared hub PDF + Varallo shared ICS', () => {
  for (const id of EST_MONTEROSA_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, EST_MONTEROSA_PDF, id);
    assert.equal(source.kind, 'pdf', id);
  }
  assert.equal(EST_MONTEROSA_IDS.length, 11);

  for (const id of ALTO_CANAVESE_IDS) {
    assert.equal(findSource(id).url, ALTO_CANAVESE_PDF, id);
  }
  assert.equal(ALTO_CANAVESE_IDS.length, 4);

  for (const id of PINEROLO_IDS) {
    assert.equal(findSource(id).url, PINEROLO_PDF, id);
  }
  assert.equal(PINEROLO_IDS.length, 3);

  for (const id of BARDONECCHIA_IDS) {
    assert.equal(findSource(id).url, BARDONECCHIA_PDF, id);
  }
  assert.equal(BARDONECCHIA_IDS.length, 3);

  for (const id of CHIVASSO_IDS) {
    assert.equal(findSource(id).url, CHIVASSO_PDF, id);
  }
  assert.equal(CHIVASSO_IDS.length, 3);

  for (const id of VARALLO_ICS_IDS) {
    const source = findSource(id);
    assert.ok(source, id);
    assert.equal(source.url, VARALLO_ICS, id);
    assert.equal(source.kind, 'ics', id);
    assert.equal(source.template, 'icalendar', id);
    assert.equal(source.extractor, 'deterministic', id);
  }
  assert.equal(VARALLO_ICS_IDS.length, 7);

  // Hub groups are disjoint from remaining sezionali.
  const hubIds = new Set([
    ...EST_MONTEROSA_IDS,
    ...ALTO_CANAVESE_IDS,
    ...PINEROLO_IDS,
    ...VARALLO_ICS_IDS,
    ...BARDONECCHIA_IDS,
    ...CHIVASSO_IDS
  ]);
  assert.equal(hubIds.size, 31);
  const sezionali = PIEMONTE_SOURCES.filter((s) => !hubIds.has(s.id));
  assert.equal(sezionali.length, 31);
  for (const s of sezionali) {
    assert.notEqual(s.url, EST_MONTEROSA_PDF, s.id);
    assert.notEqual(s.url, ALTO_CANAVESE_PDF, s.id);
    assert.notEqual(s.url, PINEROLO_PDF, s.id);
    assert.notEqual(s.url, VARALLO_ICS, s.id);
    assert.notEqual(s.url, BARDONECCHIA_PDF, s.id);
    assert.notEqual(s.url, CHIVASSO_PDF, s.id);
  }

  // Registry parent links retained for subsections under Varallo hub.
  const alagna = findSource('cai-alagna-9112025');
  assert.equal(alagna.sectionType, 'subsection');
  assert.equal(alagna.parentSectionId, 'cai-varallo-sesia-9212002');

  const varallo = findSource('cai-varallo-sesia-9212002');
  assert.equal(varallo.directoryId, '9212002');
  assert.equal(varallo.sectionType, 'section');
});
