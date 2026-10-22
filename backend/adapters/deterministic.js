const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('node:crypto');
const fsSync = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const { Transform } = require('node:stream');
const { pipeline: streamPipeline } = require('node:stream/promises');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { DateTime } = require('luxon');
const { ocrPdfLines, ocrPdfPageLines, ocrPdfFilePages, ocrImageLines } = require('./pdf-ocr');
const { parseCaiRomaHtml, stableId, tripDays, parseDistanceKm, parseDurationHours } = require('../scraper');

// Bump this when deterministic extraction changes so cached documents are reparsed.
const VERSION = 13;
const MONTHS = { gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6, luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12 };
const MONTH_PATTERN = Object.keys(MONTHS).join('|');
const REGIONS = ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'];
const CACHE_DIR = path.join(__dirname, '..', 'node_modules', '.cache', 'cai');
const MAX_PDF_DOWNLOAD_BYTES = 180 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 32 * 1024 * 1024;
const MAX_PDF_PAGES = 400;
const PRIOR_TRANSIENT_RETRY_AFTER_MS = 6 * 60 * 60 * 1000;
const PRIOR_ACCESS_RETRY_AFTER_MS = 30 * 24 * 60 * 60 * 1000;
const PRIOR_REMOVED_RECHECK_AFTER_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_PRIOR_FAILURE_RETRIES_PER_SOURCE = 2;
const execFileAsync = promisify(execFile);
const EVENT_WORDS = /escursion|trekking|sentiero|rifugio|\balpe\b|monte\b|monti\b|montagna\b|moregallo\b|cima\b|anello\b|traversata|ferrata|alpinis|ciaspol|sci\b|cicloescursion|passeggiata|camminat|cammino|gita\b|uscita\b|assemblea|convegno|serata|incontro|corso\b|arrampic|torrent|speleolog|raduno|castagn|casatagn|pranzo|cena|befan|campeggi|discesa|festa|lag(?:o|hi)/i;
const CALENDAR_WORDS = /calendari|programm[ai]|escursion|attivit|eventi|gite|agenda|trekking/i;
const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const clean = (value) => cheerio.load(String(value || '')).text().replace(/\s+/g, ' ').trim();

function normalizeMonthAbbreviations(value) {
  const aliases = { gen: 'gennaio', feb: 'febbraio', mar: 'marzo', apr: 'aprile', mag: 'maggio', giu: 'giugno', lug: 'luglio', ago: 'agosto', set: 'settembre', sett: 'settembre', ott: 'ottobre', nov: 'novembre', dic: 'dicembre' };
  return String(value || '').replace(/\b(gen|feb|mar|apr|mag|giu|lug|ago|sett?|ott|nov|dic)\.(?=\s|$)/gi, (match) => aliases[match.slice(0, -1).toLowerCase()]);
}

function isNonCalendarUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const shareHost = /(?:^|\.)(?:facebook\.com|instagram\.com|youtube\.com|youtu\.be|linkedin\.com|twitter\.com|x\.com|reddit\.com|pinterest\.com|tiktok\.com|wa\.me|whatsapp\.com|addtoany\.com)$/.test(host)
      || /^(?:accounts\.google\.com|outlook\.office\.com|outlook\.live\.com)$/.test(host);
    const shareAction = /calendar\.google\.com\/calendar\/event/i.test(url.href) && url.searchParams.get('action') === 'TEMPLATE'
      || /\/deeplink\/compose/i.test(url.pathname);
    const feedOrMetadata = /\/(?:wp-json\/oembed|feed)(?:\/|$)/i.test(url.pathname);
    const unrelatedPolicy = /\/(?:assicurazioni|insurance)(?:\/|$)/i.test(url.pathname) || /polizza/i.test(url.pathname);
    const rasterImage = /\.(?:png|jpe?g|gif|webp)(?:[?#]|$)/i.test(url.href);
    return shareHost || shareAction || feedOrMetadata || unrelatedPolicy || (rasterImage && !CALENDAR_WORDS.test(url.href));
  } catch { return true; }
}

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
  // An explicit month name takes precedence over an adjacent numeric range: "8/10 Maggio"
  // means 8–10 May, not October 8.
  range = value.match(new RegExp(`\\b(\\d{1,2})(?:\\s*[-–/e]\\s*(\\d{1,2}))?\\s+(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?\\b`, 'i'));
  if (range) return {
    date: validDate(range[4] || year, MONTHS[range[3]], range[1]),
    dateEnd: range[2] ? validDate(range[4] || year, MONTHS[range[3]], range[2]) : undefined,
    matched: range[0]
  };
  // Event Manager renders localized dates as "Ottobre 25, 2026" (month first).
  // Keep the year explicit when this pattern is used so a listing cannot inherit
  // an unrelated publication year from its page title.
  range = value.match(new RegExp(`\\b(${MONTH_PATTERN})\\s+(\\d{1,2}),?\\s+(20\\d{2})\\b`, 'i'));
  if (range) return { date: validDate(range[3], MONTHS[range[1]], range[2]), matched: range[0] };
  let match = value.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (match) return { date: validDate(match[1], match[2], match[3]), matched: match[0] };
  match = value.match(/\b(\d{1,2})[/.](\d{1,2})[/.](20\d{2}|\d{2})\b/);
  if (match) return { date: validDate(match[3].length === 2 ? `20${match[3]}` : match[3], match[2], match[1]), matched: match[0] };
  match = value.match(/\b(\d{1,2})[/.](\d{1,2})(?![/.\d])\b/);
  if (match && year) return { date: validDate(year, match[2], match[1]), matched: match[0] };
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

