const crypto = require('node:crypto');
const axios = require('axios');
const cheerio = require('cheerio');
const { DateTime } = require('luxon');
const { parseEnrichmentJson } = require('./classifier');
const {
  getApproximateCoords,
  hasFiniteCoords,
  parseTransport,
  resolveRegion,
  stableId,
  tripDays
} = require('./scraper');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_HTML_CHARS = 80_000;
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash';

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
    ...(hasFiniteCoords(coords) ? { lat: coords.lat, lng: coords.lng } : {}),
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

  if (source.template === 'facebook' || isFacebookUrl(source.url)) {
    lines.push(
      '',
      `La sezione pubblica le uscite sulla pagina Facebook ${source.url}.`,
      'Cerca i post e gli eventi futuri di escursionismo. Ignora login, cookie banner e uscite già concluse.'
    );
  } else if (source.kind === 'discover') {
    lines.push('', 'Se il testo non basta, cerca nel sito della sezione il calendario o il programma attività più recente.');
  }

  return lines.join('\n');
}

function isFacebookUrl(value) {
  try {
    const host = new URL(String(value || '')).hostname.replace(/^www\./i, '');
    return host === 'facebook.com' || host === 'fb.com' || host.endsWith('.facebook.com');
  } catch {
    return false;
  }
}

function geminiEndpoint(model) {
  const name = model || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(name)}:generateContent`;
}

function resolveGeminiKey({ env = process.env } = {}) {
  const value = env.GEMINI_KEY || env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function geminiType(jsonType) {
  const types = {
    object: 'OBJECT',
    array: 'ARRAY',
    string: 'STRING',
    number: 'NUMBER',
    integer: 'INTEGER',
    boolean: 'BOOLEAN'
  };
  return types[jsonType] || jsonType;
}

function geminiSchema(value) {
  if (Array.isArray(value)) return value.map(geminiSchema);
  if (!value || typeof value !== 'object') return value;

  const copy = {};
  let nullable = false;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'additionalProperties') continue;
    if (key === 'type') {
      const types = Array.isArray(child) ? child : [child];
      nullable = types.includes('null');
      copy.type = geminiType(types.find((item) => item !== 'null') || 'string');
      continue;
    }
    copy[key] = geminiSchema(child);
  }
  if (nullable) copy.nullable = true;
  return copy;
}

function buildRequestBody(source, document, { now } = {}) {
  const parts = [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt(source, document, { now })}` }];
  if (document?.kind === 'pdf' && document.bytes) {
    parts.push({
      inline_data: {
        mime_type: 'application/pdf',
        data: Buffer.from(document.bytes).toString('base64')
      }
    });
  }

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: geminiSchema(EXTRACT_SCHEMA)
    }
  };

  if (source.kind === 'discover') {
    body.tools = [{ googleSearch: {} }];
  }

  return body;
}

function extractGeminiText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((part) => part.text).filter(Boolean).join('\n').trim();
  if (text) return text;
  throw new Error('Gemini response contained no output text');
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500;
}

function parseRetryAfterMs(headers, body) {
  const header = typeof headers?.get === 'function'
    ? headers.get('retry-after')
    : headers?.['retry-after'] || headers?.['Retry-After'];
  if (header && /^\d+(\.\d+)?$/.test(String(header).trim())) {
    return Math.ceil(Number(header) * 1000);
  }
  const delay = String(body || '').match(/"retryDelay"\s*:\s*"([\d.]+)s"/i);
  if (delay) return Math.ceil(Number(delay[1]) * 1000);
  return null;
}

function classifyGeminiError(status, body = '', headers = null) {
  const text = String(body || '');
  if (status === 429) {
    const quota = /exceeded your current quota|check your plan and billing|quota exceeded/i.test(text);
    return {
      kind: quota ? 'quota' : 'rate_limit',
      retryAfterMs: quota ? null : (parseRetryAfterMs(headers, text) || 8_000)
    };
  }
  if (status === 503 || (status >= 500 && status < 600)) {
    return {
      kind: 'unavailable',
      retryAfterMs: parseRetryAfterMs(headers, text) || 4_000
    };
  }
  return { kind: 'error', retryAfterMs: null };
}

