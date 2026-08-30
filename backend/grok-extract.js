const crypto = require('node:crypto');
const axios = require('axios');
const cheerio = require('cheerio');
const { DateTime } = require('luxon');
const {
  DEFAULT_MODEL,
  XAI_URL,
  extractOutputText,
  parseEnrichmentJson,
  resolveApiKey
} = require('./classifier');
const {
  getApproximateCoords,
  parseTransport,
  resolveRegion,
  stableId,
  tripDays
} = require('./scraper');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_HTML_CHARS = 80_000;

const EXTRACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['excursions'],
  properties: {
    excursions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'title',
          'date',
          'dateEnd',
          'category',
          'location',
          'link',
          'time',
          'transport',
          'distanceKm',
          'durationHours'
        ],
        properties: {
          title: { type: 'string', description: 'Outing title, without the mountain-group heading if separate' },
          date: { type: 'string', description: 'Start date YYYY-MM-DD' },
          dateEnd: { type: ['string', 'null'], description: 'End date YYYY-MM-DD, or null if one day' },
          category: { type: 'string', description: 'Official CAI grade, e.g. T, E, EE, EEA, EAI' },
          location: { type: 'string', description: 'Mountain group or area' },
          link: { type: ['string', 'null'], description: 'Event page URL if present' },
          time: { type: ['string', 'null'], description: 'Duration as printed, e.g. 6 ore' },
          transport: { type: ['string', 'null'], description: 'Means of travel if printed' },
          distanceKm: { type: ['number', 'null'] },
          durationHours: { type: ['number', 'null'] }
        }
      }
    }
  }
};

const SYSTEM_PROMPT = `Sei un estrattore di calendari escursionistici CAI.
Dal documento o dalla pagina ti viene chiesto di elencare SOLO le uscite future di escursionismo, alpinismo, ferrata, ciaspole o trekking.

Includi: gite di un giorno, weekend, settimane in montagna, intersezionali.
Escludi: assemblee, corsi in sede, aperture del muro, serate, feste sociali senza cammino, manutenzioni sentieri senza itinerario.

Regole:
- date in YYYY-MM-DD, anno dal programma (non inventare l'anno).
- category: grado CAI stampato (T, E, EE, EEA, EAI, BC, …). Se manca usa "Escursionismo".
- location: gruppo montuoso o zona, non l'intera descrizione.
- Non inventare km, ore, date o link. Se non c'è, null.
- link: URL della locandina o della scheda se presente nel documento; altrimenti null.
- Ignora uscite già concluse rispetto a oggi.`;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function htmlToText(html) {
  const $ = cheerio.load(String(html || ''));
  $('script, style, noscript, svg, iframe').remove();
  $('br').replaceWith('\n');
  $('p, tr, li, h1, h2, h3, h4, h5, article, section, div').each((_index, element) => {
    $(element).append('\n');
  });
  return $.root().text()
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function sourceHost(source) {
  try {
    return new URL(source.url).hostname;
  } catch {
    return null;
  }
}

function isIsoDate(value) {
  return ISO_DATE.test(String(value || '')) && DateTime.fromISO(String(value), { zone: 'Europe/Rome' }).isValid;
}

function normalizeExtracted(raw, source, { now = DateTime.now() } = {}) {
  if (!raw || typeof raw !== 'object') return null;
  const title = String(raw.title || '').replace(/\s+/g, ' ').trim();
  if (!title) return null;
  if (!isIsoDate(raw.date)) return null;

  const date = raw.date;
  const dateEnd = isIsoDate(raw.dateEnd) ? raw.dateEnd : date;
  if (dateEnd < date) return null;

  const today = now.startOf('day').toISODate();
  if (dateEnd < today) return null;

  const location = String(raw.location || '').replace(/\s+/g, ' ').trim() || source.organizer;
  const category = String(raw.category || '').replace(/\s+/g, ' ').trim() || 'Escursionismo';
  const linkValue = raw.link ? String(raw.link).trim() : '';
  let link = source.url;
  if (linkValue) {
    try {
      link = new URL(linkValue, source.url).href;
    } catch {
      link = source.url;
    }
  }

  const coords = getApproximateCoords(`${location} ${title}`);
  const { transport, privateCar } = parseTransport(raw.transport || '');
  const distanceKm = Number.isFinite(raw.distanceKm) && raw.distanceKm > 0 ? raw.distanceKm : undefined;
  const durationHours = Number.isFinite(raw.durationHours) && raw.durationHours > 0
    ? raw.durationHours
    : undefined;
  const time = String(raw.time || '').replace(/\s+/g, ' ').trim() || 'Vedi sito';

  return {
    id: stableId(date, title, source.id),
    title,
    date,
    dateEnd,
    days: tripDays(date, dateEnd),
    category,
    link,
    organizer: source.organizer,
    location,
    region: resolveRegion(location, title),
    lat: coords.lat,
    lng: coords.lng,
    cost: 'Vedi sito',
    time,
    ...(transport ? { transport } : {}),
    privateCar,
    ...(durationHours != null ? { durationHours } : {}),
    ...(distanceKm != null ? { distanceKm } : {})
  };
}

function userPrompt(source, document, { now = DateTime.now() } = {}) {
  const today = now.startOf('day').toISODate();
  const lines = [
    `Estrai le prossime uscite di ${source.organizer}.`,
    `Oggi è ${today} (Europe/Rome). Includi solo uscite con data di fine >= oggi.`,
    `Pagina o file ufficiale: ${source.url}`,
    'Restituisci solo lo schema JSON.'
  ];

  if (document?.kind === 'pdf') {
    lines.push('', 'Il programma è nel PDF allegato. Leggi tutto il calendario.');
  } else if (document?.text) {
    const text = document.text.length > MAX_HTML_CHARS
      ? `${document.text.slice(0, MAX_HTML_CHARS)}\n[troncato]`
      : document.text;
    lines.push('', 'Testo della pagina:', text);
  }

  if (source.kind === 'discover') {
    lines.push('', 'Se il testo non basta, cerca nel sito della sezione il calendario o il programma attività più recente.');
  }

  return lines.join('\n');
}

function buildRequestBody(source, document, { model, now } = {}) {
  const host = sourceHost(source);
  const content = [{ type: 'input_text', text: userPrompt(source, document, { now }) }];
  if (document?.kind === 'pdf' && (document.fileUrl || source.url)) {
    content.push({ type: 'input_file', file_url: document.fileUrl || source.url });
  }

  const body = {
    model: model || process.env.XAI_MODEL || DEFAULT_MODEL,
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'cai_calendar_extract',
        schema: EXTRACT_SCHEMA,
        strict: true
      }
    }
  };

  if (source.kind === 'discover' && host) {
    body.tools = [{ type: 'web_search', filters: { allowed_domains: [host] } }];
  }

  return body;
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500;
}

