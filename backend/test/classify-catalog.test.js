'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { classifyRules } = require('../adapters/mercury-decide');
const {
  MANIFEST_NAME,
  OUTPUT_NAME,
  STATE_NAME,
  parseArgs,
  runCatalogClassification
} = require('../scripts/classify-catalog');

function answer(event, decision, category) {
  return {
    ...classifyRules(event),
    decision,
    category,
    confidence: 0.93,
    probability: 0.93,
    rationale: 'mocked Mercury fixture answer',
    model: null,
    modelRequested: 'inception/mercury-decide',
    responseModel: null,
    modelAttested: false,
    method: 'mercury-decide',
    modelVersion: 'inception/mercury-decide',
    mapEligible: decision === 'trekking'
  };
}

async function workspace() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cai-classify-catalog-'));
  return {
    root,
    input: path.join(root, 'input.json'),
    output: path.join(root, 'runs', 'piemonte-01'),
    cache: path.join(root, 'cache')
  };
}

test('CLI parser requires explicit paths/run and bounds concurrency/rate', () => {
  assert.deepEqual(parseArgs(['--input', 'catalog.json', '--output', 'run-dir', '--run', 'piemonte-01']), {
    concurrency: 2, rateLimitMs: 1000, input: 'catalog.json', output: 'run-dir', run: 'piemonte-01'
  });
  assert.throws(() => parseArgs(['--input', 'a', '--output', 'b', '--run', 'c', '--concurrency', '9']), /concurrency/);
  assert.throws(() => parseArgs(['--input', 'a', '--output', 'b', '--run', '../unsafe']), /Run ID/);
});

test('run writes isolated catalog, state, decision/category counts and verifiable manifest; sealed resume is idempotent', async () => {
  const temp = await workspace();
  const catalog = {
    metadata: { region: 'Piemonte' },
    excursions: [
      { id: 'cai-a-1', title: 'Escursione al Monte Rosa', date: '2026-11-01', organizer: 'CAI A' },
      { id: 'cai-b-1', title: 'Cena sociale', date: '2026-11-02', organizer: 'CAI B' }
    ]
  };
  await fs.writeFile(temp.input, JSON.stringify(catalog));
  const originalHash = crypto.createHash('sha256').update(await fs.readFile(temp.input)).digest('hex');
  let calls = 0;
  const fetchImpl = async (_url, options) => {
    calls += 1;
    const title = JSON.parse(options.body).state.title;
    return {
      ok: true,
      json: async () => ({ answers: title.startsWith('Escursione')
        ? { decision: { choice: 'trekking', confidence: 0.93 }, category: { choice: 'a piedi', confidence: 0.93 } }
        : { decision: { choice: 'non_trekking', confidence: 0.95 }, category: { choice: 'sociale/culturale', confidence: 0.95 } } })
    };
  };
  try {
    const options = {
      input: temp.input,
      output: temp.output,
      runId: 'piemonte-01',
      concurrency: 2,
      rateLimitMs: 100,
      cacheDir: temp.cache,
      env: { OPENROUTER_API_KEY: 'mock-only', MERCURY_DECIDE_ENABLED: '1', OPENROUTER_ALLOWED_HOSTS: 'openrouter.ai' },
      fetchImpl
    };
    const state = await runCatalogClassification(options);
    assert.equal(state.status, 'ready');
    assert.deepEqual(state.counts.byDecision, { trekking: 1, non_trekking: 1, da_verificare: 0 });
    assert.equal(state.counts.byCategory['a piedi'], 1);
    assert.equal(state.counts.byCategory['sociale/culturale'], 1);
    assert.equal(calls, 2);
    const output = JSON.parse(await fs.readFile(path.join(temp.output, OUTPUT_NAME), 'utf8'));
    assert.deepEqual(output.metadata, catalog.metadata);
    assert.equal(output.excursions.length, 2);
    assert.equal(output.excursions[0].classification.mapEligible, true);
    assert.equal(output.excursions[1].classification.mapEligible, false);
    assert.equal(crypto.createHash('sha256').update(await fs.readFile(temp.input)).digest('hex'), originalHash);
    const manifest = JSON.parse(await fs.readFile(path.join(temp.output, MANIFEST_NAME), 'utf8'));
    assert.deepEqual(manifest.files.map((entry) => entry.path), [OUTPUT_NAME, STATE_NAME]);
    for (const entry of manifest.files) {
      const bytes = await fs.readFile(path.join(temp.output, entry.path));
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), entry.sha256);
    }
    const before = await fs.readFile(path.join(temp.output, STATE_NAME), 'utf8');
    const resumed = await runCatalogClassification(options);
    assert.equal(resumed.status, 'ready');
    assert.equal(calls, 2);
    assert.equal(await fs.readFile(path.join(temp.output, STATE_NAME), 'utf8'), before);
  } finally { await fs.rm(temp.root, { recursive: true, force: true }); }
});

test('API failures stay invalid, are counted, and resume retries them without marking files ready', async () => {
  const temp = await workspace();
  await fs.writeFile(temp.input, JSON.stringify([{ id: 'cai-unclear-1', title: 'Programma speciale', date: '2026-11-01' }]));
  const options = {
    input: temp.input,
    output: temp.output,
    runId: 'retry-01',
    rateLimitMs: 100,
    cacheDir: temp.cache,
    env: { OPENROUTER_API_KEY: 'secret-fixture', MERCURY_DECIDE_ENABLED: '1', OPENROUTER_ALLOWED_HOSTS: 'openrouter.ai' },
    fetchImpl: async () => { throw new Error('offline transport'); }
  };
  try {
    const partial = await runCatalogClassification(options);
    assert.equal(partial.status, 'partial');
    assert.equal(partial.counts.errors, 1);
    const output1 = JSON.parse(await fs.readFile(path.join(temp.output, OUTPUT_NAME), 'utf8'));
    assert.equal(output1[0].classification, undefined);
    assert.equal(partial.errors[0].code, 'mercury-unavailable');
    assert.equal(partial.errors[0].message.includes('secret-fixture'), false);

    const resumed = await runCatalogClassification({
      ...options,
      fetchImpl: async () => ({ ok: true, json: async () => ({ answers: {
        decision: { choice: 'da_verificare', confidence: 0.88 },
        category: { choice: 'altro', confidence: 0.88 }
      } }) })
    });
    assert.equal(resumed.status, 'ready');
    assert.equal(resumed.counts.errors, 0);
    const output2 = JSON.parse(await fs.readFile(path.join(temp.output, OUTPUT_NAME), 'utf8'));
    assert.equal(output2[0].classification.valid, undefined);
    assert.equal(output2[0].classification.decision, 'da_verificare');
  } finally { await fs.rm(temp.root, { recursive: true, force: true }); }
});

test('catalog CLI preflight blocks offline fallback without writing files or calling fetch', async () => {
  const temp = await workspace();
  await fs.writeFile(temp.input, JSON.stringify([{ id: 'cai-rule-1', title: 'Escursione al rifugio', date: '2026-12-01' }]));
  let calls = 0;
  try {
    await assert.rejects(runCatalogClassification({
      input: temp.input,
      output: temp.output,
      runId: 'offline-01',
      rateLimitMs: 100,
      cacheDir: temp.cache,
      env: {},
      fetchImpl: async () => { calls += 1; throw new Error('must not call'); }
    }), /requires an OpenRouter key/);
    assert.equal(calls, 0);
    await assert.rejects(fs.stat(temp.output), { code: 'ENOENT' });
  } finally { await fs.rm(temp.root, { recursive: true, force: true }); }
});
