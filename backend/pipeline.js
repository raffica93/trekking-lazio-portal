const { DateTime } = require('luxon');
const { isReusableEnrichment, mergeEnrichment } = require('./classifier');
const { applyApproximateCoords, scrapeCaiRoma } = require('./scraper');
const {
  extractFromSource,
  fetchDocument,
  geminiQuotaExhausted,
  isGeminiQuotaError,
  markGeminiQuotaExhausted,
  resolveGeminiKey
} = require('./grok-extract');
const { SOURCES, enabledSources, isCheerioSource, sourceMeta } = require('./sources');
const { monthFloor } = require('./adapters/deterministic');
const { runSourceProcess } = require('./adapters/process-runner');

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function belongingTo(source, excursion) {
  return excursion?.sourceId ? excursion.sourceId === source.id : Boolean(excursion?.id?.startsWith(`${source.id}-`));
}

function usesGeminiExtractor(source) {
  return source?.extractor === 'gemini';
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
    } else if (token === '--all') {
      args.all = true;
    } else if (token === '--strict') {
      args.strict = true;
    } else if (token === '--region' || token === '--concurrency') {
      const value = String(argv[++index] || '').trim();
      if (!value) throw new Error(`Missing value for ${token}`);
      args[token.slice(2)] = token === '--concurrency' ? Number(value) : value;
    } else if (token.startsWith('--region=')) {
      args.region = token.slice('--region='.length);
    } else if (token.startsWith('--concurrency=')) {
      args.concurrency = Number(token.slice('--concurrency='.length));
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
  if (args.concurrency !== undefined && (!Number.isInteger(args.concurrency) || args.concurrency < 1 || args.concurrency > 24)) throw new Error('Concurrency must be an integer from 1 to 24');
  if (args.all && args.sources.length) throw new Error('Use --all or --source, not both');
  return args;
}

