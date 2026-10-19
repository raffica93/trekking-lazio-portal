const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { DateTime } = require('luxon');
const { runScrape, writeJsonAtomic } = require('./scrape');

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
  if (command !== 'init' && rest.length) throw new Error('Scrape options belong to init only');
  const { parseScrapeArgs } = require('../pipeline');
  if (command === 'init') {
    const parsed = parseScrapeArgs(rest);
    if (parsed.dryRun || parsed.help) throw new Error('Orchestration requires persisted files; use scrape directly for --dry-run/--help');
  }
  return { command, runId, scrapeArgs: rest.length ? rest : ['--all'] };
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
        collection: 'pending', files: 'pending', database: 'pending',
        sources: [], history: []
      };
      await save('run-created');
    } else {
      state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
      if (args.command === 'collect') {
        if (state.files === 'ready' || state.database === 'completed') return state;
        state.collection = 'running';
        state.files = 'pending';
        delete state.error;
        await save('collection-started');
        const result = await collect({ argv: state.scrapeArgs });
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
        state.database = 'running';
        delete state.error;
        await save('database-started');
        const importer = importData || require('./import-supabase').main;
        state.importResult = await importer({ argv: ['--manifest', manifestFile] });
        state.database = 'completed';
        await save('database-completed');
      }
    }
    log.log(JSON.stringify({ runId: state.runId, collection: state.collection, files: state.files, database: state.database }, null, 2));
    return state;
  } catch (error) {
    if (state && args.command !== 'init') {
      if (args.command === 'collect') state.collection = 'failed';
      else state.database = 'failed';
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
