const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { run, parseArgs, coverageTasks } = require('../scripts/orchestrate-cai');
const { verifyImportManifest } = require('../scripts/import-supabase');

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-orchestrator-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const directory = path.join(root, 'backend/data');
  await fs.mkdir(directory, { recursive: true });
  const payload = { excursions: [{ id: 'roma-1', title: 'Monte Test', date: '2026-11-01' }] };
  const status = { sources: [{ id: 'roma', enabled: true, status: 'partial', excursions: 1 }] };
  for (const [name, value] of Object.entries({ 'excursions.json': payload, 'cai-sections.json': { sections: [] }, 'scrape-status.json': status })) {
    await fs.writeFile(path.join(directory, name), JSON.stringify(value));
  }
  let imports = 0;
  let collections = 0;
  let collectionArgv;
  const options = {
    root, runs: path.join(directory, 'agent-runs'), log: { log() {} },
    collect: async ({ argv } = {}) => { collections++; collectionArgv = argv; return { payload, status }; },
    importData: async ({ argv }) => {
      imports++;
      verifyImportManifest(argv[1], ['excursions.json', 'cai-sections.json', 'scrape-status.json'].map((name) => path.join(directory, name)), root);
      return { status: 'completed', inserted: 1, updated: 0, skipped: 0 };
    }
  };
  const command = (...argv) => run({ ...options, argv: [argv[0], '--run', 'test', ...argv.slice(1)] });
  return { root, directory, options, command, imports: () => imports, collections: () => collections, collectionArgv: () => collectionArgv };
}

test('database waits for files, then imports once and keeps partial sources as todo', async (t) => {
  const f = await fixture(t);
  await f.command('init', '--source', 'roma');
  await assert.rejects(f.command('import'), /waiting for verified/);
  assert.equal(f.imports(), 0);
  const collected = await f.command('collect');
  assert.equal(collected.files, 'ready');
  assert.equal(collected.collection, 'partial');
  assert.equal(collected.sources[0].task, 'todo');
  const imported = await f.command('import');
  assert.equal(imported.database, 'completed');
  await f.command('import');
  await f.command('collect');
  assert.equal(f.imports(), 1);
  assert.equal(f.collections(), 1);
});

test('partial delta receipts remain resumable and repeat only the sealed delta manifest', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  await f.command('collect');
  const calls = [];
  let attempt = 0;
  const runImport = async ({ argv }) => {
    calls.push(argv);
    return ++attempt === 1
      ? { mode: 'delta-only', status: 'partial', places: { missing: [] }, classifications: { mismatched: ['cai-one'] } }
      : { mode: 'delta-only', status: 'completed', places: { missing: [] }, classifications: { mismatched: [] } };
  };
  const manifest = 'backend/data/agent-runs/classification/delta/manifest.json';
  const first = await run({ ...f.options, argv: ['import', '--run', 'test', '--delta-only', '--manifest', manifest], importData: runImport });
  assert.equal(first.database, 'partial');
  assert.equal(first.databaseImport.mode, 'delta-only');
  const second = await run({ ...f.options, argv: ['import', '--run', 'test'], importData: runImport });
  assert.equal(second.database, 'completed');
  assert.deepEqual(calls, [
    ['--delta-only', '--manifest', path.join(f.root, manifest)],
    ['--delta-only', '--manifest', path.join(f.root, manifest)]
  ]);
});

test('partial catalog receipt cannot be resumed by a wholesale import', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  await f.command('collect');
  const statePath = path.join(f.options.runs, 'test', 'state.json');
  const state = JSON.parse(await fs.readFile(statePath, 'utf8'));
  state.database = 'partial';
  state.databaseImport = { mode: 'catalog', manifestPath: state.manifest };
  state.importResult = { status: 'partial', skippedUnclassifiedNew: 1 };
  await fs.writeFile(statePath, JSON.stringify(state));
  const importsBefore = f.imports();
  await assert.rejects(f.command('import'), /cannot be resumed wholesale/);
  assert.equal(f.imports(), importsBefore);
  const after = await f.command('status');
  assert.equal(after.database, 'partial');
});

test('changed files fail the import and keep resumable state', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  await f.command('collect');
  await fs.appendFile(path.join(f.directory, 'excursions.json'), ' ');
  await assert.rejects(f.command('import'), /checksum mismatch/);
  const state = await f.command('status');
  assert.equal(state.database, 'failed');
  assert.equal(state.files, 'ready');
  assert.match(state.error, /checksum mismatch/);
});

test('collection failure never seals files and can be resumed', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  await assert.rejects(run({ ...f.options, argv: ['collect', '--run', 'test'], collect: async () => { throw new Error('offline'); } }), /offline/);
  const failed = await f.command('status');
  assert.equal(failed.collection, 'failed');
  assert.equal(failed.files, 'pending');
  await assert.rejects(f.command('import'), /waiting for verified/);
  assert.equal((await f.command('collect')).files, 'ready');
});

