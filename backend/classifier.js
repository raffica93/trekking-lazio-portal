const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DEFAULT_COORDS } = require('./scraper');

const XAI_URL = 'https://api.x.ai/v1/responses';
const DEFAULT_MODEL = 'grok-4.6';
const USABLE_QUALITY = new Set(['peak', 'trailhead', 'massif']);
const ENRICHMENT_KEYS = [
  'mountainGroup',
  'region',
  'startPlace',
  'elevationM',
  'distanceKm',
  'durationHours',
  'coordinatesQuality',
  'summary',
  'activityType',
  'terrain',
  'difficultyNote'
];

const ENRICHMENT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'lat',
    'lng',
    'mountainGroup',
    'region',
    'startPlace',
    'elevationM',
    'distanceKm',
    'durationHours',
    'coordinatesQuality',
    'summary',
    'activityType',
    'terrain',
    'difficultyNote'
  ],
  properties: {
    lat: { type: 'number', description: 'Latitude of the peak or trailhead' },
    lng: { type: 'number', description: 'Longitude of the peak or trailhead' },
    mountainGroup: { type: 'string', description: 'Mountain group or area name' },
    region: { type: 'string', description: 'Administrative region or country' },
    startPlace: { type: 'string', description: 'Trailhead or meeting place if known' },
    elevationM: { type: ['number', 'null'], description: 'Summit elevation in metres, or null' },
    distanceKm: { type: ['number', 'null'], description: 'Route length in km, or null if unknown' },
    durationHours: { type: ['number', 'null'], description: 'Walking time in hours, or null if unknown' },
    coordinatesQuality: {
      type: 'string',
      enum: ['peak', 'trailhead', 'massif', 'region', 'unknown']
    },
    summary: { type: 'string', description: '1-2 factual Italian sentences' },
    activityType: {
      type: 'string',
      enum: ['escursione', 'ferrata', 'settimana', 'viaggio', 'altro']
    },
    terrain: { type: 'string', description: 'Short terrain label, e.g. anello, cresta, costa' },
    difficultyNote: {
      type: 'string',
      description: 'What the CAI difficulty letter implies; do not replace the official grade'
    }
  }
};

const SYSTEM_PROMPT = `Sei un classificatore di escursioni CAI.
Ti viene data una riga del calendario CAI Roma. Completala con dati fattuali e una breve interpretazione.

Usa web_search per verificare il toponimo reale (cima, rifugio o punto di partenza) e le coordinate.
Non usare il centroide di un gruppo montuoso se puoi geolocalizzare la cima o la partenza.
Non inventare quota, km o durata: se non li trovi con ragionevole certezza, metti null.
Non cambiare la difficoltà CAI ufficiale; in difficultyNote spiega cosa implica per un escursionista.
summary: 1-2 frasi in italiano, fattuali, senza promozioni.
coordinatesQuality:
- peak: coordinate della cima principale
- trailhead: punto di partenza
- massif: centro approssimato del gruppo montuoso
- region: solo regione o provincia
- unknown: non trovato`;

function cacheKey(excursion) {
  return `${excursion.id}|${excursion.title}|${excursion.date}|${excursion.location}`;
}

function isEnriched(excursion) {
  return Boolean(excursion && excursion.summary && excursion.coordinatesQuality);
}

function isReusableEnrichment(scraped, existing) {
  return Boolean(
    existing
    && isEnriched(existing)
    && cacheKey(scraped) === cacheKey(existing)
  );
}

function looksLikeRome(excursion) {
  return /\brom[ae]\b/i.test(`${excursion.location || ''} ${excursion.title || ''}`);
}

function nearlyEqual(a, b, epsilon = 0.0008) {
  return Math.abs(a - b) <= epsilon;
}

function isRomeFallback(lat, lng) {
  return nearlyEqual(lat, DEFAULT_COORDS.lat) && nearlyEqual(lng, DEFAULT_COORDS.lng);
}

function areCoordsUsable(enrichment, excursion) {
  const lat = enrichment?.lat;
  const lng = enrichment?.lng;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  if (lat === 0 && lng === 0) return false;
  if (!USABLE_QUALITY.has(enrichment.coordinatesQuality)) return false;
  if (isRomeFallback(lat, lng) && !looksLikeRome(excursion)) return false;
  return true;
}

function pickEnrichment(from = {}) {
  const picked = {};
  for (const key of ENRICHMENT_KEYS) {
    if (from[key] !== undefined) picked[key] = from[key];
  }
  return picked;
}

function mergeEnrichment(scraped, enrichment = {}) {
  const merged = {
    ...scraped,
    ...pickEnrichment(enrichment)
  };

  merged.id = scraped.id;
  merged.title = scraped.title;
  merged.date = scraped.date;
  merged.category = scraped.category;
  merged.link = scraped.link;
  merged.organizer = scraped.organizer;
  merged.location = scraped.location;
  merged.cost = scraped.cost;
  merged.time = scraped.time;

  if (areCoordsUsable(enrichment, scraped)) {
    merged.lat = enrichment.lat;
    merged.lng = enrichment.lng;
  } else {
    merged.lat = scraped.lat;
    merged.lng = scraped.lng;
  }

  if (scraped.distanceKm != null) {
    merged.distanceKm = scraped.distanceKm;
  } else if (enrichment.distanceKm != null) {
    merged.distanceKm = enrichment.distanceKm;
  }

  if (scraped.durationHours != null) {
    merged.durationHours = scraped.durationHours;
  } else if (enrichment.durationHours != null) {
    merged.durationHours = enrichment.durationHours;
  }

  if (scraped.region && scraped.region !== 'Altro') {
    merged.region = scraped.region;
  } else if (enrichment.region) {
    merged.region = enrichment.region;
  }

  if (scraped.dateEnd) merged.dateEnd = scraped.dateEnd;
  if (scraped.days != null) merged.days = scraped.days;
  if (scraped.costAmount != null) merged.costAmount = scraped.costAmount;
  if (scraped.transport) merged.transport = scraped.transport;
  if (scraped.privateCar === true || scraped.privateCar === false || scraped.privateCar === null) {
    merged.privateCar = scraped.privateCar;
  }

  return merged;
}

