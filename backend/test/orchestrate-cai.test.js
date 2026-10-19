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
  const options = {
    root, runs: path.join(directory, 'agent-runs'), log: { log() {} },
    collect: async () => { collections++; return { payload, status }; },
    importData: async ({ argv }) => {
      imports++;
      verifyImportManifest(argv[1], ['excursions.json', 'cai-sections.json', 'scrape-status.json'].map((name) => path.join(directory, name)), root);
      return { inserted: 1, updated: 0, skipped: 0 };
    }
  };
  const command = (...argv) => run({ ...options, argv: [argv[0], '--run', 'test', ...argv.slice(1)] });
  return { root, directory, options, command, imports: () => imports, collections: () => collections };
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
  for (const argv of [['init', '--run', '../escape'], ['init', '--run', 'a', '--dry-run'], ['import', '--run', 'a', '--all']]) assert.throws(() => parseArgs(argv));
  assert.deepEqual(parseArgs(['init', '--run', 'valid', '--region', 'Lazio']).scrapeArgs, ['--region', 'Lazio']);
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
