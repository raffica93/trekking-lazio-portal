const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { DateTime } = require('luxon');
const { parseCaiRomaHtml, stableId, tripDays, parseDistanceKm, parseDurationHours } = require('../scraper');

const VERSION = 3;
const MONTHS = { gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6, luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12 };
const MONTH_PATTERN = Object.keys(MONTHS).join('|');
const REGIONS = ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'];
const CACHE_DIR = path.join(__dirname, '..', 'node_modules', '.cache', 'cai');
const EVENT_WORDS = /escursion|trekking|sentiero|rifugio|monte\b|monti\b|cima\b|anello\b|traversata|ferrata|alpinis|ciaspol|sci\b|cicloescursion|passeggiata|cammino|gita\b|uscita\b|assemblea|convegno|serata|incontro|corso\b|arrampic|torrent|speleolog|raduno|castagnata|pranzo|cena/i;
const CALENDAR_WORDS = /calendari|programm[ai]|escursion|attivit|eventi|gite|agenda|trekking/i;
const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const clean = (value) => cheerio.load(String(value || '')).text().replace(/\s+/g, ' ').trim();

function monthFloor(now = DateTime.now()) {
  const date = typeof now === 'string' ? DateTime.fromISO(now) : now;
  return date.setZone('Europe/Rome').startOf('month').toISODate();
}

function validDate(year, month, day) {
  if (![year, month, day].every((part) => Number.isFinite(Number(part)) && Number(part) > 0)) return null;
  const dt = DateTime.fromObject({ year: Number(year), month: Number(month), day: Number(day) }, { zone: 'Europe/Rome' });
  return dt.isValid ? dt.toISODate() : null;
}

function parseDates(input, year, month) {
  const value = clean(input).toLowerCase();
  let range = value.match(new RegExp(`\\b(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?\\s*(?:[-–—]|al|a)\\s*(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?\\b`, 'i'));
  if (range) {
    const firstYear = Number(range[3] || year);
    return { date: validDate(firstYear, MONTHS[range[2]], range[1]), dateEnd: validDate(range[6] || firstYear + (MONTHS[range[5]] < MONTHS[range[2]] ? 1 : 0), MONTHS[range[5]], range[4]), matched: range[0] };
  }
  let match = value.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (match) return { date: validDate(match[1], match[2], match[3]), matched: match[0] };
  match = value.match(/\b(\d{1,2})[/.](\d{1,2})[/.](20\d{2}|\d{2})\b/);
  if (match) return { date: validDate(match[3].length === 2 ? `20${match[3]}` : match[3], match[2], match[1]), matched: match[0] };
  match = value.match(/\b(\d{1,2})[/.](\d{1,2})(?![/.\d])\b/);
  if (match && year) return { date: validDate(year, match[2], match[1]), matched: match[0] };
  match = value.match(new RegExp(`\\b(\\d{1,2})(?:\\s*[-–/e]\\s*(\\d{1,2}))?\\s+(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?\\b`, 'i'));
  if (match) return {
    date: validDate(match[4] || year, MONTHS[match[3]], match[1]),
    dateEnd: match[2] ? validDate(match[4] || year, MONTHS[match[3]], match[2]) : undefined,
    matched: match[0]
  };
  match = value.match(/^\s*(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?)?\s*(\d{1,2})(?:\s*[-–/]\s*(\d{1,2}))?(?=\s|$)/i);
  if (match && month) return {
    date: validDate(year, month, match[1]),
    dateEnd: match[2] ? validDate(year, month, match[2]) : undefined,
    matched: match[0]
  };
  return null;
}

function locationRegion(location) {
  const value = clean(location).toLowerCase().replace(/[–—]/g, '-');
  return REGIONS.find((region) => value.includes(region.toLowerCase())) || 'Altro';
}