function selectSources(allSources, ids, region) {
  if (region) {
    const selected = selectSources(allSources, ids).filter((source) => source.region?.localeCompare(region, 'it', { sensitivity: 'base' }) === 0);
    if (!selected.length) throw new Error(`No enabled sources in region: ${region}`);
    return selected;
  }
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
  deterministic = false,
  adapter = runSourceProcess,
  log = console
} = {}) {
  const cached = existing.filter((item) => belongingTo(source, item));

  // National collector sets deterministic=true, but pdf-programma / gemini sources
  // must still go through fetchDocument + extractFromSource when a key is present.
  const useDeterministicAdapter = deterministic && !(usesGeminiExtractor(source) && apiKey);
  if (useDeterministicAdapter) {
    const result = await adapter(source, {
      now,
      budgetMs: Number(process.env.SCRAPE_SOURCE_BUDGET_MS || 60_000),
      maxDocuments: Number(process.env.SCRAPE_MAX_DOCUMENTS || 12)
    });
    const extracted = preserveEnrichment(result.excursions, existing);
    // Homepages and paginated calendars are partial views. Missing rows are never proof of cancellation.
    const merged = new Map(cached.map((event) => [event.id, event]));
    for (const event of extracted) merged.set(event.id, event);
    return { ...result, source, excursions: [...merged.values()].filter((event) => (event.dateEnd || event.date) >= monthFloor(now)) };
  }

  if (isCheerioSource(source) || source.id === 'roma') {
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
  region,
  concurrency = Number(process.env.SCRAPE_CONCURRENCY || 8),
  adapter,
  now = DateTime.now(),
  apiKey,
  scrapeRoma,
  extract,
  fetchDoc,
  log = console,
  sleep = defaultSleep
} = {}) {
  const selected = selectSources(sources, sourceIds, region);
  const deterministic = Boolean(adapter) || (!scrapeRoma && !extract && !fetchDoc);
  const existing = Array.isArray(existingPayload.excursions) ? existingPayload.excursions : [];
  const hashes = existingPayload.sourceHashes && typeof existingPayload.sourceHashes === 'object'
    ? { ...existingPayload.sourceHashes }
    : {};

  const geminiSelected = selected.some((source) => usesGeminiExtractor(source) && !isCheerioSource(source));
  // Resolve Gemini even when the national collector runs in deterministic mode,
  // otherwise extractor:'gemini' sources are forced through pdf-text and yield 0 events.
  const resolvedKey = (deterministic && !geminiSelected) ? null : apiKey === undefined
    ? resolveGeminiKey({ env: process.env })
    : apiKey;

  if (geminiSelected || (!deterministic && selected.some((source) => !isCheerioSource(source)))) {
    if (resolvedKey) {
      log.log('Using GEMINI_KEY with gemini-3.5-flash');
    } else {
      log.log(
        'No GEMINI_KEY: LLM sources will be skipped. '
        + 'Set the GitHub Actions secret GEMINI_KEY, or put it in backend/.env.'
      );
    }
  }

  const kept = existing.filter((item) => !selected.some((source) => belongingTo(source, item)));

  const results = [];
  const nextHashes = { ...hashes };
  const failures = [];
  const pauseMs = Number(process.env.GEMINI_PAUSE_MS || 0);

  async function processSource(source) {
    try {
      const result = await scrapeSource(source, {
        existing,
        hashes,
        now,
        apiKey: resolvedKey,
        scrapeRoma,
        extract,
        fetchDoc,
        deterministic,
        adapter,
        log
      });
      results.push(result);
      if (result.hash) nextHashes[source.id] = result.hash;
      log.log(`${source.id}: ${result.status} (${result.excursions.length} excursions)`);
      if (pauseMs > 0 && (usesGeminiExtractor(source) || (!deterministic && !isCheerioSource(source))) && result.status === 'ok') {
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
      if (pauseMs > 0 && (usesGeminiExtractor(source) || !deterministic) && !isGeminiQuotaError(error)) await sleep(pauseMs);
    }
  }

  // Distinct section processes are bounded globally and to two workers per host.
  // This matters for the hundreds of section sites hosted together by cai.it.
  const pending = [...selected];
  const running = new Set();
  const hosts = new Map();
  const hostOf = (source) => { try { return new URL(source.url || source.website).hostname; } catch { return source.id; } };
  const limit = deterministic ? Math.max(1, Math.min(24, concurrency)) : 1;
  while (pending.length || running.size) {
    while (running.size < limit && pending.length) {
      const index = pending.findIndex((source) => (hosts.get(hostOf(source)) || 0) < 2);
      if (index < 0) break;
      const [source] = pending.splice(index, 1);
      const host = hostOf(source); hosts.set(host, (hosts.get(host) || 0) + 1);
      const promise = processSource(source).finally(() => { running.delete(promise); hosts.set(host, hosts.get(host) - 1); });
      running.add(promise);
    }
    if (running.size) await Promise.race(running);
  }

  const collected = sortExcursions([
    ...kept,
    ...results.flatMap((result) => result.excursions)
  ]).filter((event) => (event.dateEnd || event.date) >= monthFloor(now))
    .map((event) => event.sourceId || event.coordinatesQuality === 'source' || event.locationSource ? event : applyApproximateCoords(event));

  if (collected.length === 0 && results.length === 0) {
    const detail = failures.map((item) => `${item.source.id}: ${item.error.message}`).join('; ');
    throw new Error(detail || 'No excursion data available');
  }

  const hardFailures = failures.filter((item) => cachedOrEmpty(existing, item.source).length === 0);

  return {
    excursions: collected,
    sources: ((sourceIds && sourceIds.length > 0) || region
      ? mergeSourceMeta(existingPayload.sources, selected)
      : selected.map(sourceMeta)
    ),
    sourceHashes: nextHashes,
    failures,
    hardFailures,
    results,
    coverage: {
      total: sources.length, selected: selected.length,
      withEvents: results.filter((result) => result.excursions.length > 0).length,
      parsed: results.filter((result) => ['ok', 'partial', 'no-upcoming', 'reused'].includes(result.status)).length,
      unsupported: results.filter((result) => result.status === 'unsupported').length,
      failed: failures.length,
      located: collected.filter((event) => Number.isFinite(event.lat) && Number.isFinite(event.lng) && event.coordinatesQuality !== 'unknown').length
    }
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
    coverage: result.coverage,
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
  sortExcursions,
  usesGeminiExtractor
};
