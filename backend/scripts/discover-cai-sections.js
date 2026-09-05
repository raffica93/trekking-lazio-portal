#!/usr/bin/env node
'use strict';

// Public CAI directory + bounded calendar discovery. No credentials or AI required.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const cheerio = require('cheerio');
const ROOT = path.resolve(__dirname, '../..');
const API = 'https://www.cai.it/wp-json/cai-section/v2';
const DIRECTORY = 'https://www.cai.it/sezioni-territoriali/sezioni-e-sottosezioni/';
const CACHE = process.env.CAI_DISCOVERY_CACHE || path.join(os.tmpdir(), 'cai-italia-discovery');
const YEAR = Number(process.env.CAI_YEAR || new Date().getFullYear());
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const domainLocks = new Map();

function slug(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function title(value) { return String(value || '').toLocaleLowerCase('it').replace(/(^|[\s-])\p{L}/gu, char => char.toLocaleUpperCase('it')); }
function websiteUrl(value) {
  if (!value) return null;
  try {
    let clean = String(value).trim().split(/[\s;,]/)[0].replace(/^https?:\/\/https?:\/\//, 'https://');
    if (!/^https?:\/\//i.test(clean)) clean = `https://${clean}`;
    const url = new URL(clean);
    if (!url.hostname.includes('.') || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
function kind(url) { return /\.pdf(?:$|[?#])/i.test(url) ? 'pdf' : /\.ics(?:$|[?#])|[?&]ical=|icalendar/i.test(url) ? 'ics' : 'html'; }
function isCalendarCandidate(url) {
  return !/\.(?:css|js|map|jpg|jpeg|png|gif|svg|webp|woff2?|ttf|eot)(?:$|[?#])/i.test(url)
    && !/\/wp-content\/(?:plugins|themes)\//i.test(url);
}

async function fetchPage(url, { json = false, timeout = 16000 } = {}) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, crypto.createHash('sha256').update(url).digest('hex') + '.json');
  if (fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < 86_400_000 && !process.argv.includes('--refresh')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const host = new URL(url).host;
  const slots = domainLocks.get(host) || { next: 0, tails: [Promise.resolve(), Promise.resolve()] };
  const slot = slots.next++ % slots.tails.length;
  const previous = slots.tails[slot];
  let release;
  slots.tails[slot] = new Promise(resolve => { release = resolve; });
  domainLocks.set(host, slots);
  await previous;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: {
      'User-Agent': 'CAI-Italia-Calendar-Discovery/1.0 (public calendar indexing; manual annual refresh)',
      Accept: json ? 'application/json' : 'text/html,application/xhtml+xml,application/pdf,text/calendar;q=0.9,*/*;q=0.5',
      ...(host === 'www.cai.it' ? { Origin: 'https://www.cai.it', Referer: DIRECTORY } : {})
    } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    // Discovery only inspects HTML; PDF parsing belongs to the scraping worker.
    let body = '';
    if (!/application\/pdf/i.test(contentType)) body = await response.text();
    else await response.body?.cancel();
    const result = { url: response.url, contentType, body, fetchedAt: new Date().toISOString() };
    fs.writeFileSync(file, JSON.stringify(result));
    return result;
  } finally { await sleep(150); release(); }
}
async function pool(items, concurrency, work) {
  let cursor = 0;
  const result = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) { const index = cursor++; result[index] = await work(items[index], index); }
  }));
  return result;
}
function canonicalRegion(raw) {
  const region = title(raw).replace('Valle D\'aosta', "Valle d'Aosta");
  return region === 'Extra Regione' ? 'Nazionale' : region;
}
function sectionRecord(raw, parent = null, overrides = []) {
  const shortName = raw.name.replace(/^(?:S\.SEZ\.|SEZ\.)\s*/i, '').trim();
  const region = canonicalRegion(raw.region || parent?.region);
  const existing = region === 'Lazio' && !parent ? overrides.find(s => slug(s.organizer.replace(/^CAI\s+/i, '')) === slug(shortName)) : null;
  const id = existing?.id || `cai-${slug(shortName)}-${raw.code}`;
  const website = websiteUrl(raw.website) || (existing ? new URL(existing.url).origin + '/' : null);
  const lat = Number(raw.latitude), lon = Number(raw.longitude);
  const national = raw.region === 'EXTRA REGIONE';
  return {
    id, directoryId: String(raw.code), organizer: existing?.organizer || `${/S\.A\.T\./.test(shortName) ? '' : 'CAI '}${title(shortName)}`,
    region, sectionType: parent ? 'subsection' : national ? 'national' : 'section', parentSectionId: parent?.id || null,
    municipality: title(raw.officeAddress?.city), province: raw.officeAddress?.province || null,
    headquartersCoordinates: Number.isFinite(lat) && Number.isFinite(lon) && lat > 0 && lon > 0 ? { latitude: lat, longitude: lon } : null,
    website, directoryUrl: parent ? `${DIRECTORY}sezione/?codice=${parent.directoryId}` : `${DIRECTORY}sezione/?codice=${raw.code}`,
    url: existing?.url || website || `${DIRECTORY}sezione/?codice=${raw.code}`,
    calendarUrls: existing ? [existing.url] : [], kind: existing?.kind || 'discover',
    template: existing?.template || 'calendar-discovery', extractor: existing?.extractor || 'deterministic',
    enabled: Boolean(website), status: existing ? 'calendar-found' : website ? 'pending-discovery' : 'missing-website',
    evidenceUrls: [DIRECTORY], ...(existing ? { legacyId: existing.id } : {})
  };
}
function calendarLinks(html, base, year = YEAR) {
  const $ = cheerio.load(html), found = new Map();
  $('a[href], link[href], iframe[src]').each((_, element) => {
    const raw = $(element).attr('href') || $(element).attr('src');
    let url;
    try { url = new URL(raw.replace(/^webcal:/, 'https:'), base); } catch { return; }
    if (!/^https?:$/.test(url.protocol) || /facebook\.com|instagram\.com|youtube\.com|mailto:/.test(url.href)) return;
    if (!isCalendarCandidate(url.href)) return;
    const label = $(element).text().trim();
    let decoded = url.href;
    try { decoded = decodeURI(url.href); } catch { /* Retain valid URL with a malformed escape. */ }
    const text = `${decoded} ${label}`.toLowerCase();
    if (/privacy|cookie|statuto|bilancio|tesseramento|regolament|newsletter|verbale|trasparenza|assemblea|convenzion|modulo/.test(text)) return;
    const years = [...text.matchAll(/(?:^|\D)(20\d{2})(?=\D|$)/g)].map(m => Number(m[1]));
    if (years.length && Math.max(...years) < year) return;
    let score = 0;
    if (kind(url.href) === 'ics') score += 80;
    if (/calendar|programma|programmi|programm-|attivit[aà]|escursioni|escursionismo|trekking|gite|uscite|eventi|agenda|wanderprogramm/.test(text)) score += 20;
    if (text.includes(String(year))) score += 15;
    if (/calendari|programma|programm-|agenda/.test(text)) score += 20;
    if (kind(url.href) === 'pdf' && score >= 20) score += 20;
    if (/\/(category|tag)\//.test(url.pathname)) score -= 10;
    if (score < 20) return;
    url.hash = '';
    const candidate = { url: url.href, label: label.slice(0, 180), score, foundOn: base };
    if (!found.has(url.href) || found.get(url.href).score < score) found.set(url.href, candidate);
  });
  return [...found.values()].sort((a, b) => b.score - a.score).slice(0, 14);
}

async function discoverSection(section) {
  if (!section.website) return section;
  if (/facebook\.com|instagram\.com/i.test(section.website)) { Object.assign(section, { enabled: false, status: 'social-only' }); return section; }
  try {
    const home = await fetchPage(section.website);
    section.website = home.url;
    let candidates = calendarLinks(home.body, home.url);
    const detail = candidates.filter(x => kind(x.url) === 'html' && x.url !== home.url).slice(0, 2);
    for (const candidate of detail) {
      try {
        const page = await fetchPage(candidate.url);
        candidates = candidates.concat(calendarLinks(page.body, page.url));
        candidate.verifiedAt = page.fetchedAt;
      } catch (error) { candidate.error = error.message; }
    }
    const urls = [...new Map(candidates.filter(x => !x.error).sort((a,b) => b.score-a.score).map(x => [x.url,x])).values()].slice(0, 8);
    section.calendarUrls = [...new Set([...urls.map(x => x.url), ...(section.legacyId ? section.calendarUrls : [])])]
      .filter(isCalendarCandidate).slice(0, 8);
    section.calendarEvidence = urls.map(({url,label,foundOn,verifiedAt}) => ({url,label,foundOn,...(verifiedAt ? {verifiedAt} : {})}));
    const legacyHasOldYear = /(?:^|\D)(20\d{2})(?=\D|$)/.exec(section.url)?.[1] < YEAR;
    section.url = section.legacyId && !legacyHasOldYear ? section.url : section.calendarUrls[0] || home.url;
    section.kind = section.legacyId ? section.kind : kind(section.url);
    section.template = section.legacyId ? section.template : section.kind === 'pdf' ? 'pdf-programma' : section.kind === 'ics' ? 'icalendar' : /tribe-events|the-events-calendar/.test(home.body) ? 'wordpress-events' : /organizzazione\.cai\.it/.test(home.url) ? 'cai-wordpress' : 'html-calendar';
    section.enabled = true;
    section.status = section.calendarUrls.length ? 'calendar-found' : 'website-only';
    section.verifiedAt = home.fetchedAt;
  } catch (error) {
    section.status = 'unreachable'; section.discoveryError = error.message;
    // Keep legacy working endpoints; new unreachable sites stay visible in the directory.
    section.enabled = Boolean(section.legacyId);
  }
  return section;
}

function writeRegistry(registry) {
  registry.stats = {
    total: registry.sections.length,
    sections: registry.sections.filter(x => x.sectionType === 'section').length,
    subsections: registry.sections.filter(x => x.sectionType === 'subsection').length,
    national: registry.sections.filter(x => x.sectionType === 'national').length,
    regions: [...new Set(registry.sections.map(x => x.region).filter(x => x && x !== 'Nazionale'))].length,
    enabled: registry.sections.filter(x => x.enabled).length,
    statuses: registry.sections.reduce((acc, x) => { acc[x.status] = (acc[x.status] || 0) + 1; return acc; }, {})
  };
  for (const file of ['backend/data/cai-sections.json', 'frontend/public/cai-sections.json']) {
    const absolute = path.join(ROOT, file); fs.mkdirSync(path.dirname(absolute), {recursive:true});
    fs.writeFileSync(absolute, JSON.stringify(registry, null, 2) + '\n');
  }
}
async function main() {
  const oldSources = require('../sources').SOURCES.filter(x => x.extractor !== 'deterministic');
  let registry;
  if (process.argv.includes('--websites-only') || process.argv.includes('--sanitize-only')) registry = JSON.parse(fs.readFileSync(path.join(ROOT,'backend/data/cai-sections.json'),'utf8'));
  else {
    const directory = JSON.parse((await fetchPage(`${API}/sections-list-simple`, {json:true})).body);
    if (!Array.isArray(directory) || directory.length < 400) throw new Error('Official directory returned incomplete data; existing registry retained');
    const excluded = directory.filter(raw => !raw.region || /SEZ\. PROVA/.test(raw.name));
    const sections = directory.filter(raw => !excluded.includes(raw)).map(raw => sectionRecord(raw,null,oldSources));
    registry = { generatedAt: new Date().toISOString(), source: DIRECTORY, directoryApi: `${API}/sections-list-simple`, year: YEAR,
      completeness: { officialSectionCount: directory.length, excludedTestRecords: excluded.map(x => ({code:x.code,name:x.name})), subsectionFailures: [] }, sections };
    console.log(`Directory: ${sections.length} real sections, ${excluded.length} test records excluded`);
    writeRegistry(registry);
    const subsectionSets = await pool([...sections], 4, async (parent,index) => {
      try {
        const response = await fetchPage(`${API}/sections/${parent.directoryId}/sub-sections-map`, {json:true});
        const raw = JSON.parse(response.body);
        if (raw !== false && !Array.isArray(raw)) throw new Error('Unexpected subsection response');
        if ((index + 1) % 40 === 0) console.log(`Subsections ${index + 1}/${sections.length}`);
        return (raw || []).map(item => sectionRecord(item,parent));
      } catch (error) { registry.completeness.subsectionFailures.push({ id:parent.id,error:error.message }); return []; }
    });
    sections.push(...subsectionSets.flat());
    registry.sections = [...new Map(sections.map(x => [x.directoryId,x])).values()].sort((a,b) => a.region.localeCompare(b.region,'it') || a.organizer.localeCompare(b.organizer,'it'));
    writeRegistry(registry);
  }
  if (process.argv.includes('--sanitize-only')) {
    registry.sections = registry.sections.map((section) => ({
      ...section,
      calendarUrls: (section.calendarUrls || []).filter(isCalendarCandidate),
      calendarEvidence: (section.calendarEvidence || []).filter((item) => isCalendarCandidate(item.url))
    }));
    registry.generatedAt = new Date().toISOString();
    writeRegistry(registry);
    console.log(JSON.stringify(registry.stats));
    return;
  }
  if (!process.argv.includes('--directory-only')) {
    const toDiscover = registry.sections.filter(x => x.website && (!process.argv.includes('--pending-only') || x.status === 'pending-discovery'));
    await pool(toDiscover, 8, async (section,index) => {
      await discoverSection(section);
      if ((index+1)%20 === 0) { console.log(`Websites ${index+1}/${toDiscover.length}`); writeRegistry(registry); }
    });
  }
  registry.generatedAt = new Date().toISOString();
  writeRegistry(registry);
  console.log(JSON.stringify(registry.stats));
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { calendarLinks, canonicalRegion, sectionRecord, websiteUrl, discoverSection, fetchPage, pool, writeRegistry, isCalendarCandidate };
