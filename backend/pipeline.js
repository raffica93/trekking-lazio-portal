const { DateTime } = require('luxon');
const { isReusableEnrichment, mergeEnrichment } = require('./classifier');
const { scrapeCaiRoma } = require('./scraper');
const {
  extractFromSource,
  fetchDocument,
  geminiQuotaExhausted,
  isGeminiQuotaError,
  markGeminiQuotaExhausted,
  resolveGeminiKey
} = require('./grok-extract');
const { SOURCES, enabledSources, isCheerioSource, sourceMeta } = require('./sources');

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function belongingTo(source, excursion) {
  return Boolean(excursion?.id?.startsWith(`${source.id}-`));
}

function cachedOrEmpty(existing, source) {
  return existing.filter((item) => belongingTo(source, item));
}

function preserveEnrichment(scrapedList, existingList = []) {
  const existingById = new Map((existingList || []).map((item) => [item.id, item]));
  return scrapedList.map((scraped) => {
    const existing = existingById.get(scraped.id);
    if (isReusableEnrichment(scraped, existing)) {
      return mergeEnrichment(scraped, existing);
    }
    return scraped;
  });
}

function sortExcursions(excursions) {
  return [...excursions].sort((a, b) => (
    a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'it')
  ));
}

function parseScrapeArgs(argv) {
  const args = { dryRun: false, sources: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--dry-run') {
      args.dryRun = true;
    } else if (token === '--source') {
      args.sources.push(String(argv[index + 1] || '').trim());
      index += 1;
    } else if (token.startsWith('--source=')) {
      args.sources.push(...token.slice('--source='.length).split(',').map((value) => value.trim()));
    } else if (token === '--help' || token === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  args.sources = args.sources.filter(Boolean);
  return args;
}

function selectSources(allSources, ids) {
  if (!ids || ids.length === 0) {
    return enabledSources(allSources);
  }
  return ids.map((id) => {
    const source = allSources.find((item) => item.id === id);
    if (!source) throw new Error(`Unknown source: ${id}`);
    return source;
  });
}

function mergeSourceMeta(previous, selected) {
  const byId = new Map((Array.isArray(previous) ? previous : []).map((item) => [item.id, item]));
  for (const source of selected) {
    byId.set(source.id, sourceMeta(source));
  }
  return [...byId.values()];
}

async function scrapeSource(source, {
  existing = [],
  hashes = {},
  now,
  apiKey,
  scrapeRoma = scrapeCaiRoma,
  extract = extractFromSource,
  fetchDoc = fetchDocument,
  log = console
} = {}) {
  const cached = existing.filter((item) => belongingTo(source, item));

  if (isCheerioSource(source)) {
    const excursions = preserveEnrichment(await scrapeRoma({ now }), existing);
    return { status: 'ok', source, excursions, hash: null };
  }

  if (geminiQuotaExhausted()) {
    if (cached.length > 0) {
      log.log(`Skipping ${source.id}: Gemini quota exhausted, keeping ${cached.length} cached excursions`);
      return { status: 'skipped', source, excursions: cached, hash: hashes[source.id] || null };
    }
    log.log(`Skipping ${source.id}: Gemini quota exhausted`);
    return { status: 'skipped', source, excursions: [], hash: hashes[source.id] || null };
  }

  if (!apiKey) {
    if (cached.length > 0) {
      log.log(`Skipping ${source.id}: no GEMINI_KEY, keeping ${cached.length} cached excursions`);
      return { status: 'skipped', source, excursions: cached, hash: hashes[source.id] || null };
    }
    throw new Error(`GEMINI_KEY is required to scrape ${source.organizer}`);
  }

  let document;
  try {
    document = await fetchDoc(source);
  } catch (error) {
    if (source.kind !== 'discover') throw error;
    log.log(`${source.id}: homepage fetch failed, trying Gemini search (${error.message})`);
    document = { kind: 'discover', text: '', hash: null };
  }

  if (document.hash && hashes[source.id] === document.hash && cached.length > 0) {
    log.log(`No document changes for ${source.id}: keeping ${cached.length} excursions`);
    return { status: 'reused', source, excursions: cached, hash: document.hash };
  }

  const extracted = await extract(source, document, { apiKey, now });
  return {
    status: 'ok',
    source,
    excursions: preserveEnrichment(extracted, existing),
    hash: document.hash
  };
}

async function scrapeAll({
  sources = SOURCES,
  existingPayload = {},
  sourceIds,
  now = DateTime.now(),
  apiKey,
  scrapeRoma,
  extract,
  fetchDoc,
  log = console,
  sleep = defaultSleep
} = {}) {
  const selected = selectSources(sources, sourceIds);
  const existing = Array.isArray(existingPayload.excursions) ? existingPayload.excursions : [];
  const hashes = existingPayload.sourceHashes && typeof existingPayload.sourceHashes === 'object'
    ? { ...existingPayload.sourceHashes }
    : {};

  const resolvedKey = apiKey === undefined
    ? resolveGeminiKey({ env: process.env })
    : apiKey;

  if (selected.some((source) => !isCheerioSource(source))) {
    if (resolvedKey) {
      log.log('Using GEMINI_KEY with gemini-3.5-flash');
    } else {
      log.log(
        'No GEMINI_KEY: LLM sources will be skipped. '
        + 'Set the GitHub Actions secret GEMINI_KEY, or put it in backend/.env.'
      );
    }
  }

  const kept = sourceIds && sourceIds.length > 0
    ? existing.filter((item) => !selected.some((source) => belongingTo(source, item)))
    : [];

  const results = [];
  const nextHashes = sourceIds && sourceIds.length > 0 ? { ...hashes } : {};
  const failures = [];
  const pauseMs = Number(process.env.GEMINI_PAUSE_MS || 0);

  for (const source of selected) {
    try {
      const result = await scrapeSource(source, {
        existing,
        hashes,
        now,
        apiKey: resolvedKey,
        scrapeRoma,
        extract,
        fetchDoc,
        log
      });
      results.push(result);
      if (result.hash) nextHashes[source.id] = result.hash;
      log.log(`${source.id}: ${result.status} (${result.excursions.length} excursions)`);
      if (pauseMs > 0 && !isCheerioSource(source) && result.status === 'ok') {
        await sleep(pauseMs);
      }
    } catch (error) {
      if (isGeminiQuotaError(error)) markGeminiQuotaExhausted();
      failures.push({ source, error });
      const cached = cachedOrEmpty(existing, source);
      if (cached.length > 0) {
        results.push({ status: 'failed', source, excursions: cached, hash: hashes[source.id] || null });
        if (hashes[source.id]) nextHashes[source.id] = hashes[source.id];
        log.error(`${source.id} failed, keeping ${cached.length} cached: ${error.message}`);
      } else {
        log.error(`${source.id} failed with no cache: ${error.message}`);
      }
      if (pauseMs > 0 && !isGeminiQuotaError(error)) await sleep(pauseMs);
    }
  }

  const collected = sortExcursions([
    ...kept,
    ...results.flatMap((result) => result.excursions)
  ]);

  if (collected.length === 0) {
    const detail = failures.map((item) => `${item.source.id}: ${item.error.message}`).join('; ');
    throw new Error(detail || 'No excursion data available');
  }

  const hardFailures = failures.filter((item) => cachedOrEmpty(existing, item.source).length === 0);

  return {
    excursions: collected,
    sources: (sourceIds && sourceIds.length > 0
      ? mergeSourceMeta(existingPayload.sources, selected)
      : selected.map(sourceMeta)
    ),
    sourceHashes: nextHashes,
    failures,
    hardFailures,
    results
  };
}

function buildPayload(result, existingPayload = {}) {
  const sourceUrl = result.sources.map((item) => item.url).filter(Boolean).join(' ');
  return {
    source: sourceUrl || existingPayload.source,
    sources: result.sources,
    sourceHashes: result.sourceHashes,
    generatedAt: new Date().toISOString(),
    classifiedAt: existingPayload.classifiedAt,
    excursions: result.excursions
  };
}

module.exports = {
  belongingTo,
  buildPayload,
  parseScrapeArgs,
  preserveEnrichment,
  scrapeAll,
  scrapeSource,
  selectSources,
  sortExcursions
};