function normalizeEvent(raw, source, evidenceUrl, method) {
  const title = clean(raw.title || raw.name);
  const start = String(raw.date || raw.startDate || '').slice(0, 10);
  if (!title || title.length < 5 || title.length > 350 || !DateTime.fromISO(start).isValid) return null;
  let end = String(raw.dateEnd || raw.endDate || start).slice(0, 10);
  if (!DateTime.fromISO(end).isValid || end < start) end = start;
  const location = clean(raw.location) || 'Località da verificare';
  const detail = clean(raw.description || '');
  const category = clean(raw.category) || (title.match(/\b(EEA|EE|EAI|E|T)\b/) || [])[0] || 'Attività CAI';
  const event = {
    id: stableId(start, title, source.id), sourceId: source.id, title, date: start, dateEnd: end,
    days: tripDays(start, end), category, link: safeUrl(raw.link || raw.url, evidenceUrl) || evidenceUrl,
    organizer: source.organizer, organizerRegion: source.region || 'Altro', location,
    region: locationRegion(`${location} ${title}`), cost: 'Vedi sito', time: 'Vedi sito', privateCar: null,
    coordinatesQuality: 'unknown', locationSource: method, sourceDocument: evidenceUrl,
    ...(detail ? { description: detail.slice(0, 1500) } : {})
  };
  const distanceKm = parseDistanceKm([detail]);
  const durationHours = parseDurationHours([detail]);
  if (distanceKm) event.distanceKm = distanceKm;
  if (durationHours) event.durationHours = durationHours;
  // A section's headquarters, organizer address or website-wide map is never a route destination.
  const headquarters = source.headquartersCoordinates;
  const atHeadquarters = headquarters && Math.abs(Number(raw.lat) - Number(headquarters.latitude)) < 0.0001 && Math.abs(Number(raw.lng) - Number(headquarters.longitude)) < 0.0001;
  if (raw.lat != null && raw.lng != null && String(raw.lat).trim() && String(raw.lng).trim() && Number.isFinite(Number(raw.lat)) && Number.isFinite(Number(raw.lng))
      && Math.abs(Number(raw.lat)) <= 90 && Math.abs(Number(raw.lng)) <= 180
      && !atHeadquarters && !(Number(raw.lat) === 0 && Number(raw.lng) === 0)
      && !/sede\s+(?:sociale|cai|sezion)|sezione\s+cai|club alpino/i.test(location)) {
    event.lat = Number(raw.lat); event.lng = Number(raw.lng);
    event.coordinatesQuality = 'source';
    event.coordinateEvidence = evidenceUrl;
  }
  return event;
}

