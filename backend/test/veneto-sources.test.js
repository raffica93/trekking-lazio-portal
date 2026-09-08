const { test } = require('node:test');
const assert = require('node:assert/strict');
const { VENETO_SOURCES, findSource } = require('../sources');

const CADORINE_OPUSCOLO =
  'https://caicalalzo.it/wp-content/uploads/2026/03/Escursioni-estate-2026-opuscolo.pdf';

test('Veneto overrides win over registry discover stubs', () => {
  assert.equal(VENETO_SOURCES.length, 32);

  for (const raw of VENETO_SOURCES) {
    const source = findSource(raw.id);
    assert.ok(source, raw.id);
    assert.equal(source.enabled, true, raw.id);
    assert.equal(source.region, 'Veneto', raw.id);
    assert.equal(source.status, 'calendar-found', raw.id);
    // Override wins as calendarUrls[0] over registry discover stubs.
    assert.equal(source.calendarUrls[0], source.url, raw.id);
    assert.equal(source.url, raw.url, raw.id);
    if (raw.kind === 'ics') {
      assert.equal(source.kind, 'ics', raw.id);
      assert.equal(source.template, 'icalendar', raw.id);
      assert.equal(source.extractor, 'deterministic', raw.id);
    } else if (raw.kind === 'html') {
      assert.equal(source.kind, 'html', raw.id);
      assert.equal(source.template, 'html-calendario', raw.id);
      assert.equal(source.extractor, 'gemini', raw.id);
    } else {
      assert.equal(source.kind, 'pdf', raw.id);
      assert.equal(source.template, 'pdf-programma', raw.id);
      assert.equal(source.extractor, 'gemini', raw.id);
    }
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

  // Pieve + Lozzo share Calalzo estate opuscolo PDF.
  const calalzo = findSource('cai-calalzo-di-cadore-9220035');
  const pieve = findSource('cai-pieve-di-cadore-9220022');
  const lozzo = findSource('cai-lozzo-di-cadore-9220043');
  assert.equal(pieve.url, calalzo.url);
  assert.equal(lozzo.url, calalzo.url);
  assert.equal(calalzo.url, CADORINE_OPUSCOLO);

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

test('Veneto ICS lock-in: Pieve di Soligo + Recoaro Terme deterministic', () => {
  const pieveSoligo = findSource('cai-pieve-di-soligo-9220054');
  assert.ok(pieveSoligo);
  assert.equal(pieveSoligo.enabled, true);
  assert.equal(pieveSoligo.kind, 'ics');
  assert.equal(pieveSoligo.template, 'icalendar');
  assert.equal(pieveSoligo.extractor, 'deterministic');
  assert.equal(pieveSoligo.region, 'Veneto');
  assert.equal(pieveSoligo.url, 'https://www.caipievedisoligo.it/index.php/eventi/?ical=1');
  assert.equal(pieveSoligo.calendarUrls[0], pieveSoligo.url);
  assert.equal(pieveSoligo.directoryId, '9220054');
  assert.equal(pieveSoligo.status, 'calendar-found');

  const recoaro = findSource('cai-recoaro-terme-9220045');
  assert.ok(recoaro);
  assert.equal(recoaro.enabled, true);
  assert.equal(recoaro.kind, 'ics');
  assert.equal(recoaro.template, 'icalendar');
  assert.equal(recoaro.extractor, 'deterministic');
  assert.equal(recoaro.region, 'Veneto');
  assert.equal(recoaro.url, 'https://www.cairecoaroterme.it/events/?ical=1');
  assert.equal(recoaro.calendarUrls[0], recoaro.url);
  assert.equal(recoaro.directoryId, '9220045');
  assert.equal(recoaro.status, 'calendar-found');

  // Both stay in VENETO_SOURCES as ICS overrides (not PDF gemini).
  const icsIds = VENETO_SOURCES.filter((s) => s.kind === 'ics').map((s) => s.id).sort();
  assert.deepEqual(icsIds, [
    'cai-pieve-di-soligo-9220054',
    'cai-recoaro-terme-9220045'
  ].sort());
});

test('Veneto hard1: 3 PDF + 4 HTML extract-ready', () => {
  const lanerossi = findSource('cai-aziendale-lanerossi-9120005');
  assert.equal(lanerossi.kind, 'pdf');
  assert.equal(
    lanerossi.url,
    'https://www.gamschio.it/app/download/39574898/pgm+gite+2026.pdf'
  );

  const zevio = findSource('cai-zevio-9120024');
  assert.equal(zevio.kind, 'pdf');
  assert.equal(
    zevio.url,
    'https://www.geaz.org/wp-content/uploads/2025/12/Programma-geaz-2026.pdf'
  );

  const sandrigo = findSource('cai-sandrigo-9120021');
  assert.equal(sandrigo.kind, 'html');
  assert.equal(sandrigo.url, 'https://caimarostica.it/calendario-uscite/');

  const spolo = findSource('cai-s-polo-di-piave-9120019');
  assert.equal(spolo.kind, 'html');
  assert.equal(spolo.url, 'https://www.caisanpolo.com/attivit%C3%A0/escursioni');

  const giov = findSource('cai-g-alp-giov-mont-9120010');
  assert.equal(giov.kind, 'html');
  assert.equal(giov.url, 'https://www.giovanemontagna.org/calendario.asp?s=12');

  const scaligero = findSource('cai-g-alp-scaligero-9120011');
  assert.equal(scaligero.kind, 'html');
  assert.equal(
    scaligero.url,
    'https://www.gruppoalpinoscaligeroverona.it/programma-2024/'
  );

  const hard1Ids = [
    'cai-lozzo-di-cadore-9220043',
    'cai-aziendale-lanerossi-9120005',
    'cai-zevio-9120024',
    'cai-sandrigo-9120021',
    'cai-s-polo-di-piave-9120019',
    'cai-g-alp-giov-mont-9120010',
    'cai-g-alp-scaligero-9120011'
  ];
  for (const id of hard1Ids) {
    assert.ok(VENETO_SOURCES.some((s) => s.id === id), id);
  }
});
