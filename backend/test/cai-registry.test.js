const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calendarLinks, canonicalRegion, sectionRecord, websiteUrl } = require('../scripts/discover-cai-sections');

test('calendar discovery prefers current annual programmes and excludes stale years and bureaucracy', () => {
  const links = calendarLinks(`
    <a href="/programma_2025.pdf">Programma</a>
    <a href="/programma_2026.pdf">Programma escursioni 2026</a>
    <a href="/calendario/">Calendario attività</a>
    <a href="/bilancio-2026.pdf">Bilancio attività 2026</a>
    <a href="webcal://example.it/eventi.ics">Calendario</a>
    <a href="javascript:alert(1)">Calendario</a>
  `, 'https://example.it/', 2026);
  assert(links.some(x => x.url === 'https://example.it/programma_2026.pdf'));
  assert(links.some(x => x.url === 'https://example.it/eventi.ics'));
  assert(!links.some(x => /2025|bilancio|javascript/.test(x.url)));
});

test('registry preserves Lazio IDs and distinguishes headquarters from event position', () => {
  const record = sectionRecord({ code:'1',name:'SEZ. ROMA',region:'LAZIO',website:'cairoma.it',latitude:'41.9',longitude:'12.5',officeAddress:{city:'ROMA',province:'RM'} }, null,
    [{id:'roma',organizer:'CAI Roma',url:'https://cairoma.it/calendario/',kind:'html',extractor:'cheerio'}]);
  assert.equal(record.id, 'roma');
  assert.equal(record.region, 'Lazio');
  assert.equal(record.headquartersCoordinates.latitude, 41.9);
  assert.equal(record.latitude, undefined);
});

test('subsections inherit organizing region but retain own identity and parent', () => {
  const record = sectionRecord({code:'2',name:'S.SEZ. VELLETRI'}, {id:'roma',directoryId:'1',region:'Lazio'});
  assert.equal(record.region,'Lazio');
  assert.equal(record.sectionType,'subsection');
  assert.equal(record.parentSectionId,'roma');
  assert.equal(record.website,null);
  assert.equal(record.enabled,false);
  assert.equal(record.status,'missing-website');
});

test('website normalization and canonical regions reject non-web addresses', () => {
  assert.equal(websiteUrl('www.example.it'), 'https://www.example.it/');
  assert.equal(websiteUrl('mailto:sezione@example.it'), null);
  assert.equal(websiteUrl('https://user:pass@example.it'), null);
  assert.equal(canonicalRegion('VALLE D\'AOSTA'), "Valle d'Aosta");
  assert.equal(canonicalRegion('TRENTINO-ALTO ADIGE'),'Trentino-Alto Adige');
});