function parseCalendarGridLines(lines, source, url, fallbackYear, method) {
  const events = [];
  const monthHeading = new RegExp(`^(${MONTH_PATTERN})\\s+(20\\d{2})$`, 'i');
  const weekdayPattern = /lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sabato|dom(?:enica)?/gi;
  const dayTokenPattern = /(?<!\S)(\d{1,2})(?=\s|$)/g;
  const dayRows = (start, end) => {
    const rows = [];
    for (let index = start; index < end; index += 1) {
      const text = String(lines[index] || '').replace(/\f/g, '');
      const tokens = [...text.matchAll(dayTokenPattern)];
      if (![1, 2, 5, 6, 7].includes(tokens.length) || tokens.some((token) => Number(token[1]) < 1 || Number(token[1]) > 31)) continue;
      rows.push({ index, tokens });
    }
    return rows;
  };

  for (let headingIndex = 0; headingIndex < lines.length; headingIndex += 1) {
    const headingText = String(lines[headingIndex] || '').replace(/\f/g, '').trim();
    const heading = headingText.match(monthHeading);
    if (!heading) continue;
    const month = MONTHS[heading[1].toLowerCase()];
    const year = Number(heading[2]) || fallbackYear;
    let endIndex = lines.length;
    for (let index = headingIndex + 1; index < lines.length; index += 1) {
      if (monthHeading.test(String(lines[index] || '').replace(/\f/g, '').trim())) { endIndex = index; break; }
    }

    const rows = dayRows(headingIndex + 1, endIndex);
    if (rows.length < 2) continue;
    let weekdayStarts = null;
    for (let index = headingIndex + 1; index < rows[0].index; index += 1) {
      const text = String(lines[index] || '').replace(/\f/g, '');
      const matches = [...text.matchAll(weekdayPattern)];
      if (matches.length === 7) { weekdayStarts = matches.map((match) => match.index); break; }
    }
    if (!weekdayStarts) continue;
    const cellCenters = rows.find((row) => row.tokens.length === 7)?.tokens.map((token) => token.index);
    if (!cellCenters) continue;

    // pdf.js can place a highlighted Sunday number a couple of points lower
    // than the other six dates. It then appears on a separate text line after
    // that week's activity labels. Rejoin only when the x positions prove the
    // first line is six distinct weekday cells and the single token fills the
    // one missing cell. This also handles holidays such as Dec 8 whose day
    // number shares a lower baseline with its label.
    const nearestDateColumn = (x) => cellCenters.reduce((best, center, column) =>
      Math.abs(center - x) < Math.abs(cellCenters[best] - x) ? column : best, 0);
    const nearestEventColumn = (x) => weekdayStarts.reduce((best, start, column) =>
      Math.abs(start - x) < Math.abs(weekdayStarts[best] - x) ? column : best, 0);
    const mergedRows = [];
    const consumedRows = new Set();
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      if (consumedRows.has(rowIndex)) continue;
      const row = rows[rowIndex];
      const columns = row.tokens.map((token) => nearestDateColumn(token.index));
      if ((row.tokens.length === 5 || row.tokens.length === 6) && new Set(columns).size === row.tokens.length) {
        const nextIndex = rows.findIndex((candidate, index) => index > rowIndex && !consumedRows.has(index));
        const next = rows[nextIndex];
        const companionColumns = next?.tokens.map((token) => nearestDateColumn(token.index)) || [];
        if (next && next.tokens.length <= 2 && next.tokens.length > 0 && next.index - row.index <= 12
            && new Set([...columns, ...companionColumns]).size === 7) {
          mergedRows.push({ index: row.index, tokens: [...row.tokens, ...next.tokens].sort((a, b) => a.index - b.index), dateLineIndices: [row.index, next.index] });
          consumedRows.add(nextIndex);
          continue;
        }
      }
      if (row.tokens.length === 7) mergedRows.push(row);
    }
    rows.splice(0, rows.length, ...mergedRows);

    let anchorRow = -1;
    let anchorColumn = -1;
    for (let rowIndex = 0; rowIndex < rows.length && anchorRow < 0; rowIndex += 1) {
      const dayIndex = rows[rowIndex].tokens.findIndex((token) => Number(token[1]) === 1);
      if (dayIndex >= 0) { anchorRow = rowIndex; anchorColumn = dayIndex; }
    }
    if (anchorRow < 0) continue;

    const firstOfMonth = DateTime.fromObject({ year, month, day: 1 }, { zone: 'UTC' });
    if (!firstOfMonth.isValid) continue;
    const columnDate = (rowIndex, column) => firstOfMonth.plus({ days: ((rowIndex - anchorRow) * 7) + column - anchorColumn }).toISODate();
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      const nextRowIndex = rows[rowIndex + 1]?.index ?? endIndex;
      const perColumn = Array.from({ length: 7 }, () => []);
      let blockHasText = false;
      const flushBlock = () => {
        if (!blockHasText) return;
        for (let column = 0; column < perColumn.length; column += 1) {
          const title = clean(perColumn[column].join(' '));
          if (!title || !EVENT_WORDS.test(title)) continue;
          const event = normalizeEvent({ title, date: columnDate(rowIndex, column), description: title }, source, url, method);
          if (event) events.push(event);
          perColumn[column] = [];
        }
        for (const values of perColumn) values.length = 0;
        blockHasText = false;
      };

      for (let index = row.index + 1; index < nextRowIndex; index += 1) {
        if (row.dateLineIndices?.includes(index)) continue;
        const line = String(lines[index] || '').replace(/\f/g, '');
        if (/\bnote\b/i.test(line)) { flushBlock(); break; }
        if (!line.trim()) { flushBlock(); continue; }
        const runs = [...line.matchAll(/\S.*?(?=\s{2,}|$)/g)];
        if (!runs.length) continue;
        for (const run of runs) {
          const text = run[0].trim();
          if (!text) continue;
          const column = nearestEventColumn(run.index);
          perColumn[column].push(text);
          blockHasText = true;
        }
      }
      flushBlock();
    }
  }

  const unique = new Map();
  for (const event of events) unique.set(event.id, event);
  return unique.size ? [...unique.values()] : null;
}

