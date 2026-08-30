const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('node:crypto');
const { DateTime } = require('luxon');

const CAI_ROMA_URL = 'https://www.cairoma.it/?page_id=582';
const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_RETRIES = 3;
const DEFAULT_COORDS = { lat: 41.891, lng: 12.492 };

const MONTHS = {
  GEN: 1, GENNAIO: 1, FEB: 2, FEBBRAIO: 2, MAR: 3, MARZO: 3,
  APR: 4, APRILE: 4, MAG: 5, MAGGIO: 5, GIU: 6, GIUGNO: 6,
  LUG: 7, LUGLIO: 7, AGO: 8, AGOSTO: 8, SET: 9, SETTEMBRE: 9,
  OTT: 10, OTTOBRE: 10, NOV: 11, NOVEMBRE: 11, DIC: 12, DICEMBRE: 12
};

function cellLines($, cell) {
  const clone = $(cell).clone();
  clone.find('br').replaceWith('\n');
  return clone.text().split('\n')
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

const DATE_TOKEN = /(?:lun|mar|mer|gio|ven|sab|dom)\s+(\d{1,2})\s+(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)/gi;

const REGION_RULES = [
  { region: 'Estero', tests: [/turchia/, /lussemburgo/, /mullerthal/, /moselsteig/] },
  { region: 'Sicilia', tests: [/pantelleria/, /sicilia/] },
  { region: 'Sardegna', tests: [/supramonte/, /sardegna/, /baunei/] },
  { region: 'Trentino-Alto Adige', tests: [/trentino/, /dolomiti/, /fiemme/, /fassa/] },
  { region: 'Piemonte', tests: [/cozie/, /maira/, /piemonte/] },
  { region: 'Toscana', tests: [/toscana/, /apuane/, /orcia/] },
  { region: 'Umbria', tests: [/umbria/, /amerini/, /subasio/, /narni/, /gemini/] },
  {
    region: 'Abruzzo',
    tests: [
      /gran sasso/, /maiella/, /majella/, /marsicani/, /velino/, /sirente/,
      /pnalm/, /mainarde/, /\bmeta\b/, /aterno/, /barrea/, /trabocchi/,
      /sulmona/, /abruzzo/
    ]
  },
  {
    region: 'Lazio',
    tests: [
      /lucretili/, /ernici/, /aurunci/, /ausoni/, /lepini/, /sabini/, /reatini/,
      /cicolano/, /simbruini/, /albani/, /tuscia/, /sabatini/, /duchessa/,
      /nazzano/, /farfa/, /\blazio\b/
    ]
  }
];

function parseDate(value, year) {
  const range = parseDateRange(value, year);
  return range ? range.date : null;
}

function parseDateRange(value, year) {
  const matches = [...String(value).matchAll(new RegExp(DATE_TOKEN.source, 'gi'))];
  if (matches.length === 0) return null;

  const startMonth = MONTHS[matches[0][2].toUpperCase()];
  const start = DateTime.fromObject({
    year,
    month: startMonth,
    day: Number(matches[0][1])
  }, { zone: 'Europe/Rome' });
  if (!start.isValid) return null;

  let end = start;
  if (matches[1]) {
    const endMonth = MONTHS[matches[1][2].toUpperCase()];
    const endYear = endMonth < startMonth ? year + 1 : year;
    const parsedEnd = DateTime.fromObject({
      year: endYear,
      month: endMonth,
      day: Number(matches[1][1])
    }, { zone: 'Europe/Rome' });
    if (parsedEnd.isValid) end = parsedEnd;
  }

  return { date: start.toISODate(), dateEnd: end.toISODate() };
}

function tripDays(date, dateEnd) {
  const start = DateTime.fromISO(date, { zone: 'Europe/Rome' });
  const end = DateTime.fromISO(dateEnd, { zone: 'Europe/Rome' });
  if (!start.isValid || !end.isValid) return 1;
  return Math.max(1, Math.round(end.diff(start, 'days').days) + 1);
}

function hoursFromToken(token) {
  const value = String(token).trim();
  const clock = value.match(/^(\d+)[.,](\d{2})$/);
  if (clock) {
    const minutes = Number(clock[2]);
    if (minutes < 60) return Number(clock[1]) + minutes / 60;
  }
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDurationHours(values) {
  const texts = Array.isArray(values) ? values : [values];
  for (const raw of texts) {
    const value = String(raw);
    if (!/\bore\b|\d\s*h\b/i.test(value)) continue;

    const withMinutes = value.match(/(\d+)\s*h\s*(\d+)/i);
    if (withMinutes) {
      return Number(withMinutes[1]) + Number(withMinutes[2]) / 60;
    }

    const range = value.match(/(\d+(?:[.,]\d+)?)\s*[/\u2013-]\s*(\d+(?:[.,]\d+)?)/);
    if (range) {
      const high = hoursFromToken(range[2]);
      if (high != null && high > 0) return high;
    }

    const clock = value.match(/(\d+[.,]\d{2})/);
    if (clock) {
      const hours = hoursFromToken(clock[1]);
      if (hours != null && hours > 0) return hours;
    }

    const simple = value.match(/(\d+(?:[.,]\d+)?)/);
    if (simple) {
      const hours = hoursFromToken(simple[1]);
      if (hours != null && hours > 0) return hours;
    }
  }
  return undefined;
}

function parseCostAmount(cost) {
  if (!cost || /vedi sito/i.test(String(cost))) return undefined;
  const match = String(cost).match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return undefined;
  const amount = Number(match[1].replace(',', '.'));
  return Number.isFinite(amount) ? amount : undefined;
}

function foldText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

function resolveRegion(...parts) {
  const haystack = foldText(parts.filter(Boolean).join(' '));
  const found = REGION_RULES.find((rule) => rule.tests.some((test) => test.test(haystack)));
  return found ? found.region : 'Altro';
}

function stableId(date, title, prefix = 'roma') {
  const hash = crypto.createHash('sha256').update(`${date}|${title}`).digest('hex').slice(0, 12);
  return `${prefix}-${hash}`;
}

function parseDistanceKm(details) {
  for (const value of details) {
    const match = String(value).match(/(\d+(?:[.,]\d+)?)\s*km\b/i);
    if (!match) continue;
    const km = Number(match[1].replace(',', '.'));
    if (Number.isFinite(km) && km > 0) return km;
  }
  return undefined;
}

const DATE_FRAGMENT = /(?:da\s+)?(?:lun|mar|mer|gio|ven|sab|dom)\s+\d{1,2}\s+(?:gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)/gi;

function classifyPrivateCar(transport) {
  if (!transport) return null;
  const folded = foldText(transport);
  const hasPrivateCar = /auto\s*privat|auto\s*propr|mezzi\s*propr|\bmacchina\b|\bautomobile\b|\bauto\b/.test(folded);
  if (hasPrivateCar) return true;
  if (/pullman|\bbus\b|autobus|pulmino|treno|\baereo\b|nave|traghetto|mezzi\s+pubblic/.test(folded)) {
    return false;
  }
  return null;
}

function parseTransport(value) {
  const transport = String(value || '')
    .replace(new RegExp(DATE_FRAGMENT.source, 'gi'), ' ')
    .replace(/\ba\s+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!transport) {
    return { transport: undefined, privateCar: null };
  }

  return { transport, privateCar: classifyPrivateCar(transport) };
}

function parseCaiRomaHtml(html, { now = DateTime.now() } = {}) {
  const $ = cheerio.load(html);
  const excursions = [];
  let currentYear = now.year;

  $('table').slice(0, 2).find('tr').each((_index, row) => {
    const cells = $(row).find('td, th');
    const firstCell = $(cells[0]).text().replace(/\s+/g, ' ').trim();
    const heading = firstCell.match(
      /^(GENNAIO|FEBBRAIO|MARZO|APRILE|MAGGIO|GIUGNO|LUGLIO|AGOSTO|SETTEMBRE|OTTOBRE|NOVEMBRE|DICEMBRE)\s+(\d{4})$/i
    );

    if (heading) {
      currentYear = Number(heading[2]);
      return;
    }
    if (cells.length < 5 || /Data\s*\/\s*Mezzo/i.test(firstCell)) return;

    const range = parseDateRange(firstCell, currentYear);
    if (!range) return;
    const { date, dateEnd } = range;

    const routeLines = cellLines($, cells[1]);
    if (routeLines.length === 0) return;

    const location = routeLines[0];
    const title = routeLines.slice(1).join(' — ') || location;
    const details = cellLines($, cells[2]);
    const linkValue = $(cells[1]).find('a').first().attr('href');
    const link = linkValue ? new URL(linkValue, CAI_ROMA_URL).href : CAI_ROMA_URL;
    const coords = getApproximateCoords(`${location} ${title}`);
    const distanceKm = parseDistanceKm(details);
    const durationHours = parseDurationHours(details);
    const cost = 'Vedi sito';
    const costAmount = parseCostAmount(cost);
    const { transport, privateCar } = parseTransport(firstCell);

    excursions.push({
      id: stableId(date, title),
      title,
      date,
      dateEnd,
      days: tripDays(date, dateEnd),
      category: details[0] || 'Escursionismo',
      link,
      organizer: 'CAI Roma',
      location,
      region: resolveRegion(location, title),
      lat: coords.lat,
      lng: coords.lng,
      cost,
      time: details.find((value) => /\bore\b/i.test(value)) || 'Vedi sito',
      ...(transport ? { transport } : {}),
      privateCar,
      ...(durationHours != null ? { durationHours } : {}),
      ...(distanceKm != null ? { distanceKm } : {}),
      ...(costAmount != null ? { costAmount } : {})
    });
  });

  const today = now.startOf('day').toISODate();
  return excursions
    .filter((excursion) => (excursion.dateEnd || excursion.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function envInteger(name, fallback) {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

async function scrapeCaiRoma({
  retries = envInteger('SCRAPE_RETRIES', DEFAULT_RETRIES),
  timeout = envInteger('SCRAPE_TIMEOUT_MS', DEFAULT_TIMEOUT_MS),
  now
} = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await axios.get(CAI_ROMA_URL, {
        timeout,
        responseType: 'text',
        validateStatus: (status) => status >= 200 && status < 300,
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'TrekkingLazioPortal/1.1 (+scheduled public-data refresh)'
        }
      });

      if (typeof response.data !== 'string' || response.data.length < 500) {
        throw new Error('CAI Roma returned an empty or invalid HTML document');
      }

      const excursions = parseCaiRomaHtml(response.data, { now });
      if (excursions.length === 0) {
        throw new Error('CAI Roma HTML contained no upcoming excursions');
      }
      return excursions;
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const delay = 500 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`CAI Roma scrape failed after ${retries + 1} attempts: ${lastError.message}`);
}

function getApproximateCoords(title) {
  const locations = [
    { name: 'Monti Lucretili', lat: 42.148, lng: 12.894 },
    { name: 'Sperlonga', lat: 41.258, lng: 13.433 },
    { name: 'Simbruini', lat: 41.934, lng: 13.235 },
    { name: 'Albani', lat: 41.723, lng: 12.705 },
    { name: 'Gran Sasso', lat: 42.482, lng: 13.565 },
    { name: 'Abruzzo', lat: 41.792, lng: 13.869 },
    { name: 'Tuscia', lat: 42.417, lng: 12.101 },
    { name: 'Sabatini', lat: 42.138, lng: 12.235 },
    { name: 'Cicolano', lat: 42.235, lng: 13.254 },
    { name: 'Reatini', lat: 42.483, lng: 12.984 },
    { name: 'Ernici', lat: 41.802, lng: 13.486 },
    { name: 'Lepini', lat: 41.566, lng: 13.067 },
    { name: 'Sora', lat: 41.716, lng: 13.612 }
  ];

  const found = locations.find((location) =>
    title.toLowerCase().includes(location.name.toLowerCase())
  );
  return found || { ...DEFAULT_COORDS };
}

module.exports = {
  CAI_ROMA_URL,
  DEFAULT_COORDS,
  getApproximateCoords,
  parseCaiRomaHtml,
  parseCostAmount,
  parseDate,
  parseDateRange,
  parseDistanceKm,
  parseDurationHours,
  parseTransport,
  classifyPrivateCar,
  resolveRegion,
  scrapeCaiRoma,
  stableId,
  tripDays
};
