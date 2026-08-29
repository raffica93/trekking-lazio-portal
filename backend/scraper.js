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

function parseDate(value, year) {
  const match = value.match(
    /(?:da\s+)?(?:lun|mar|mer|gio|ven|sab|dom)\s+(\d{1,2})\s+(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)/i
  );
  if (!match) return null;

  const date = DateTime.fromObject({
    year,
    month: MONTHS[match[2].toUpperCase()],
    day: Number(match[1])
  });
  return date.isValid ? date.toISODate() : null;
}

function stableId(date, title) {
  const hash = crypto.createHash('sha256').update(`${date}|${title}`).digest('hex').slice(0, 12);
  return `roma-${hash}`;
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

    const date = parseDate(firstCell, currentYear);
    if (!date) return;

    const routeLines = cellLines($, cells[1]);
    if (routeLines.length === 0) return;

    const location = routeLines[0];
    const title = routeLines.slice(1).join(' — ') || location;
    const details = cellLines($, cells[2]);
    const linkValue = $(cells[1]).find('a').first().attr('href');
    const link = linkValue ? new URL(linkValue, CAI_ROMA_URL).href : CAI_ROMA_URL;
    const coords = getApproximateCoords(`${location} ${title}`);
    const distanceKm = parseDistanceKm(details);

    excursions.push({
      id: stableId(date, title),
      title,
      date,
      category: details[0] || 'Escursionismo',
      link,
      organizer: 'CAI Roma',
      location,
      lat: coords.lat,
      lng: coords.lng,
      cost: 'Vedi sito',
      time: details.find((value) => /\bore\b/i.test(value)) || 'Vedi sito',
      ...(distanceKm != null ? { distanceKm } : {})
    });
  });

  const today = now.startOf('day').toISODate();
  return excursions
    .filter((excursion) => excursion.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function scrapeCaiRoma({ retries = DEFAULT_RETRIES, timeout = DEFAULT_TIMEOUT_MS, now } = {}) {
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
  parseCaiRomaHtml,
  parseDistanceKm,
  scrapeCaiRoma
};