test('global lock prevents overlapping collection and duplicate run cannot overwrite state', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  await assert.rejects(f.command('init'), /EEXIST/);
  await fs.mkdir(path.join(f.options.runs, '.lock'));
  await assert.rejects(f.command('collect'), /Another CAI orchestration/);
  assert.equal(f.collections(), 0);
});

test('invalid IDs, dry runs and unknown import flags are rejected', () => {
  for (const argv of [['init', '--run', '../escape'], ['init', '--run', 'a', '--dry-run'], ['import', '--run', 'a', '--all'], ['import', '--run', 'a', '--delta-only']]) assert.throws(() => parseArgs(argv));
  assert.deepEqual(parseArgs(['init', '--run', 'valid', '--region', 'Lazio']).scrapeArgs, ['--region', 'Lazio']);
  assert.equal(parseArgs(['import', '--run', 'valid', '--delta-only', '--manifest', 'sealed.json']).deltaManifest, 'sealed.json');
});

test('init persists explicit continuation URLs with their single source and rejects a cross-host URL', async (t) => {
  const f = await fixture(t);
  const urls = [
    'https://organizzazione.cai.it/sez-valmadrera/eventi/oggi/',
    'https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?eventDisplay=past'
  ];
  const state = await f.command('init', '--source', 'cai-valmadrera-9216081', ...urls.flatMap((url) => ['--source-url', url]));
  assert.deepEqual(state.sourceUrlContinuation, { sourceId: 'cai-valmadrera-9216081', urls });
  assert.deepEqual(state.scrapeArgs.slice(0, 2), ['--source', 'cai-valmadrera-9216081']);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(f.options.runs, 'test', 'state.json'), 'utf8')).sourceUrlContinuation, state.sourceUrlContinuation);

  await assert.rejects(run({ ...f.options, argv: [
    'init', '--run', 'bad-host', '--source', 'cai-valmadrera-9216081', '--source-url', 'https://example.org/calendar'
  ] }), /host must match/);
  await assert.rejects(run({ ...f.options, argv: [
    'init', '--run', 'many-sources', '--source', 'cai-valmadrera-9216081', '--source', 'roma', '--source-url', urls[0]
  ] }), /exactly one --source/);
});

test('--retry-failed replays the persisted continuation URL list for its source', async (t) => {
  const f = await fixture(t);
  const sourceId = 'cai-valmadrera-9216081';
  const urls = [
    'https://organizzazione.cai.it/sez-valmadrera/eventi/oggi/',
    'https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?eventDisplay=past'
  ];
  await f.command('init', '--source', sourceId, ...urls.flatMap((url) => ['--source-url', url]), '--concurrency', '1');
  const statePath = path.join(f.options.runs, 'test', 'state.json');
  const state = JSON.parse(await fs.readFile(statePath, 'utf8'));
  state.collection = 'partial';
  state.files = 'ready';
  state.manifest = 'backend/data/agent-runs/test/manifest.json';
  state.sources = [{ id: sourceId, task: 'todo' }];
  await fs.writeFile(statePath, JSON.stringify(state));

  await f.command('collect', '--retry-failed');
  assert.deepEqual(f.collectionArgv(), [
    `--source=${sourceId}`, '--concurrency', '1',
    '--source-url', urls[0], '--source-url', urls[1]
  ]);
});

test('coverage distinguishes complete, unsupported, partial and disabled sources', () => {
  assert.deepEqual(coverageTasks({ sources: [
    { id: 'a', status: 'no-upcoming' }, { id: 'b', status: 'unsupported' },
    { id: 'c', status: 'partial' }, { id: 'd', status: 'disabled', enabled: false }
  ] }).map((source) => source.task), ['done', 'todo', 'todo', 'disabled']);
});

test('invalid calendar dates and duplicate IDs cannot reach the database', async (t) => {
  const f = await fixture(t);
  await f.command('init');
  const event = { id: 'roma-1', title: 'Monte Test', date: '2026-02-30' };
  await fs.writeFile(path.join(f.directory, 'excursions.json'), JSON.stringify({ excursions: [event] }));
  await assert.rejects(f.command('collect'), /Invalid or duplicate event/);
  event.date = '2026-11-01';
  await fs.writeFile(path.join(f.directory, 'excursions.json'), JSON.stringify({ excursions: [event, event] }));
  await assert.rejects(f.command('collect'), /Invalid or duplicate event/);
  await assert.rejects(f.command('import'), /waiting for verified/);
  assert.equal(f.imports(), 0);
});