function userPrompt(excursion) {
  return [
    'Classifica e completa questa escursione CAI Roma.',
    'Restituisci solo i campi dello schema.',
    JSON.stringify({
      id: excursion.id,
      title: excursion.title,
      date: excursion.date,
      category: excursion.category,
      location: excursion.location,
      link: excursion.link,
      time: excursion.time,
      distanceKm: excursion.distanceKm ?? null
    })
  ].join('\n');
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text;
  }

  const message = (payload?.output || []).find((item) => item.type === 'message');
  const textPart = message?.content?.find((part) => part.type === 'output_text' || part.type === 'text');
  const text = textPart?.text || textPart?.content;
  if (typeof text === 'string' && text.trim()) return text;

  throw new Error('Grok response contained no output text');
}

function parseEnrichmentJson(raw) {
  const trimmed = String(raw).trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  const parsed = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Grok enrichment is not a JSON object');
  }
  return parsed;
}

function resolveApiKey({
  env = process.env,
  grokHome,
  readFileSync = fs.readFileSync,
  now = Date.now()
} = {}) {
  if (env.XAI_API_KEY) return env.XAI_API_KEY;

  const home = grokHome || env.GROK_HOME || path.join(os.homedir(), '.grok');
  try {
    const auth = JSON.parse(readFileSync(path.join(home, 'auth.json'), 'utf8'));
    const records = Object.values(auth || {}).filter((record) => record && record.key);
    const fresh = records.find((record) => !record.expires_at || Date.parse(record.expires_at) > now);
    return (fresh || records[0] || {}).key || null;
  } catch {
    return null;
  }
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500;
}

async function classifyOne(excursion, options = {}) {
  const apiKey = options.apiKey || resolveApiKey({ env: process.env, grokHome: options.grokHome });
  if (!apiKey) {
    throw new Error('XAI_API_KEY is required (or a Grok CLI login in ~/.grok/auth.json)');
  }

  const model = options.model || process.env.XAI_MODEL || DEFAULT_MODEL;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const sleep = options.sleep || defaultSleep;
  const timeoutMs = options.timeoutMs ?? Number(process.env.XAI_TIMEOUT_MS || 120_000);
  const retries = options.retries ?? 2;

  if (typeof fetchImpl !== 'function') {
    throw new Error('fetch is not available');
  }

  const requestBody = {
    model,
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt(excursion) }
    ],
    tools: [{ type: 'web_search' }],
    text: {
      format: {
        type: 'json_schema',
        name: 'excursion_enrichment',
        schema: ENRICHMENT_SCHEMA,
        strict: true
      }
    }
  };

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
      return parseEnrichmentJson(extractOutputText(payload));
    } catch (error) {
      lastError = error;
      const retryable = error.status ? isRetryableStatus(error.status) : error.name === 'TimeoutError';
      if (attempt === retries || !retryable) throw error;
      await sleep(500 * 2 ** attempt);
    }
  }

  throw lastError;
}

async function enrichExcursions(excursions, existingList = [], options = {}) {
  const existingById = new Map((existingList || []).map((item) => [item.id, item]));
  const concurrency = Math.max(1, Number(options.concurrency || process.env.GROK_CONCURRENCY || 2));
  const classify = options.classify || classifyOne;
  const results = new Array(excursions.length);
  const queue = [];
  let reused = 0;

  for (let index = 0; index < excursions.length; index += 1) {
    const scraped = excursions[index];
    const existing = existingById.get(scraped.id);
    if (isReusableEnrichment(scraped, existing)) {
      results[index] = mergeEnrichment(scraped, existing);
      reused += 1;
    } else {
      queue.push(index);
    }
  }

  if (options.id) {
    const skipped = queue.filter((index) => excursions[index].id !== options.id);
    for (const index of skipped) {
      results[index] = { ...excursions[index] };
    }
    const only = queue.filter((index) => excursions[index].id === options.id);
    queue.length = 0;
    queue.push(...only);
  }

  if (options.limit != null && Number.isFinite(Number(options.limit))) {
    const extra = queue.splice(Math.max(0, Number(options.limit)));
    for (const index of extra) {
      results[index] = { ...excursions[index] };
    }
  }

  let cursor = 0;
  let classified = 0;
  let failed = 0;

  async function worker() {
    while (cursor < queue.length) {
      const index = queue[cursor];
      cursor += 1;
      const scraped = excursions[index];
      try {
        const enrichment = await classify(scraped, options);
        results[index] = mergeEnrichment(scraped, enrichment);
        classified += 1;
      } catch (error) {
        failed += 1;
        console.error(`classify failed for ${scraped.id}: ${error.message}`);
        results[index] = { ...scraped };
      }
    }
  }

  const workerCount = Math.min(concurrency, queue.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return {
    excursions: results,
    classified,
    failed,
    reused,
    queued: queue.length
  };
}

module.exports = {
  DEFAULT_MODEL,
  ENRICHMENT_SCHEMA,
  SYSTEM_PROMPT,
  XAI_URL,
  areCoordsUsable,
  cacheKey,
  classifyOne,
  enrichExcursions,
  extractOutputText,
  isReusableEnrichment,
  mergeEnrichment,
  parseEnrichmentJson,
  pickEnrichment,
  resolveApiKey,
  userPrompt
};