async function extractFromSource(source, document, options = {}) {
  const apiKey = options.apiKey || resolveApiKey({ env: process.env, grokHome: options.grokHome });
  if (!apiKey) {
    throw new Error('XAI_API_KEY is required (or a Grok CLI login in ~/.grok/auth.json)');
  }

  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const sleep = options.sleep || defaultSleep;
  const timeoutMs = options.timeoutMs ?? Number(process.env.XAI_TIMEOUT_MS || 120_000);
  const retries = options.retries ?? 2;
  const now = options.now;

  if (typeof fetchImpl !== 'function') {
    throw new Error('fetch is not available');
  }

  const requestBody = buildRequestBody(source, document, {
    model: options.model,
    now
  });

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl(XAI_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(timeoutMs)
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        const error = new Error(`Grok API ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
        error.status = response.status;
        if (isRetryableStatus(response.status) && attempt < retries) {
          lastError = error;
          await sleep(500 * 2 ** attempt);
          continue;
        }
        throw error;
      }

      const payload = await response.json();
      const parsed = parseEnrichmentJson(extractOutputText(payload));
      const rows = Array.isArray(parsed.excursions) ? parsed.excursions : [];
      const excursions = rows
        .map((row) => normalizeExtracted(row, source, { now }))
        .filter(Boolean)
        .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'it'));

      if (excursions.length === 0) {
        throw new Error(`${source.organizer} extract contained no upcoming excursions`);
      }
      return excursions;
    } catch (error) {
      lastError = error;
      const retryable = error.status ? isRetryableStatus(error.status) : error.name === 'TimeoutError';
      if (attempt === retries || !retryable) throw error;
      await sleep(500 * 2 ** attempt);
    }
  }

  throw lastError;
}

async function fetchDocument(source, {
  axiosImpl = axios,
  timeout = Number(process.env.SCRAPE_TIMEOUT_MS || 20_000)
} = {}) {
  const responseType = source.kind === 'pdf' ? 'arraybuffer' : 'text';
  const response = await axiosImpl.get(source.url, {
    timeout,
    responseType,
    validateStatus: (status) => status >= 200 && status < 300,
    headers: {
      Accept: source.kind === 'pdf' ? 'application/pdf,application/octet-stream' : 'text/html,application/xhtml+xml',
      'User-Agent': 'TrekkingLazioPortal/1.1 (+scheduled public-data refresh)'
    }
  });

  if (source.kind === 'pdf') {
    const bytes = Buffer.from(response.data);
    if (bytes.length < 100) {
      throw new Error(`${source.organizer} returned an empty PDF`);
    }
    return {
      kind: 'pdf',
      bytes,
      hash: sha256(bytes),
      fileUrl: source.url
    };
  }

  const html = String(response.data || '');
  if (html.length < 200) {
    throw new Error(`${source.organizer} returned an empty or invalid HTML document`);
  }
  const text = htmlToText(html);
  return {
    kind: source.kind === 'discover' ? 'discover' : 'html',
    html,
    text,
    hash: sha256(text)
  };
}

module.exports = {
  EXTRACT_SCHEMA,
  SYSTEM_PROMPT,
  buildRequestBody,
  extractFromSource,
  fetchDocument,
  htmlToText,
  normalizeExtracted,
  sha256,
  userPrompt
};