function safeUrl(value, base) {
  try {
    const url = new URL(String(value || '').replace(/^webcal:/i, 'https:'), base);
    if (!value || !/^https?:$/.test(url.protocol) || url.username || url.password || url.port) return null;
    if (/^(?:localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|\[)/i.test(url.hostname)) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}

function parseJsonLd(html, source, url) {
  const $ = cheerio.load(html);
  const events = [];
  let recognized = false;
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if ([node['@type']].flat().some((type) => /^(?:Event|SportsEvent|SocialEvent|EducationEvent|CourseInstance|Festival)$/.test(type))) {
      recognized = true;
      if (/EventCancelled$/.test(node.eventStatus || '')) return;
      const location = Array.isArray(node.location) ? node.location[0] : node.location;
      const address = location?.address;
      const place = typeof location === 'string' ? location : [location?.name, typeof address === 'string' ? address : [address?.streetAddress, address?.addressLocality, address?.addressRegion].filter(Boolean).join(', ')].filter(Boolean).join(', ');
      const event = normalizeEvent({ ...node, location: place, lat: location?.geo?.latitude, lng: location?.geo?.longitude }, source, url, 'json-ld');
      if (event) events.push(event);
    }
    for (const [key, value] of Object.entries(node)) if (key !== 'location' && typeof value === 'object') visit(value);
  }
  $('script[type="application/ld+json"]').each((_i, el) => {
    try { visit(JSON.parse($(el).text().replace(/^\s*<!--|-->\s*$/g, ''))); } catch { /* One malformed block must not hide valid event blocks. */ }
  });
  return { events, recognized, method: 'json-ld' };
}

function parseIcs(text, source, url) {
  const events = [];
  const issues = [];
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  const blocks = [...unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)];
  for (const block of blocks) {
    const props = {};
    for (const line of block[1].split(/\r?\n/)) {
      const colon = line.indexOf(':');
      if (colon < 0) continue;
      const [key, ...params] = line.slice(0, colon).split(';');
      props[key] = { value: line.slice(colon + 1).replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1'), params: params.join(';') };
    }
    if (props.STATUS?.value === 'CANCELLED') continue;
    if (props.RRULE) issues.push('Recurring calendar entries require explicit instances; only the published DTSTART is imported.');
    const dateOf = (prop) => {
      if (!prop) return null;
      const value = prop.value;
      if (/^\d{8}$/.test(value)) return validDate(value.slice(0, 4), value.slice(4, 6), value.slice(6, 8));
      const parsed = DateTime.fromFormat(value, value.endsWith('Z') ? "yyyyMMdd'T'HHmmss'Z'" : "yyyyMMdd'T'HHmmss", { zone: value.endsWith('Z') ? 'UTC' : (prop.params.match(/TZID=([^;]+)/)?.[1] || 'Europe/Rome') });
      return parsed.isValid ? parsed.setZone('Europe/Rome').toISODate() : null;
    };
    const date = dateOf(props.DTSTART);
    let dateEnd = dateOf(props.DTEND) || date;
    if (props.DTEND && /^\d{8}$/.test(props.DTEND.value) && dateEnd) dateEnd = DateTime.fromISO(dateEnd).minus({ days: 1 }).toISODate();
    const geo = props.GEO?.value.split(';') || [];
    const event = normalizeEvent({ title: props.SUMMARY?.value, date, dateEnd, description: props.DESCRIPTION?.value, location: props.LOCATION?.value, link: props.URL?.value, category: props.CATEGORIES?.value, lat: geo[0], lng: geo[1] }, source, url, 'ics');
    if (event) events.push(event);
  }
  return { events, recognized: /BEGIN:VCALENDAR/.test(text), method: 'ics', issues };
}

function parseWordPress(payload, source, url) {
  const events = [];
  const rows = Array.isArray(payload.events) ? payload.events : [];
  for (const row of rows) {
    const venue = row.venue || {};
    const event = normalizeEvent({ title: row.title, date: row.start_date, dateEnd: row.end_date, description: row.description, location: [venue.venue, venue.address, venue.city, venue.state].filter(Boolean).join(', '), lat: venue.geo_lat, lng: venue.geo_lng, link: row.url, category: (row.categories || []).map((cat) => cat.name).join(', ') }, source, url, 'wordpress-events');
    if (event) events.push(event);
  }
  return { events, recognized: Array.isArray(payload.events), method: 'wordpress-events', nextUrl: payload.next_rest_url || null };
}

function documentYear(text, url, fallback) {
  const urlYear = url.match(/(?:^|\D)(20\d{2})(?:\D|$)/g)?.map((value) => Number(value.match(/20\d{2}/)[0]));
  const heading = String(text).slice(0, 1200).match(/(?:calendario|programma|attivit[aà]|escursioni)[^\n]{0,70}?\b(20\d{2})\b/i);
  const standalone = String(text).slice(0, 1600).match(/(?:^|\n)\s*(20\d{2})\s*(?:\n|$)/);
  return heading ? Number(heading[1]) : (urlYear?.at(-1) || (standalone && Number(standalone[1])) || fallback);
}

function parseCalendarLines(lines, source, url, year, method) {
  const events = [];
  let month;
  for (let index = 0; index < lines.length; index += 1) {
    const line = clean(lines[index]);
    if (!line) continue;
    const monthHeading = line.toLowerCase().match(new RegExp(`^(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?$`));
    if (monthHeading) { month = MONTHS[monthHeading[1]]; year = Number(monthHeading[2] || year); continue; }
    const range = parseDates(line, year, month);
    if (!range?.date) continue;
    const beforeDate = line.slice(0, line.toLowerCase().indexOf(range.matched.trim().toLowerCase())).trim();
    if (beforeDate && !/^(?:(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?|dal|da|data|e|[-–:])+\s*)+$/i.test(beforeDate)) continue;
    let title = line.replace(new RegExp(range.matched.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '').replace(/^\s*(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?)\b\s*/i, '').replace(/^[\s:;|–—-]+/, '').trim();
    if (title.length < 8 && index + 1 < lines.length && !parseDates(lines[index + 1], year, month)?.date) title += ` ${clean(lines[index + 1])}`;
    // Generic pages include publication dates and footer dates. Import only actual activity descriptions.
    if (!EVENT_WORDS.test(title) || /^(?:escursionismo|alpinismo|cicloescursionismo|programma|attivit[aà])$/i.test(title) || /pubblicat|aggiornat|copyright|cookie|privacy|tesseramento|contattaci|leggi tutto|orario di apertura/i.test(title)) continue;
    const event = normalizeEvent({ title, ...range, description: line }, source, url, method);
    if (event) events.push(event);
  }
  return events;
}

// Tivoli's annual booklet prints the destination above a large day number.
// A generic left-to-right table parser would incorrectly use the mountain group as its title.
function parseTivoliPdf(lines, source, url, year) {
  let month;
  const events = [];
  const dayOfWeek = /^(?:luned[iì]|marted[iì]|mercoled[iì]|gioved[iì]|venerd[iì]|sabato|domenica|(?:lun|mar|mer|gio|ven|sab|dom)(?:[-–](?:lun|mar|mer|gio|ven|sab|dom))?)$/i;
  for (let index = 0; index < lines.length; index += 1) {
    const line = clean(lines[index]);
    if (MONTHS[line.toLowerCase()]) { month = MONTHS[line.toLowerCase()]; continue; }
    if (!month || !/^\d{1,2}(?:[-–]\d{1,2})?$/.test(line)) continue;
    const range = parseDates(line, year, month);
    const prior = clean(lines[index - 1]);
    if (!range?.date || !prior || MONTHS[prior.toLowerCase()] || /REFERENTI:|DDE|Programma attivit/i.test(prior)) continue;
    const after = [];
    for (let next = index + 1; next < Math.min(index + 5, lines.length); next += 1) {
      if (dayOfWeek.test(clean(lines[next]))) break;
      after.push(clean(lines[next]));
    }
    const context = [];
    for (let next = index + 1; next < Math.min(index + 24, lines.length); next += 1) {
      if (/^\d{1,2}(?:[-–]\d{1,2})?$/.test(clean(lines[next])) || /^(?:DDE |REFERENTI:|CAI - Sezione)/.test(clean(lines[next]))) break;
      context.push(clean(lines[next]));
    }
    const supplemental = after.filter((part) => !/^(?:Monti? |Gran Sasso|Sirente|Parco |Riserva |Escursionismo|Alpinismo|Cicloescursionismo)/i.test(part));
    const title = [prior, ...supplemental].join(' ').trim();
    const place = after.find((part) => /^(?:Monti? |Gran Sasso|Sirente|Parco |Riserva )/i.test(part)) || prior;
    const detail = context.join(' ');
    const category = detail.match(/Difficolt[aà]\s+([A-Z]+\b(?:\s+(?:PD|AD|D|F)[+]?(?=\s|$))?)/)?.[1];
    const event = normalizeEvent({ ...range, title, location: place, category, description: detail }, source, url, 'pdf-tivoli-booklet');
    if (event) events.push(event);
  }
  return events;
}

function parseHtmlCalendar(html, source, url, now) {
  const $ = cheerio.load(html);
  const structured = parseJsonLd(html, source, url);
  if (source.id === 'roma' && /page_id=582/.test(url)) {
    const roma = parseCaiRomaHtml(html, { now }).map((row) => ({ ...row, sourceId: source.id, organizerRegion: source.region || 'Lazio', sourceDocument: url, locationSource: 'cai-roma-table' }));
    if (roma.length) return { events: roma, recognized: true, method: 'cai-roma-table' };
  }
  $('script,style,nav,footer,header,aside,.sidebar,.comments-area,.entry-meta,.post-meta,.posted-on,time.entry-date,time.published,time.updated').remove();
  const year = documentYear($('title,h1,h2').map((_i, el) => $(el).text()).get().join('\n'), url);
  const events = [...structured.events];
  let recognized = structured.recognized;
  // Event-specific date attributes are admissible; WordPress publication <time> is not.
  $('[itemtype$="/Event"],.tribe-events-calendar-list__event,.tribe-events-list-event,.mec-event-article,.eventon_list_event,.em-event,.eventlist-event').each((_index, element) => {
    const block = $(element);
    const titleEl = block.find('[itemprop="name"],h2,h3,h4,.mec-event-title,.evcal_event_title').first();
    const dateValue = block.find('[itemprop="startDate"]').attr('content') || block.find('[itemprop="startDate"]').attr('datetime') || block.find('[datetime]').first().attr('datetime');
    const dates = dateValue ? { date: dateValue } : parseDates(block.text(), year);
    const event = normalizeEvent({ title: titleEl.text(), ...dates, link: titleEl.find('a').attr('href') || titleEl.attr('href'), location: block.find('[itemprop="location"],.tribe-events-venue-details,.mec-event-loc-place').first().text(), description: block.text() }, source, url, 'html-event');
    if (event) { events.push(event); recognized = true; }
  });
  if (CALENDAR_WORDS.test(`${url} ${$('title,h1,h2').text()}`)) {
    const rows = [];
    $('table tr').each((_index, row) => rows.push($(row).find('td,th').map((_i, cell) => $(cell).text().replace(/\s+/g, ' ')).get().join(' ')));
    const tableEvents = parseCalendarLines(rows, source, url, year, 'html-table');
    events.push(...tableEvents);
    if (!tableEvents.length && !structured.events.length) {
      const root = $('main,.entry-content,article').first();
      const body = root.length ? root.clone() : $('body').clone();
      body.find('br').replaceWith('\n');
      body.find('p,li,h2,h3,h4,tr,div').append('\n');
      events.push(...parseCalendarLines(body.text().split('\n'), source, url, year, 'html-calendar'));
    }
  }
  return { events, recognized: recognized || events.length > 0, method: events.length ? 'html-calendar' : null };
}

async function pdfLines(buffer) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task = getDocument({ data: new Uint8Array(buffer), useSystemFonts: true, isEvalSupported: false, verbosity: 0 });
  const doc = await task.promise;
  const lines = [];
  try {
    // Annual section programs are bounded documents; record oversize documents as unsupported instead of silently truncating.
    if (doc.numPages > 160) throw new Error(`PDF too long for automatic calendar extraction: ${doc.numPages} pages`);
    for (let pageNo = 1; pageNo <= doc.numPages; pageNo += 1) {
      const page = await doc.getPage(pageNo);
      const content = await page.getTextContent();
      const groups = new Map();
      for (const item of content.items) {
        if (!item.str?.trim()) continue;
        const y = Math.round(item.transform[5] / 3) * 3;
        if (!groups.has(y)) groups.set(y, []);
        groups.get(y).push({ x: item.transform[4], text: item.str });
      }
      for (const [, items] of [...groups].sort((a, b) => b[0] - a[0])) lines.push(items.sort((a, b) => a.x - b.x).map((item) => item.text).join(' '));
      page.cleanup();
    }
  } finally { await task.destroy(); }
  return lines;
}

function discoverLinks(html, url, now) {
  const $ = cheerio.load(html);
  const links = [];
  $('a[href],link[type="text/calendar"][href],iframe[src]').each((_index, element) => {
    const href = safeUrl($(element).attr('href') || $(element).attr('src'), url);
    if (!href) return;
    const label = clean($(element).text());
    const signal = `${href} ${label}`;
    if (/facebook|instagram|youtube|linkedin|twitter\.com|x\.com|wa\.me|mailto:|\/feed\/?$|\/oembed\/|\.(?:png|jpe?g|gif|webp)(?:[?#]|$)/i.test(href)) return;
    if (new URL(href).hostname !== new URL(url).hostname && !/\.pdf(?:[?#]|$)|\.ics(?:[?#]|$)|calendar\.google/i.test(href)) return;
    if (!CALENDAR_WORDS.test(signal) && !/\.ics(?:[?#]|$)|ical=1|icalendar/i.test(signal)) return;
    const years = [...signal.matchAll(/\b(20\d{2})\b/g)].map((match) => Number(match[1]));
    if (years.length && Math.max(...years) < now.year) return;
    let score = /\.ics(?:[?#]|$)|ical=1|icalendar/i.test(signal) ? 100 : 0;
    score += /\.pdf(?:[?#]|$)/i.test(href) ? 80 : 0;
    score += /calendario|programma/i.test(signal) ? 40 : 0;
    score += new RegExp(String(now.year)).test(signal) ? 20 : 0;
    score += /eventi|attivit|escursion/i.test(signal) ? 10 : 0;
    if (/\/(?:tag|category|author)\//.test(href)) score -= 20;
    links.push({ url: href, score });
  });
  if (/tribe-events|tribe\/events\/v1/i.test(html)) {
    const api = safeUrl('/wp-json/tribe/events/v1/events', url);
    const parsed = new URL(api); parsed.searchParams.set('start_date', monthFloor(now)); parsed.searchParams.set('per_page', '100');
    links.push({ url: parsed.href, score: 110 });
  }
  return links.sort((a, b) => b.score - a.score);
}

async function fetchDocument(url, { timeoutMs = 8000, cacheDir = CACHE_DIR } = {}) {
  const key = digest(url);
  const metaPath = path.join(cacheDir, `${key}.json`);
  const bodyPath = path.join(cacheDir, `${key}.bin`);
  let prior;
  try { prior = JSON.parse(await fs.readFile(metaPath, 'utf8')); } catch { /* First fetch. */ }
  const response = await axios.get(url, {
    timeout: timeoutMs, responseType: 'arraybuffer', maxContentLength: 18 * 1024 * 1024, maxRedirects: 4,
    headers: { 'User-Agent': 'CAI-Italia-Calendar/1.0 (public event directory; contact through repository)', Accept: 'text/html,application/pdf,text/calendar,application/json;q=0.9,*/*;q=0.5', ...(prior?.etag ? { 'If-None-Match': prior.etag } : {}), ...(prior?.lastModified ? { 'If-Modified-Since': prior.lastModified } : {}) },
    validateStatus: (status) => status === 304 || (status >= 200 && status < 300)
  });
  if (response.status === 304 && prior) {
    try { return { ...prior, buffer: await fs.readFile(bodyPath), reusedHttp: true }; } catch { return fetchDocument(url, { timeoutMs, cacheDir: `${cacheDir}-recovery` }); }
  }
  const buffer = Buffer.from(response.data);
  const finalUrl = response.request?.res?.responseUrl || url;
  const meta = { url: finalUrl, hash: digest(buffer), contentType: response.headers['content-type'] || '', etag: response.headers.etag, lastModified: response.headers['last-modified'] };
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(bodyPath, buffer);
  await fs.writeFile(metaPath, JSON.stringify(meta));
  return { ...meta, buffer };
}

async function scrapeDeterministic(source, { now = DateTime.now(), fetchDoc = fetchDocument, maxDocuments = 12, budgetMs = 60_000, cacheDir = CACHE_DIR } = {}) {
  if (typeof now === 'string') now = DateTime.fromISO(now, { zone: 'Europe/Rome' });
  const started = Date.now();
  const initialUrls = [...new Set([...(source.calendarUrls || []), source.url, source.website].filter(Boolean))];
  const queue = initialUrls.map((url, index) => ({ url, depth: 0, score: 1000 - index }));
  const visited = new Set();
  const events = [];
  const documents = [];
  const issues = [];
  const methods = new Set();
  let recognized = false;
  let eventCount = 0;
  while (queue.length && visited.size < maxDocuments && Date.now() - started < budgetMs) {
    queue.sort((a, b) => (b.score || 0) - (a.score || 0));
    const candidate = queue.shift();
    const url = safeUrl(candidate.url, source.url);
    if (!url || visited.has(url)) continue;
    visited.add(url);
    try {
      const document = await fetchDoc(url, { timeoutMs: Math.max(1000, Math.min(8000, budgetMs - (Date.now() - started))), cacheDir });
      const text = document.buffer?.toString('utf8') ?? document.text ?? '';
      const isPdf = /application\/pdf/i.test(document.contentType) || text.startsWith('%PDF');
      const extractionKey = digest(`${VERSION}|${source.id}|${document.hash}|${now.year}`);
      const extractedPath = path.join(cacheDir, `events-${extractionKey}.json`);
      let parsed;
      // Cache annual document extraction by its content, preserving every month in that document.
      if (isPdf) {
        try { parsed = JSON.parse(await fs.readFile(extractedPath, 'utf8')); } catch {
          const lines = await pdfLines(document.buffer);
          const year = documentYear(lines.join('\n'), url);
          const extracted = source.id === 'tivoli' ? parseTivoliPdf(lines, source, document.url || url, year) : parseCalendarLines(lines, source, document.url || url, year, 'pdf-text');
          parsed = { events: extracted, recognized: extracted.length > 0, method: 'pdf-text', issues: lines.length < 5 ? ['PDF contains no extractable text; OCR/manual verification required.'] : [] };
          await fs.mkdir(cacheDir, { recursive: true }); await fs.writeFile(extractedPath, JSON.stringify(parsed));
        }
      } else if (/BEGIN:VCALENDAR/.test(text)) parsed = parseIcs(text, source, document.url || url);
      else if (/^\s*\{/.test(text)) {
        parsed = parseWordPress(JSON.parse(text), source, document.url || url);
        if (parsed.nextUrl) queue.push({ url: parsed.nextUrl, depth: candidate.depth, score: 1000 });
      } else {
        parsed = parseHtmlCalendar(text, source, document.url || url, now);
        if (candidate.depth < 2) {
          const links = discoverLinks(text, document.url || url, now).filter((link) => !visited.has(link.url));
          // Document links outrank detail pages; read linked annual programs even when the homepage only shows this month.
          queue.push(...links.slice(0, maxDocuments).map((link) => ({ ...link, score: link.score - candidate.depth * 10, depth: candidate.depth + 1 })));
        }
      }
      documents.push({ url: document.url || url, hash: document.hash, events: parsed.events.length, method: parsed.method });
      events.push(...parsed.events); eventCount += parsed.events.length;
      recognized ||= parsed.recognized;
      if (parsed.method) methods.add(parsed.method);
      issues.push(...(parsed.issues || []).map((message) => ({ url, message })));
    } catch (error) { issues.push({ url, message: error.message }); }
  }
  const remaining = queue.filter((candidate) => !visited.has(candidate.url)).length;
  if (remaining) issues.push({ url: source.url, message: `Discovery budget reached; ${remaining} candidate documents remain.`, code: 'discovery-limit' });
  if (!documents.length) { const error = new Error(issues[0]?.message || 'No public calendar URL available'); error.details = issues; throw error; }
  const unique = new Map();
  for (const event of events) {
    if ((event.dateEnd || event.date) < monthFloor(now)) continue;
    const existing = unique.get(event.id);
    if (!existing || event.coordinatesQuality === 'source' || (existing.location === 'Località da verificare' && event.location !== existing.location)) unique.set(event.id, event);
  }
  const excursions = [...unique.values()];
  return {
    status: excursions.length ? (issues.length ? 'partial' : 'ok') : (recognized && !issues.length ? 'no-upcoming' : 'unsupported'),
    excursions, hash: digest(documents.map((doc) => `${doc.url}|${doc.hash}`).sort().join('\n')),
    documents, issues, methods: [...methods], recognized, extractedEvents: eventCount, processedDocuments: documents.length,
    partial: issues.length > 0 || !recognized, elapsedMs: Date.now() - started
  };
}

module.exports = { VERSION, monthFloor, parseDates, normalizeEvent, parseJsonLd, parseIcs, parseWordPress, parseCalendarLines, parseTivoliPdf, parseHtmlCalendar, discoverLinks, pdfLines, fetchDocument, scrapeDeterministic };