function parseCalendarLines(lines, source, url, year, method) {
  const gridEvents = parseCalendarGridLines(lines, source, url, year, method);
  if (gridEvents) return gridEvents;
  return parseCalendarLinearLines(lines, source, url, year, method);
}

function cleanKnownPdfOcrArtifact(value, source, method) {
  // The Cernusco annual scan has a side panel with the course leader next to
  // the October calendar cell. Full-page OCR sometimes joins that panel to the
  // 25 October event; the rendered PDF shows only “Alpe Devero (VB)” in the cell.
  if (source?.id === 'cai-cernusco-sul-naviglio-9216051' && method === 'pdf-ocr') {
    const text = String(value || '').trim();
    const knownRow = /^(?:25\s+ottobre\s*[-–—]\s*)?Alpe\s+Devero\s*\(VB\)\s+j\s+Cesare\s+Andreoni\s+2026\b/i;
    if (knownRow.test(text)) return text.replace(/\s+j\s+Cesare\s+Andreoni\s+2026\b.*$/i, '').trim();
    return value;
  }
  return value;
}

function parseCalendarLinearLines(lines, source, url, year, method) {
  const events = [];
  let month;
  for (let index = 0; index < lines.length; index += 1) {
    const line = normalizeMonthAbbreviations(clean(lines[index]));
    if (!line) continue;
    const monthHeading = line.toLowerCase().match(new RegExp(`^(${MONTH_PATTERN})(?:\\s+(20\\d{2}))?$`));
    if (monthHeading) { month = MONTHS[monthHeading[1]]; year = Number(monthHeading[2] || year); continue; }
    const range = parseDates(line, year, month);
    if (!range?.date) continue;
    const dateStart = line.toLowerCase().indexOf(range.matched.trim().toLowerCase());
    const beforeDate = line.slice(0, dateStart).trim();
    const afterDate = line.slice(dateStart + range.matched.length).replace(/^[\s:;|–—-]+/, '').trim();
    const genericHeading = /^(?:escursionismo|escursion(?:i)?\s+(?:alpinistiche|per ragazzi|senior(?:\s+.*)?|cicloescursionismo)|alpinismo|cicloescursionismo|programma|attivit[aà]|riflessi d['’]autunno|serate|in allegria|lavoriamo insieme|in evidenza)$/i.test(beforeDate);
    const beforeIsEventTitle = EVENT_WORDS.test(beforeDate) && !genericHeading;
    if (beforeDate && !beforeIsEventTitle && !genericHeading && !/^(?:(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?|dal|da|data|e|[-–:])+\s*)+$/i.test(beforeDate)) continue;
    let title = beforeIsEventTitle ? beforeDate : afterDate.replace(/^\s*(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?)\b\s*/i, '').replace(/^[\s:;|–—-]+/, '').trim();
    const weekdayInHeader = /(?:^|\s)(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?)(?:$|\s)/i.test(`${beforeDate} ${line.slice(line.toLowerCase().indexOf(range.matched.trim().toLowerCase()) + range.matched.length)}`);
    let eventLine = line;
    if (!EVENT_WORDS.test(title) && weekdayInHeader) {
      for (let lookahead = index + 1; lookahead < Math.min(index + 13, lines.length); lookahead += 1) {
        const candidate = normalizeMonthAbbreviations(clean(lines[lookahead]));
        if (!candidate) continue;
        if (/^(?:(?:data\s+)?(?:lun(?:ed[iì])?|mar(?:ted[iì])?|mer(?:coled[iì])?|gio(?:ved[iì])?|ven(?:erd[iì])?|sab(?:ato)?|dom(?:enica)?)\s+)?\d{1,2}(?:[-–/]\d{1,2})?\b/i.test(candidate)
          && parseDates(candidate, year, month)?.date) break;
        if (EVENT_WORDS.test(candidate) && !/^\s*\d+\)/.test(candidate)
          && !/^(?:le escursioni sono|il programma potr[aà]|per una corretta pratica|modalit[aà] di partecipazione)/i.test(candidate)
          && !/pubblicat|aggiornat|regolamento|iscrizion[ei]|quote obbligatorie|partecipazione alle escursioni/i.test(candidate)) {
          title = candidate;
          eventLine = `${line} ${candidate}`;
          break;
        }
      }
    }
    // Generic pages include publication dates and footer dates. Import only actual activity descriptions.
    if (!EVENT_WORDS.test(title) || /^(?:escursionismo|escursion(?:i)?\s+(?:alpinistiche|per ragazzi|senior(?:\s+.*)?|cicloescursionismo)|alpinismo|cicloescursionismo|programma|attivit[aà]|riflessi d['’]autunno|serate|in allegria|lavoriamo insieme|in evidenza)$/i.test(title)
      || /^\s*\d+\)/.test(title) || /^(?:le escursioni sono|il programma potr[aà]|\(cai [^)]+\) in relazione|per una corretta pratica|modalit[aà] di partecipazione)/i.test(title)
      || /^(?:la prima|la prossima) escursione\b/i.test(title)
      || /pubblicat|aggiornat|copyright|cookie|privacy|tesseramento|contattaci|leggi tutto|orario di apertura|regolamento|iscrizion[ei]|quote obbligatorie|partecipazione alle escursioni/i.test(title)) continue;
    title = cleanKnownPdfOcrArtifact(title, source, method);
    eventLine = cleanKnownPdfOcrArtifact(eventLine, source, method);
    if (!title) continue;
    const event = normalizeEvent({ title, ...range, description: eventLine }, source, url, method);
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
    const eventManager = block.hasClass('em-event')
      && block.find('.em-item-title').length > 0
      && block.find('.em-event-date').length > 0;
    const titleEl = block.find(eventManager
      ? '.em-item-title'
      : '[itemprop="name"],h2,h3,h4,.mec-event-title,.evcal_event_title').first();
    const dateValue = block.find('[itemprop="startDate"]').attr('content') || block.find('[itemprop="startDate"]').attr('datetime') || block.find('[datetime]').first().attr('datetime');
    const dates = dateValue ? { date: dateValue } : parseDates(eventManager ? block.find('.em-event-date').first().text() : block.text(), year);
    const description = eventManager ? block.find('.em-item-desc').first().text() : block.text();
    const event = normalizeEvent({ title: titleEl.text(), ...dates, link: titleEl.find('a').attr('href') || titleEl.attr('href'), location: block.find('[itemprop="location"],.tribe-events-venue-details,.mec-event-loc-place').first().text(), description }, source, url, 'html-event');
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

async function pdfText(buffer) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task = getDocument({ data: new Uint8Array(buffer), useSystemFonts: true, isEvalSupported: false, verbosity: 0 });
  const doc = await task.promise;
  const lines = [];
  const columnLines = [];
  try {
    // Annual section programs are bounded documents; record oversize documents as unsupported instead of silently truncating.
    if (doc.numPages > 160) throw new Error(`PDF too long for automatic calendar extraction: ${doc.numPages} pages`);
    const layoutLine = (items, width) => {
      const charWidth = width / 160;
      const characters = [];
      for (const item of [...items].sort((a, b) => a.x - b.x)) {
        const text = String(item.text || '').trim();
        if (!text) continue;
        let start = Math.max(0, Math.round(item.x / charWidth));
        // Keep adjacent PDF text items distinguishable as separate column
        // runs, even when their measured glyph boxes leave only one character
        // cell between them (or overlap after rounding).
        if (start <= characters.length + 1) start = characters.length + 2;
        while (characters.length < start) characters.push(' ');
        for (let offset = 0; offset < text.length; offset += 1) characters[start + offset] = text[offset];
      }
      return characters.join('').trimEnd();
    };
    for (let pageNo = 1; pageNo <= doc.numPages; pageNo += 1) {
      const page = await doc.getPage(pageNo);
      const content = await page.getTextContent();
      const width = page.getViewport({ scale: 1 }).width;
      const groups = new Map();
      for (const item of content.items) {
        if (!item.str?.trim()) continue;
        // Calendar grid labels and Sunday day numbers can differ by ~2 points vertically
        // while occupying the same visual row (e.g. highlighted cells in the CAI booklet).
        const y = Math.round(item.transform[5] / 5) * 5;
        if (!groups.has(y)) groups.set(y, []);
        groups.get(y).push({ x: item.transform[4], text: item.str });
      }
      const orderedGroups = [...groups].sort((a, b) => b[0] - a[0]);
      let previousY = null;
      for (const [y, items] of orderedGroups) {
        if (previousY != null && previousY - y > 15) lines.push('');
        lines.push(layoutLine(items, width));
        previousY = y;
      }
      const items = content.items.filter((item) => item.str?.trim());
      const split = findPdfColumnSplit(items, width);
      if (split) {
        for (const side of ['left', 'right']) {
          for (const [, rowItems] of orderedGroups) {
            const column = rowItems.filter((item) => side === 'left' ? item.x < split : item.x >= split);
            if (column.length) columnLines.push(layoutLine(column, width));
          }
        }
      } else {
        for (const [, rowItems] of orderedGroups) columnLines.push(rowItems.sort((a, b) => a.x - b.x).map((item) => item.text).join(' '));
      }
      page.cleanup();
    }
  } finally { await task.destroy(); }
  return { lines, columnLines, pageCount: doc.numPages };
}

async function pdfTextFile(filePath, { timeoutMs = 45_000, pages } = {}) {
  const { stdout: info } = await execFileAsync('pdfinfo', [filePath], {
    timeout: Math.min(timeoutMs, 15_000), maxBuffer: 1024 * 1024, windowsHide: true
  });
  const pageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > MAX_PDF_PAGES) {
    throw new Error(`PDF page count must be between 1 and ${MAX_PDF_PAGES}; got ${pageCount || 'unknown'}`);
  }
  const firstPage = pages?.[0] ?? 1;
  const lastPage = pages?.[1] ?? pageCount;
  if (!Number.isInteger(firstPage) || !Number.isInteger(lastPage) || firstPage < 1 || lastPage < firstPage || lastPage > pageCount) {
    throw new Error(`Invalid PDF page range ${firstPage}-${lastPage} for ${pageCount} pages`);
  }
  const { stdout } = await execFileAsync('pdftotext', [
    '-layout', '-enc', 'UTF-8', '-f', String(firstPage), '-l', String(lastPage), filePath, '-'
  ], { timeout: timeoutMs, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  const lines = String(stdout || '').split(/\r?\n/);
  return { lines, columnLines: lines, pageCount, extractedPages: [firstPage, lastPage] };
}

function findPdfColumnSplit(items, width) {
  const xValues = [...new Set(items.map((item) => Math.round(item.transform[4])))].sort((a, b) => a - b);
  const candidates = [];
  for (let index = 1; index < xValues.length; index += 1) {
    const gap = xValues[index] - xValues[index - 1];
    const split = (xValues[index] + xValues[index - 1]) / 2;
    if (gap < 28 || split < width * 0.22 || split > width * 0.58) continue;
    const leftRows = new Set();
    const rightRows = new Set();
    for (const item of items) {
      const y = Math.round(item.transform[5] / 3) * 3;
      (item.transform[4] < split ? leftRows : rightRows).add(y);
    }
    const overlap = [...leftRows].filter((y) => rightRows.has(y)).length;
    if (leftRows.size < 12 || rightRows.size < 12 || overlap < 5) continue;
    const balance = Math.min(leftRows.size, rightRows.size) / Math.max(leftRows.size, rightRows.size);
    candidates.push({ split, score: gap * overlap * balance });
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.split ?? null;
}

async function pdfLines(buffer) {
  return (await pdfText(buffer)).lines;
}

function discoverLinks(html, url, now) {
  const $ = cheerio.load(html);
  const links = [];
  $('a[href],link[type="text/calendar"][href],iframe[src]').each((_index, element) => {
    const href = safeUrl($(element).attr('href') || $(element).attr('src'), url);
    if (!href) return;
    const label = clean($(element).text());
    const signal = `${href} ${label}`;
    if (isNonCalendarUrl(href) && !/\.(?:png|jpe?g|gif|webp)(?:[?#]|$)/i.test(href)) return;
    if (/\.(?:png|jpe?g|gif|webp)(?:[?#]|$)/i.test(href) && !CALENDAR_WORDS.test(signal)) return;
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

function validateRedirectTarget(options, policy) {
  if (!policy) return;
  const hostname = String(options.hostname || options.host || '').replace(/:\d+$/, '').toLowerCase();
  const protocol = String(options.protocol || '').toLowerCase();
  const port = String(options.port || '');
  if (hostname !== policy.host || protocol !== 'https:' || (port && port !== '443') || options.auth) {
    throw new Error(`Blocked redirect outside official HTTPS host ${policy.host}`);
  }
}

async function fetchDocument(url, { timeoutMs = 8000, cacheDir = CACHE_DIR, redirectPolicy } = {}) {
  const key = digest(url);
  const metaPath = path.join(cacheDir, `${key}.json`);
  const bodyPath = path.join(cacheDir, `${key}.bin`);
  let prior;
  try { prior = JSON.parse(await fs.readFile(metaPath, 'utf8')); } catch { /* First fetch. */ }
  const response = await axios.get(url, {
    // Node's environment proxy support handles the configured cloud proxy;
    // Axios' own env-proxy parsing is incompatible with this runtime proxy URL.
    ...(process.env.NODE_USE_ENV_PROXY === '1' ? { proxy: false } : {}),
    timeout: timeoutMs, responseType: 'stream', maxContentLength: MAX_PDF_DOWNLOAD_BYTES, maxRedirects: 4,
    ...(redirectPolicy ? { beforeRedirect: (options) => validateRedirectTarget(options, redirectPolicy) } : {}),
    headers: { 'User-Agent': 'CAI-Italia-Calendar/1.0 (public event directory; contact through repository)', Accept: 'text/html,application/pdf,text/calendar,application/json;q=0.9,*/*;q=0.5', ...(prior?.etag ? { 'If-None-Match': prior.etag } : {}), ...(prior?.lastModified ? { 'If-Modified-Since': prior.lastModified } : {}) },
    validateStatus: (status) => status === 304 || (status >= 200 && status < 300)
  });
  if (response.status === 304 && prior) {
    try {
      const bytes = prior.bytes || (await fs.stat(bodyPath)).size;
      const buffer = bytes <= MAX_DOCUMENT_BYTES ? await fs.readFile(bodyPath) : null;
      return { ...prior, bytes, buffer, filePath: bodyPath, reusedHttp: true };
    } catch { return fetchDocument(url, { timeoutMs, cacheDir: `${cacheDir}-recovery` }); }
  }
  const contentType = response.headers['content-type'] || '';
  const requestedPdf = /\.pdf(?:[?#]|$)/i.test(url);
  const isPdfResponse = /application\/pdf/i.test(contentType) || requestedPdf;
  const maxBytes = isPdfResponse ? MAX_PDF_DOWNLOAD_BYTES : MAX_DOCUMENT_BYTES;
  const declaredBytes = Number(response.headers['content-length']);
  if (Number.isFinite(declaredBytes) && declaredBytes > maxBytes) {
    response.data.destroy();
    throw new Error(`${isPdfResponse ? 'PDF' : 'Document'} exceeds bounded download size of ${maxBytes} bytes (${declaredBytes} declared)`);
  }
  await fs.mkdir(cacheDir, { recursive: true });
  const tempBodyPath = `${bodyPath}.${process.pid}.${Date.now()}.tmp`;
  const hash = crypto.createHash('sha256');
  let bytes = 0;
  const limiter = new Transform({
    transform(chunk, _encoding, callback) {
      bytes += chunk.length;
      if (bytes > maxBytes) return callback(new Error(`${isPdfResponse ? 'PDF' : 'Document'} exceeded bounded download size of ${maxBytes} bytes`));
      hash.update(chunk);
      callback(null, chunk);
    }
  });
  try {
    await streamPipeline(response.data, limiter, fsSync.createWriteStream(tempBodyPath, { flags: 'wx' }));
    await fs.rename(tempBodyPath, bodyPath);
  } catch (error) {
    response.data.destroy();
    await fs.rm(tempBodyPath, { force: true });
    throw error;
  }
  const finalUrl = response.request?.res?.responseUrl || url;
  const meta = { url: finalUrl, hash: hash.digest('hex'), contentType, etag: response.headers.etag, lastModified: response.headers['last-modified'], bytes };
  await fs.writeFile(metaPath, JSON.stringify(meta));
  return { ...meta, buffer: bytes <= MAX_DOCUMENT_BYTES ? await fs.readFile(bodyPath) : null, filePath: bodyPath };
}

function httpStatusFromMessage(value) {
  const match = String(value || '').match(/(?:status code\s+|HTTP\/1\.1\s+)(\d{3})/i);
  return match ? Number(match[1]) : null;
}

function priorFailureFromIssue(issue, sourceUpdatedAt) {
  const status = Number(issue.httpStatus) || httpStatusFromMessage(issue.failureMessage || issue.message);
  if (![401, 403, 404, 410, 429, 500, 502, 503, 504].includes(status)) return null;
  const kind = [404, 410].includes(status) ? 'removed'
    : [401, 403].includes(status) ? 'access-denied'
      : 'transient';
  const retryAfterMs = kind === 'removed' ? PRIOR_REMOVED_RECHECK_AFTER_MS
    : kind === 'access-denied' ? PRIOR_ACCESS_RETRY_AFTER_MS
      : PRIOR_TRANSIENT_RETRY_AFTER_MS;
  const failureAt = issue.failureAt || sourceUpdatedAt || null;
  const failureTime = failureAt ? Date.parse(failureAt) : Number.NaN;
  const expired = !Number.isFinite(failureTime) || Date.now() - failureTime >= retryAfterMs;
  return {
    status,
    kind,
    retryAfterMs,
    failureAt,
    expired,
    failureMessage: issue.failureMessage || issue.message || `HTTP ${status}`
  };
}

function previousFailureSkipIssue(url, failure) {
  const explanations = {
    removed: `Official URL previously returned HTTP ${failure.status}; searching the section's official pages for a replacement.`,
    'access-denied': `Official URL previously returned HTTP ${failure.status}; access will be rechecked after the cooldown.`,
    transient: `URL previously returned transient HTTP ${failure.status}; retry is eligible after the cooldown.`
  };
  return {
    url,
    code: 'previous-unavailable-skipped',
    httpStatus: failure.status,
    failureAt: failure.failureAt,
    failureMessage: failure.failureMessage,
    message: explanations[failure.kind]
  };
}

function retryBudgetSkipIssue(url, failure) {
  return {
    url,
    code: 'previous-retry-budget-skipped',
    httpStatus: failure.status,
    failureAt: failure.failureAt,
    failureMessage: failure.failureMessage,
    message: `Per-source retry budget (${MAX_PRIOR_FAILURE_RETRIES_PER_SOURCE}) exhausted for previously failed URLs.`
  };
}

function failureIssue(url, error) {
  const status = Number(error?.response?.status) || httpStatusFromMessage(error?.message);
  const httpFailure = [401, 403, 404, 410, 429, 500, 502, 503, 504].includes(status);
  return {
    url,
    ...(httpFailure ? { code: [404, 410].includes(status) ? 'http-removed' : [500, 502, 503, 504, 429].includes(status) ? 'http-transient' : 'http-access-denied', httpStatus: status, failureAt: new Date().toISOString(), failureMessage: error.message } : {}),
    message: error.message
  };
}

function validateInitialUrls(source, initialUrls) {
  if (!Array.isArray(initialUrls) || initialUrls.length === 0) return [];
  let officialHost;
  try {
    const official = new URL(source.website || source.url);
    if (!['http:', 'https:'].includes(official.protocol)) throw new Error();
    officialHost = official.hostname.toLowerCase();
  } catch {
    throw new Error(`Cannot validate continuation URLs for ${source.id}: source has no valid official website URL`);
  }
  const validated = [];
  const seen = new Set();
  for (const value of initialUrls) {
    let candidate;
    try { candidate = new URL(value); } catch {
      throw new Error(`Invalid continuation URL for ${source.id}: ${value}`);
    }
    if (!['http:', 'https:'].includes(candidate.protocol) || candidate.username || candidate.password || candidate.port
      || candidate.hostname.toLowerCase() !== officialHost) {
      throw new Error(`Continuation URL host must match ${officialHost}: ${value}`);
    }
    if (!seen.has(candidate.href)) {
      seen.add(candidate.href);
      validated.push(candidate.href);
    }
  }
  return validated;
}

async function scrapeDeterministic(source, { now = DateTime.now(), fetchDoc = fetchDocument, maxDocuments = 12, budgetMs = 60_000, cacheDir = CACHE_DIR, recognizePdf = ocrPdfLines, recognizePdfPage = ocrPdfPageLines, recognizePdfFile = ocrPdfFilePages, previousStatus, initialUrls: requestedInitialUrls = [] } = {}) {
  if (typeof now === 'string') now = DateTime.fromISO(now, { zone: 'Europe/Rome' });
  const started = Date.now();
  const pdfOnly = process.env.SCRAPE_PDF_ONLY === '1';
  const explicitPdfUrls = String(process.env.SCRAPE_PDF_URLS || '').split(',').map((value) => value.trim()).filter(Boolean);
  const longTimeoutPdfUrls = new Set(String(process.env.SCRAPE_PDF_LONG_TIMEOUT_URLS || '').split(',').map((value) => value.trim()).filter(Boolean));
  let pdfPageRanges = {};
  try { pdfPageRanges = JSON.parse(process.env.SCRAPE_PDF_PAGE_RANGES || '{}'); } catch { throw new Error('SCRAPE_PDF_PAGE_RANGES must be valid JSON'); }
  let pdfOcrPages = {};
  try { pdfOcrPages = JSON.parse(process.env.SCRAPE_PDF_OCR_PAGES || '{}'); } catch { throw new Error('SCRAPE_PDF_OCR_PAGES must be valid JSON'); }
  const continuationUrls = validateInitialUrls(source, requestedInitialUrls);
  const continuationHost = continuationUrls.length
    ? new URL(source.website || source.url).hostname.toLowerCase()
    : null;
  let candidates = continuationUrls.length
    ? continuationUrls
    : [...new Set([...(source.calendarUrls || []), source.url, source.website].filter(Boolean))];
  if (!continuationUrls.length && pdfOnly && explicitPdfUrls.length) {
    const sourceHost = new URL(source.website || source.url).hostname.replace(/^www\./i, '').toLowerCase();
    candidates = explicitPdfUrls.filter((url) => {
      try { return new URL(url).hostname.replace(/^www\./i, '').toLowerCase() === sourceHost; } catch { return false; }
    });
  }
  if (pdfOnly) candidates = candidates.filter((url) => /\.pdf(?:[?#]|$)/i.test(url));
  const registryPath = path.join(__dirname, '..', 'data', 'scrape-status.json');
  let previous = previousStatus;
  if (!previous) {
    try { previous = JSON.parse(await fs.readFile(registryPath, 'utf8')); }
    catch { previous = {}; /* A missing previous status file must not stop source collection. */ }
  }
  const previousSource = (previous.sources || []).find((entry) => entry.id === source.id) || {};
  const priorFailures = new Map();
  for (const issue of previousSource.issues || []) {
    if (!issue.url) continue;
    const failure = priorFailureFromIssue(issue, previousSource.updatedAt);
    if (failure) priorFailures.set(issue.url, failure);
  }
  const sourceScopedSkip = (url) => {
    if (source.id === 'cai-varano-borghi-9116118' && /caigavirate\.it/i.test(url)
      && !/sottosezione(?:-di)?-varano-borghi/i.test(url)) return 'Shared CAI Gavirate calendar omitted; this source is the dedicated Varano Borghi subsection.';
    if (source.id === 'cai-meda-9216042' && /comune\.meda\.mb\.it/i.test(url)) return 'Shared Meda municipal event leaflet omitted; CAI Meda official calendars remain in scope.';
    return null;
  };
  const omitted = new Map(candidates.map((url) => [url, sourceScopedSkip(url)]).filter(([, reason]) => reason));
  let priorRetriesUsed = 0;
  const skipped = candidates.filter((url) => omitted.has(url) || isNonCalendarUrl(url));
  const initialUrls = [];
  const issues = skipped.map((url) => ({
    url,
    code: omitted.has(url) ? 'shared-attribution-skipped' : 'non-calendar-link-skipped',
    message: omitted.get(url) || 'Skipped social, feed, metadata, sharing, or unrelated image URL.'
  }));
  const scheduleUrl = (url) => {
    if (omitted.has(url) || isNonCalendarUrl(url)) return false;
    const failure = priorFailures.get(url);
    if (!failure) return true;
    if (!failure.expired) {
      issues.push(previousFailureSkipIssue(url, failure));
      return false;
    }
    if (priorRetriesUsed >= MAX_PRIOR_FAILURE_RETRIES_PER_SOURCE) {
      issues.push(retryBudgetSkipIssue(url, failure));
      return false;
    }
    priorRetriesUsed += 1;
    return true;
  };
  for (const url of candidates) if (scheduleUrl(url)) initialUrls.push(url);
  const queue = initialUrls.map((url, index) => ({ url, depth: 0, score: 1000 - index }));
  const queued = new Set(initialUrls);
  const visited = new Set();
  const events = [];
  const documents = [];
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
      const documentTimeout = /\.pdf(?:[?#]|$)/i.test(url) ? (longTimeoutPdfUrls.has(url) ? 180_000 : 90_000) : 8000;
      const document = await fetchDoc(url, {
        timeoutMs: Math.max(1000, Math.min(documentTimeout, budgetMs - (Date.now() - started))),
        cacheDir,
        ...(continuationHost ? { redirectPolicy: { host: continuationHost } } : {})
      });
      const text = document.buffer?.toString('utf8') ?? document.text ?? '';
      const isPdf = /application\/pdf/i.test(document.contentType) || text.startsWith('%PDF') || Boolean(document.filePath && /\.pdf(?:[?#]|$)/i.test(url));
      const extractionKey = digest(`${VERSION}|${source.id}|${document.hash}|${now.year}|${JSON.stringify(pdfPageRanges[source.id] || null)}|${JSON.stringify(pdfOcrPages[source.id] || null)}`);
      const extractedPath = path.join(cacheDir, `events-${extractionKey}.json`);
      let parsed;
      // Cache annual document extraction by its content, preserving every month in that document.
      if (isPdf) {
        try { parsed = JSON.parse(await fs.readFile(extractedPath, 'utf8')); } catch {
          const pdfResult = document.buffer
            ? await pdfText(document.buffer)
            : await pdfTextFile(document.filePath, { timeoutMs: Math.min(45_000, Math.max(1000, budgetMs - (Date.now() - started))), pages: pdfPageRanges[source.id] });
          const { lines: extractedText, columnLines, pageCount } = pdfResult;
          let lines = extractedText;
          let method = 'pdf-text';
          let cacheable = true;
          const textLength = lines.join(' ').replace(/\s/g, '').length;
          const ocrIssues = [];
          if (textLength < 80) {
            const remainingBudgetMs = budgetMs - (Date.now() - started);
            if (remainingBudgetMs <= 0) {
              cacheable = false;
              ocrIssues.push('PDF OCR skipped because the scrape time budget is exhausted.');
            } else {
              try {
                const timeoutMs = Math.min(90_000, remainingBudgetMs);
                const targetedPages = ({
                  'cai-colico-9216123': [12],
                  'cai-missaglia-9216150': [21]
                })[source.id] || pdfOcrPages[source.id];
                const ocrLines = document.buffer
                  ? (targetedPages
                    ? await recognizePdfPage(document.buffer, { pageCount, pages: targetedPages, timeoutMs })
                    : await recognizePdf(document.buffer, { pageCount, timeoutMs }))
                  : await recognizePdfFile(document.filePath, { pageCount, pages: targetedPages, timeoutMs });
                if (ocrLines.join(' ').replace(/\s/g, '').length > textLength) {
                  lines = ocrLines;
                  method = 'pdf-ocr';
                }
                if (lines.join(' ').replace(/\s/g, '').length < 80) ocrIssues.push('PDF has little or no extractable text after OCR; manual verification required.');
              } catch (error) {
                cacheable = false;
                ocrIssues.push(`PDF OCR unavailable or failed: ${error.message}`);
              }
            }
          }
          const year = documentYear(lines.join('\n'), url);
          const parsePdfLines = (candidateLines) => source.id === 'tivoli'
            ? parseTivoliPdf(candidateLines, source, document.url || url, year)
            : parseCalendarLines(candidateLines, source, document.url || url, year, method);
          let extracted = parsePdfLines(lines);
          // Multi-column CAI booklets interleave rows from separate columns in PDF text order.
          // Prefer the coordinate-separated reading only when it produces more grounded events.
          if (columnLines?.length && columnLines !== lines) {
            const columnEvents = parsePdfLines(columnLines);
            if (columnEvents.length > extracted.length) extracted = columnEvents;
          }
          parsed = { events: extracted, recognized: extracted.length > 0, method, issues: ocrIssues };
          if (cacheable) {
            await fs.mkdir(cacheDir, { recursive: true });
            await fs.writeFile(extractedPath, JSON.stringify(parsed));
          }
        }
      } else if (/^image\/(?:jpeg|png|webp|tiff|gif|bmp)(?:;|$)/i.test(document.contentType || '') && document.buffer?.length <= 12 * 1024 * 1024) {
        const remainingBudgetMs = budgetMs - (Date.now() - started);
        if (remainingBudgetMs <= 0) throw new Error('Image OCR skipped because the scrape time budget is exhausted.');
        const lines = await ocrImageLines(document.buffer, { timeoutMs: Math.min(30_000, remainingBudgetMs) });
        const textLength = lines.join(' ').replace(/\s/g, '').length;
        const year = documentYear(lines.join('\n'), url, now.year);
        const extracted = textLength >= 40 ? parseCalendarLines(lines, source, document.url || url, year, 'image-ocr') : [];
        const imageIssues = textLength < 40 ? ['Image OCR yielded insufficient text; manual verification required.'] : [];
        parsed = { events: extracted, recognized: extracted.length > 0, method: 'image-ocr', issues: imageIssues };
      } else if (/BEGIN:VCALENDAR/.test(text)) parsed = parseIcs(text, source, document.url || url);
      else if (/^\s*\{/.test(text)) {
        parsed = parseWordPress(JSON.parse(text), source, document.url || url);
        if (parsed.nextUrl) queue.push({ url: parsed.nextUrl, depth: candidate.depth, score: 1000 });
      } else {
        parsed = parseHtmlCalendar(text, source, document.url || url, now);
        if (candidate.depth < 2) {
          const discoveredLinks = discoverLinks(text, document.url || url, now);
          const links = [];
          for (const link of discoveredLinks) {
            if ((pdfOnly && !/\.pdf(?:[?#]|$)/i.test(link.url)) || visited.has(link.url) || queued.has(link.url)) continue;
            if (!scheduleUrl(link.url)) continue;
            queued.add(link.url);
            links.push(link);
          }
          // Document links outrank detail pages; read linked annual programs even when the homepage only shows this month.
          queue.push(...links.slice(0, maxDocuments).map((link) => ({
            ...link,
            score: link.score - candidate.depth * 10,
            depth: candidate.depth + 1,
            ...(continuationUrls.length ? { originUrl: document.url || url } : {})
          })));
        }
      }
      documents.push({ url: document.url || url, hash: document.hash, events: parsed.events.length, method: parsed.method });
      events.push(...parsed.events); eventCount += parsed.events.length;
      recognized ||= parsed.recognized;
      if (parsed.method) methods.add(parsed.method);
      issues.push(...(parsed.issues || []).map((message) => ({ url, message })));
    } catch (error) { issues.push(failureIssue(url, error)); }
  }
  const remainingByScope = new Map();
  for (const candidate of queue.filter((entry) => !visited.has(entry.url))) {
    // For a bounded continuation, identify the document/seed whose local
    // discovery queue remains open. source.url can be an unrelated annual PDF
    // and would collide with that PDF's persisted discovery-limit issue.
    const issueUrl = continuationUrls.length
      ? (candidate.originUrl || candidate.url)
      : source.url;
    remainingByScope.set(issueUrl, (remainingByScope.get(issueUrl) || 0) + 1);
  }
  const remaining = [...remainingByScope.values()].reduce((total, count) => total + count, 0);
  for (const [issueUrl, count] of remainingByScope) {
    issues.push({ url: issueUrl, message: `Discovery budget reached; ${count} candidate documents remain.`, code: 'discovery-limit' });
  }
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
    // Explicit URL continuations replace the discovery queue. Exhausting that
    // caller-selected subset is not evidence that the source's prior
    // discovery-limit queue has been exhausted.
    discovery: {
      knownCandidates: queued.size,
      visitedCandidates: [...queued].filter((url) => visited.has(url)).length,
      remainingCandidates: remaining,
      complete: continuationUrls.length === 0 && remaining === 0 && visited.size >= queued.size
    },
    partial: issues.length > 0 || !recognized, elapsedMs: Date.now() - started
  };
}

module.exports = { VERSION, monthFloor, parseDates, normalizeEvent, parseJsonLd, parseIcs, parseWordPress, parseCalendarLines, parseTivoliPdf, parseHtmlCalendar, discoverLinks, pdfLines, pdfText, pdfTextFile, fetchDocument, scrapeDeterministic, validateInitialUrls, validateRedirectTarget, MAX_PDF_DOWNLOAD_BYTES, MAX_PDF_PAGES };