function isGeminiQuotaError(error) {
  if (!error) return false;
  if (error.kind === 'quota') return true;
  return /exceeded your current quota|check your plan and billing|quota exceeded/i.test(String(error.message || ''));
}

let quotaExhaustedFlag = false;

function markGeminiQuotaExhausted(env = process.env) {
  quotaExhaustedFlag = true;
  env.GEMINI_QUOTA_EXHAUSTED = '1';
}

function geminiQuotaExhausted(env = process.env) {
  return quotaExhaustedFlag
    || env.GEMINI_QUOTA_EXHAUSTED === '1'
    || env.GEMINI_QUOTA_EXHAUSTED === 'true';
}

function resetGeminiQuotaExhausted(env = process.env) {
  quotaExhaustedFlag = false;
  delete env.GEMINI_QUOTA_EXHAUSTED;
}

function capDelay(ms) {
  return Math.min(Math.max(Number(ms) || 0, 0), 60_000);
}

async function extractFromSource(source, document, options = {}) {
  const apiKey = options.apiKey || resolveGeminiKey({ env: options.env || process.env });
  if (!apiKey) {
    throw new Error('GEMINI_KEY is required. Set the GitHub secret GEMINI_KEY or a local backend/.env value.');
  }

  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const sleep = options.sleep || defaultSleep;
  const timeoutMs = options.timeoutMs ?? Number(process.env.GEMINI_TIMEOUT_MS || process.env.XAI_TIMEOUT_MS || 300_000);
  const retries = options.retries ?? 2;
  const now = options.now;

  if (typeof fetchImpl !== 'function') {
    throw new Error('fetch is not available');
  }

  const requestBody = buildRequestBody(source, document, { now });
  const endpoint = geminiEndpoint(options.model);

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(timeoutMs)
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        const classified = classifyGeminiError(response.status, detail, response.headers);
        const error = new Error(`Gemini API ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
        error.status = response.status;
        error.kind = classified.kind;
        error.retryAfterMs = classified.retryAfterMs;
        if (classified.kind === 'quota') {
          markGeminiQuotaExhausted(options.env || process.env);
          throw error;
        }
        if (classified.kind !== 'error' && attempt < retries) {
          lastError = error;
          await sleep(capDelay((classified.retryAfterMs || 1000) * 2 ** attempt));
          continue;
        }
        throw error;
      }

      const payload = await response.json();
      const parsed = parseEnrichmentJson(extractGeminiText(payload));
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
      if (isGeminiQuotaError(error)) {
        markGeminiQuotaExhausted(options.env || process.env);
        throw error;
      }
      const retryable = error.kind === 'rate_limit' || error.kind === 'unavailable'
        || (error.status ? isRetryableStatus(error.status) : error.name === 'TimeoutError');
      if (attempt === retries || !retryable) throw error;
      await sleep(capDelay((error.retryAfterMs || 1000) * 2 ** attempt));
    }
  }

  throw lastError;
}

async function fetchDocument(source, {
  axiosImpl = axios,
  timeout = Number(process.env.SCRAPE_TIMEOUT_MS || 20_000)
} = {}) {
  if (source.template === 'facebook' || isFacebookUrl(source.url)) {
    throw new Error(`${source.organizer} publishes on Facebook; skipping HTML fetch`);
  }

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
  DEFAULT_GEMINI_MODEL,
  EXTRACT_SCHEMA,
  SYSTEM_PROMPT,
  buildRequestBody,
  extractFromSource,
  extractGeminiText,
  fetchDocument,
  geminiEndpoint,
  geminiQuotaExhausted,
  classifyGeminiError,
  htmlToText,
  isFacebookUrl,
  isGeminiQuotaError,
  markGeminiQuotaExhausted,
  resetGeminiQuotaExhausted,
  normalizeExtracted,
  resolveGeminiKey,
  sha256,
  userPrompt
};
