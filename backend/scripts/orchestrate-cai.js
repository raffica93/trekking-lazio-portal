const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { DateTime } = require('luxon');
const { runScrape, writeJsonAtomic } = require('./scrape');
const { SOURCES } = require('../sources');
const { selectSources, validateSourceUrls } = require('../pipeline');

const ROOT = path.resolve(__dirname, '../..');
const RUNS = path.join(ROOT, 'backend/data/agent-runs');
const FILES = ['backend/data/excursions.json', 'backend/data/cai-sections.json', 'backend/data/scrape-status.json'];

function collectWithoutAi(options) {
  const { scrapeAll } = require('../pipeline');
  // Luna coordinates the work; extraction stays local even if legacy Gemini keys exist.
  return runScrape({ ...options, scrapeAllImpl: (scrapeOptions) => scrapeAll({ ...scrapeOptions, apiKey: null }) });
}

function parseArgs(argv) {
  const command = argv[0];
  if (!['init', 'collect', 'import', 'status'].includes(command)) {
    throw new Error('Usage: npm run orchestrate -- <init|collect|import|status> --run ID [scrape options for init]');
  }
  const runIndex = argv.indexOf('--run');
  const runId = argv[runIndex + 1];
  if (runIndex < 1 || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(runId || '')) throw new Error('Specify --run with a safe run ID (1-80 letters, numbers, underscores or hyphens)');
  const rest = argv.slice(1).filter((_, index) => index !== runIndex - 1 && index !== runIndex);
  let deltaManifest = null;
  if (command === 'import' && rest.length) {
    if (rest.length !== 3 || rest[0] !== '--delta-only' || rest[1] !== '--manifest'
      || !rest[2] || rest[2].startsWith('--')) {
      throw new Error('Import accepts only --delta-only --manifest <sealed-classification-manifest>');
    }
    deltaManifest = rest[2];
  }
  const retryFailed = command === 'collect' && rest.length === 1 && rest[0] === '--retry-failed';
  if (command !== 'init' && command !== 'import' && rest.length && !retryFailed) throw new Error('Scrape options belong to init only; collect accepts only --retry-failed');
  const { parseScrapeArgs } = require('../pipeline');
  let sourceUrlContinuation = null;
  if (command === 'init') {
    const parsed = parseScrapeArgs(rest);
    if (parsed.dryRun || parsed.help) throw new Error('Orchestration requires persisted files; use scrape directly for --dry-run/--help');
    if (parsed.sourceUrls.length) {
      const selected = selectSources(SOURCES, parsed.sources, parsed.region);
      if (selected.length !== 1) throw new Error('--source-url continuation requires exactly one selected source');
      validateSourceUrls(selected[0], parsed.sourceUrls);
      sourceUrlContinuation = { sourceId: parsed.sources[0], urls: [...parsed.sourceUrls] };
    }
  }
  return { command, runId, retryFailed, deltaManifest, sourceUrlContinuation, scrapeArgs: command === 'init' && rest.length ? rest : ['--all'] };
}

function coverageTasks(status) {
  return (status.sources || []).map((source) => ({
    id: source.id,
    status: source.status,
    task: ['ok', 'reused', 'no-upcoming'].includes(source.status) ? 'done' : source.enabled === false ? 'disabled' : 'todo',
    events: source.excursions || 0,
    updatedAt: source.updatedAt || null,
    issues: source.issues || [],
    error: source.error || null
  }));
}

async function sealFiles(root, runId) {
  const files = [];
  for (const name of FILES) {
    const bytes = await fs.readFile(path.join(root, name));
    const payload = JSON.parse(bytes);
    if (name.endsWith('excursions.json')) {
      if (!Array.isArray(payload.excursions)) throw new Error('Missing excursions array');
      const ids = new Set();
      for (const event of payload.excursions) {
        const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && DateTime.fromISO(value).isValid;
        if (typeof event.id !== 'string' || !event.id.trim() || ids.has(event.id)
          || typeof event.title !== 'string' || !event.title.trim() || !validDate(event.date)
          || (event.dateEnd != null && (!validDate(event.dateEnd) || event.dateEnd < event.date))) throw new Error('Invalid or duplicate event in collection files');
        ids.add(event.id);
      }
    } else if (name.endsWith('cai-sections.json') && !Array.isArray(payload.sections)) {
      throw new Error('Missing registry sections');
    } else if (name.endsWith('scrape-status.json') && !Array.isArray(payload.sources)) {
      throw new Error('Missing source status');
    }
    files.push({ path: name, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  return { version: 1, runId, createdAt: new Date().toISOString(), files };
}

async function run({ argv = process.argv.slice(2), root = ROOT, runs = RUNS, collect = collectWithoutAi, importData, log = console } = {}) {
  const args = parseArgs(argv);
  const directory = path.join(runs, args.runId);
  const stateFile = path.join(directory, 'state.json');
  const manifestFile = path.join(directory, 'manifest.json');
  if (args.command === 'status') {
    const state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
    log.log(JSON.stringify(state, null, 2));
    return state;
  }
  await fs.mkdir(runs, { recursive: true });
  const lock = path.join(runs, '.lock');
  try {
    await fs.mkdir(lock);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Another CAI orchestration holds backend/data/agent-runs/.lock. Check the previous process before clearing an abandoned lock.');
    throw error;
  }
  let state;
  async function save(event) {
    state.updatedAt = new Date().toISOString();
    state.history.push({ at: state.updatedAt, event });
    await writeJsonAtomic(stateFile, state);
  }
  try {
    if (args.command === 'init') {
      await fs.mkdir(directory);
      state = {
        version: 1, runId: args.runId, model: 'gpt-6-luna',
        createdAt: new Date().toISOString(), scrapeArgs: args.scrapeArgs,
        ...(args.sourceUrlContinuation ? { sourceUrlContinuation: args.sourceUrlContinuation } : {}),
        collection: 'pending', files: 'pending', database: 'pending',
        sources: [], history: []
      };
      await save('run-created');
    } else {
      state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
      if (args.command === 'collect') {
        if (state.database === 'completed') return state;
        if (state.files === 'ready' && !args.retryFailed) return state;
        const retryableState = (state.collection === 'partial' && state.files === 'ready')
          || (state.collection === 'failed' && state.files === 'pending' && Boolean(state.manifest));
        if (args.retryFailed && !retryableState) {
          throw new Error('Failed-source retry requires partial/ready state or a failed retry with a prior manifest');
        }
        let collectionArgs = state.scrapeArgs;
        if (args.retryFailed) {
          const sourceIds = state.sources.filter((source) => source.task === 'todo').map((source) => source.id);
          if (!sourceIds.length) throw new Error('Failed-source retry found no enabled incomplete sources');
          collectionArgs = [`--source=${sourceIds.join(',')}`];
          const concurrencyIndex = state.scrapeArgs.indexOf('--concurrency');
          if (concurrencyIndex >= 0 && state.scrapeArgs[concurrencyIndex + 1]) {
            collectionArgs.push('--concurrency', state.scrapeArgs[concurrencyIndex + 1]);
          }
          if (state.sourceUrlContinuation && sourceIds.includes(state.sourceUrlContinuation.sourceId)) {
            for (const url of state.sourceUrlContinuation.urls) collectionArgs.push('--source-url', url);
          }
        }
        state.collection = 'running';
        state.files = 'pending';
        delete state.error;
        await save(args.retryFailed ? 'failed-source-retry-started' : 'collection-started');
        const result = await collect({ argv: collectionArgs });
        if (!result.status) throw new Error('Collection did not produce a source report');
        state.sources = coverageTasks(result.status);
        if (result.hardFail) throw new Error('Collection has hard failures; resolve them before database import');
        const manifest = await sealFiles(root, args.runId);
        await writeJsonAtomic(manifestFile, manifest);
        state.collection = state.sources.some((source) => source.task === 'todo') ? 'partial' : 'completed';
        state.files = 'ready';
        state.manifest = path.relative(root, manifestFile).split(path.sep).join('/');
        state.events = result.payload?.excursions.length || 0;
        await save('files-verified');
      } else {
        if (state.database === 'completed') return state;
        if (state.files !== 'ready') throw new Error('Database import is waiting for verified collection files');
        const resumablePartial = ['partial', 'failed', 'running'].includes(state.database);
        if (resumablePartial && state.databaseImport?.mode !== 'delta-only' && !args.deltaManifest) {
          throw new Error('A partial catalog import cannot be resumed wholesale; provide --delta-only --manifest for the sealed missing delta');
        }
        const priorDeltaManifest = state.databaseImport?.mode === 'delta-only'
          ? path.resolve(root, state.databaseImport.manifestPath) : null;
        const requestedDeltaManifest = args.deltaManifest ? path.resolve(root, args.deltaManifest) : null;
        if (resumablePartial && priorDeltaManifest && requestedDeltaManifest && requestedDeltaManifest !== priorDeltaManifest) {
          throw new Error('Delta resume must reuse the original sealed classification manifest');
        }
        const deltaManifest = requestedDeltaManifest || (resumablePartial ? priorDeltaManifest : null);
        if (deltaManifest) {
          const relative = path.relative(root, deltaManifest);
          if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
            throw new Error('Delta classification manifest must stay inside the repository');
          }
        }
        state.databaseImport = deltaManifest
          ? { mode: 'delta-only', manifestPath: path.relative(root, deltaManifest).split(path.sep).join('/') }
          : { mode: 'catalog', manifestPath: state.manifest };
        state.database = 'running';
        delete state.error;
        await save(resumablePartial ? 'database-delta-resume-started' : 'database-started');
        const importer = importData || require('./import-supabase').main;
        const importArgv = deltaManifest
          ? ['--delta-only', '--manifest', deltaManifest]
          : ['--manifest', manifestFile];
        state.importResult = await importer({ argv: importArgv });
        const result = state.importResult || {};
        const partial = (result.status != null && result.status !== 'completed')
          || Number(result.skippedUnclassifiedNew || 0) > 0
          || Number(result.classifications?.errors || 0) > 0
          || Number(result.classifications?.mismatched?.length || result.classifications?.mismatchedSourceIds?.length || 0) > 0
          || Number(result.classifications?.skipped?.length || result.skippedClassifications || 0) > 0
          || Number(result.places?.missing?.length || 0) > 0
          || Number(result.places?.skipped?.length || 0) > 0
          || Number(result.places?.protectedFieldMismatches?.length || 0) > 0;
        state.database = partial ? 'partial' : 'completed';
        await save(partial ? 'database-partial-resumable' : 'database-completed');
      }
    }
    log.log(JSON.stringify({ runId: state.runId, collection: state.collection, files: state.files, database: state.database }, null, 2));
    return state;
  } catch (error) {
    if (state && args.command !== 'init') {
      if (args.command === 'collect') state.collection = 'failed';
      else if (state.database === 'running') state.database = 'failed';
      state.error = error.message;
      await save(`${args.command}-failed`);
    }
    throw error;
  } finally {
    await fs.rmdir(lock);
  }
}

if (require.main === module) run().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { run, parseArgs, coverageTasks, sealFiles };
