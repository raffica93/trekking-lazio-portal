'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const REPO_ROOT = path.resolve(__dirname, '../..');
const {
  CATEGORIES,
  DECISIONS,
  MODEL,
  isVerifiedResponseModel,
  POLICY_VERSION,
  classifyEvents,
  fingerprintFor,
  remoteConfig
} = require('../adapters/mercury-decide');

const METHODS = new Set(['rules-v1', 'mercury-decide']);
const OUTPUT_NAME = 'classified-catalog.json';
const STATE_NAME = 'state.json';
const MANIFEST_NAME = 'manifest.json';
const USAGE = 'Usage: npm run classify:catalog -- --input CATALOG.json --output RUN_DIR --run RUN_ID [--concurrency 1..8] [--rate-ms 100..60000] [--cache-dir DIR]';

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function repoRelativePath(filePath) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
}

function parseArgs(argv) {
  const args = { concurrency: 2, rateLimitMs: 1_000 };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
  if (!['--input', '--output', '--run', '--concurrency', '--rate-ms', '--cache-dir'].includes(token)) {
      throw new Error(`Unknown argument: ${token}`);
    }
    const value = String(argv[index + 1] || '').trim();
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${token}`);
    const key = token === '--rate-ms' ? 'rateLimitMs'
      : token.slice(2).replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
    args[key] = value;
    index += 1;
  }
  for (const key of ['input', 'output', 'run']) if (!args[key]) throw new Error(`Required argument: --${key}`);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(args.run)) throw new Error('Run ID must contain 1-80 letters, numbers, underscores or hyphens');
  args.concurrency = Number(args.concurrency);
  args.rateLimitMs = Number(args.rateLimitMs);
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1 || args.concurrency > 8) throw new Error('--concurrency must be an integer from 1 to 8');
  if (!Number.isInteger(args.rateLimitMs) || args.rateLimitMs < 100 || args.rateLimitMs > 60_000) throw new Error('--rate-ms must be an integer from 100 to 60000');
  return args;
}

function eventsFrom(payload) {
  const events = Array.isArray(payload) ? payload : payload?.excursions;
  if (!Array.isArray(events)) throw new Error('Input JSON must be an array or contain an excursions array');
  const ids = new Set();
  for (const event of events) {
    const id = String(event?.source_id || event?.id || '').trim();
    if (!event || typeof event !== 'object' || Array.isArray(event) || !id) throw new Error('Every catalog event must be an object with a source_id or id');
    if (ids.has(id)) throw new Error(`Duplicate catalog source_id: ${id}`);
    ids.add(id);
  }
  return events;
}

function validClassification(event, classification) {
  const sourceId = String(event?.source_id || event?.id || '').trim();
  return Boolean(classification
    && classification.valid !== false
    && DECISIONS.has(classification.decision)
    && CATEGORIES.has(classification.category)
    && METHODS.has(classification.method)
    && classification.source_id === sourceId
    && classification.fingerprint === fingerprintFor(event)
    && typeof classification.policyVersion === 'string' && classification.policyVersion === POLICY_VERSION
    && (classification.method === 'rules-v1'
      ? classification.model === null && classification.modelVersion === null
        && classification.modelRequested === null && classification.responseModel === null && classification.modelAttested === false
      : classification.modelRequested === MODEL
        && (classification.responseModel === null || isVerifiedResponseModel(classification.responseModel))
        && classification.model === classification.responseModel
        && classification.modelAttested === isVerifiedResponseModel(classification.responseModel)
        && classification.modelVersion === (classification.modelAttested ? classification.responseModel : null))
    && typeof classification.rationale === 'string' && classification.rationale.trim()
    && typeof classification.evidenceOriginal === 'string'
    && validScore(classification.confidence)
    && validScore(classification.probability)
    && classification.mapEligible === (classification.decision === 'trekking'));
}

function validScore(value) {
  return value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1);
}

function rootWithEvents(inputPayload, events) {
  return Array.isArray(inputPayload) ? events : { ...inputPayload, excursions: events };
}

function countResults(events, errors) {
  const byDecision = Object.fromEntries([...DECISIONS].map((decision) => [decision, 0]));
  const byCategory = Object.fromEntries([...CATEGORIES].map((category) => [category, 0]));
  for (const event of events) {
    const classification = event.classification;
    if (DECISIONS.has(classification?.decision)) byDecision[classification.decision] += 1;
    if (CATEGORIES.has(classification?.category)) byCategory[classification.category] += 1;
  }
  return { total: events.length, byDecision, byCategory, errors: errors.length };
}

async function writeJsonAtomic(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${crypto.randomBytes(5).toString('hex')}.tmp`;
  try {
    await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    await fs.rename(temp, file);
  } finally { await fs.rm(temp, { force: true }).catch(() => {}); }
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function isSealedRun(runDir, state, inputHash, sourceEvents) {
  if (state?.status !== 'ready') return false;
  if (state.inputSha256 !== inputHash || state.runId == null) return false;
  try {
    const manifest = await readJson(path.join(runDir, MANIFEST_NAME));
    if (manifest.runId !== state.runId) return false;
    for (const entry of manifest.files || []) {
      if (![OUTPUT_NAME, STATE_NAME].includes(entry.path)) return false;
      if (sha256(await fs.readFile(path.join(runDir, entry.path))) !== entry.sha256) return false;
    }
    const sealedEvents = eventsFrom(await readJson(path.join(runDir, OUTPUT_NAME)));
    if (sealedEvents.length !== sourceEvents.length
      || sealedEvents.some((event, index) => String(event.source_id || event.id) !== String(sourceEvents[index].source_id || sourceEvents[index].id)
        || !validClassification(sourceEvents[index], event.classification))) return false;
    return manifest.files?.some((entry) => entry.path === OUTPUT_NAME)
      && manifest.files?.some((entry) => entry.path === STATE_NAME);
  } catch { return false; }
}

function safeError(error, apiKey) {
  let message = String(error?.message || 'classification error').replace(/[\r\n\t]+/g, ' ').slice(0, 500);
  if (apiKey) message = message.split(apiKey).join('[redacted]');
  message = message.replace(/Bearer\s+\S+/gi, 'Bearer [redacted]');
  return message;
}

async function runCatalogClassification({
  input,
  output,
  runId,
  concurrency = 2,
  rateLimitMs = 1_000,
  cacheDir,
  env = process.env,
  fetchImpl = globalThis.fetch,
  classifyEventsImpl = classifyEvents
} = {}) {
  if (!input || !output || !runId) throw new Error('input, output, and runId are required');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(runId)) throw new Error('Run ID must contain 1-80 letters, numbers, underscores or hyphens');
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) throw new Error('concurrency must be from 1 to 8');
  if (!Number.isInteger(rateLimitMs) || rateLimitMs < 100 || rateLimitMs > 60_000) throw new Error('rateLimitMs must be from 100 to 60000');
  const { apiKey, enabled, allowed } = remoteConfig(env);
  if (!apiKey || !enabled || !allowed || typeof fetchImpl !== 'function') {
    throw new Error('Catalog classification requires an OpenRouter key, MERCURY_DECIDE_ENABLED=1, and OPENROUTER_ALLOWED_HOSTS including openrouter.ai');
  }

  const inputPath = path.resolve(input);
  const runDir = path.resolve(output);
  const inputBytes = await fs.readFile(inputPath);
  const inputHash = sha256(inputBytes);
  const inputPayload = JSON.parse(inputBytes.toString('utf8'));
  const sourceEvents = eventsFrom(inputPayload);
  if (runDir === inputPath) throw new Error('Output directory cannot be the input file');
  const isWithin = (candidate, directory) => candidate === directory || candidate.startsWith(`${directory}${path.sep}`);
  const publicDir = path.join(REPO_ROOT, 'frontend', 'public');
  const cacheDirInRepo = path.join(REPO_ROOT, 'backend', 'node_modules');
  const dataDir = path.join(REPO_ROOT, 'backend', 'data');
  const allowedDataRuns = path.join(dataDir, 'agent-runs');
  if (isWithin(runDir, publicDir) || isWithin(runDir, cacheDirInRepo)
    || (isWithin(runDir, dataDir) && !isWithin(runDir, allowedDataRuns))) {
    throw new Error('Output must be isolated from public catalogs, backend data files, and dependency caches');
  }

  const statePath = path.join(runDir, STATE_NAME);
  const outputPath = path.join(runDir, OUTPUT_NAME);
  const manifestPath = path.join(runDir, MANIFEST_NAME);
  await fs.mkdir(runDir, { recursive: true });
  const outputContents = await fs.readdir(runDir);
  if (outputContents.length && !outputContents.includes(STATE_NAME)) {
    throw new Error('Output directory is not empty and has no resumable state');
  }

  let previousState = null;
  let previousEvents = null;
  try {
    previousState = await readJson(statePath);
    if (previousState.runId !== runId || previousState.inputSha256 !== inputHash || previousState.policyVersion !== POLICY_VERSION) {
      throw new Error('Existing output directory belongs to a different run, input, or policy version');
    }
    if (await isSealedRun(runDir, previousState, inputHash, sourceEvents)) return previousState;
    const priorPayload = await readJson(outputPath);
    previousEvents = eventsFrom(priorPayload);
  } catch (error) {
    if (error.message.includes('belongs to a different')) throw error;
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error;
  }

  if (previousEvents && previousEvents.length !== sourceEvents.length) previousEvents = null;
  const events = sourceEvents.map((event, index) => {
    const previous = previousEvents?.[index];
    const sourceId = String(event.source_id || event.id);
    const previousId = String(previous?.source_id || previous?.id || '');
    const previousClassification = previousId === sourceId ? previous.classification : null;
    const candidate = validClassification(event, event.classification) ? event.classification
      : validClassification(event, previousClassification) ? previousClassification : null;
    return candidate ? { ...event, classification: candidate } : { ...event, classification: undefined };
  });
  const priorErrors = Array.isArray(previousState?.errors) ? previousState.errors : [];
  const resumableErrors = priorErrors.filter((item) => {
    const matching = events.find((event) => String(event.source_id || event.id) === item.source_id);
    return matching && !validClassification(matching, matching.classification);
  });
  const errorBySource = new Map(resumableErrors.map((item) => [item.source_id, item]));
  const pendingIndices = events.map((event, index) => event.classification ? -1 : index).filter((index) => index >= 0);
  const envKey = apiKey;

  const state = {
    version: 1,
    runId,
    status: 'running',
    input: repoRelativePath(inputPath),
    inputSha256: inputHash,
    modelRequested: MODEL,
    policyVersion: POLICY_VERSION,
    createdAt: previousState?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    concurrency,
    rateLimitMs,
    total: events.length,
    completed: events.length - pendingIndices.length,
    processed: events.length - pendingIndices.length,
    counts: countResults(events, priorErrors),
    errors: [...errorBySource.values()]
  };

  async function persistProgress() {
    state.updatedAt = new Date().toISOString();
    state.completed = events.filter((event) => validClassification(event, event.classification)).length;
    state.processed = Math.min(state.total, state.completed + state.errors.length);
    state.counts = countResults(events, state.errors);
    await writeJsonAtomic(outputPath, rootWithEvents(inputPayload, events));
    await writeJsonAtomic(statePath, state);
  }

  if (pendingIndices.length) {
    await persistProgress();
    let progressTail = Promise.resolve();
    await classifyEventsImpl(pendingIndices.map((index) => events[index]), {
      concurrency,
      rateLimitMs,
      env,
      fetchImpl,
      cacheDir,
      onResult: async (pendingIndex, classification) => {
        const eventIndex = pendingIndices[pendingIndex];
        const eventBefore = events[eventIndex];
        const eventAfter = { ...eventBefore };
        const source_id = String(eventBefore.source_id || eventBefore.id);
        if (!validClassification(eventBefore, classification)) {
          if (!validClassification(eventBefore, eventBefore.classification)) delete eventAfter.classification;
          const errorCode = classification?.errorCode || 'invalid-classification-result';
          const errorMessage = classification?.valid === false
            ? classification.rationale
            : 'Classifier result failed output validation.';
          errorBySource.set(source_id, { source_id, code: errorCode, message: safeError(new Error(errorMessage), envKey) });
        } else {
          eventAfter.classification = classification;
          errorBySource.delete(source_id);
        }
        events[eventIndex] = eventAfter;
        state.errors = [...errorBySource.values()];
        progressTail = progressTail.then(() => persistProgress());
        await progressTail;
      }
    });
    await progressTail;
  }

  state.errors = [...errorBySource.values()];
  state.counts = countResults(events, state.errors);
  state.completed = events.filter((event) => validClassification(event, event.classification)).length;
  state.processed = Math.min(state.total, state.completed + state.errors.length);
  state.status = state.errors.length || state.completed !== state.total ? 'partial' : 'ready';
  state.updatedAt = new Date().toISOString();
  await writeJsonAtomic(outputPath, rootWithEvents(inputPayload, events));
  await writeJsonAtomic(statePath, state);

  const manifest = {
    version: 1,
    runId,
    createdAt: new Date().toISOString(),
    input: { path: repoRelativePath(inputPath), sha256: inputHash },
    files: []
  };
  for (const name of [OUTPUT_NAME, STATE_NAME]) {
    const bytes = await fs.readFile(path.join(runDir, name));
    manifest.files.push({ path: name, sha256: sha256(bytes), bytes: bytes.length });
  }
  await writeJsonAtomic(manifestPath, manifest);
  return state;
}

async function main(argv = process.argv.slice(2), { log = console, env = process.env } = {}) {
  if (argv.length === 1 && (argv[0] === '--help' || argv[0] === '-h')) {
    log.log(USAGE);
    return null;
  }
  const args = parseArgs(argv);
  const state = await runCatalogClassification({
    input: args.input,
    output: args.output,
    runId: args.run,
    concurrency: args.concurrency,
    rateLimitMs: args.rateLimitMs,
    cacheDir: args.cacheDir,
    env
  });
  log.log(JSON.stringify({ runId: state.runId, status: state.status, counts: state.counts, output: path.resolve(args.output) }, null, 2));
  return state;
}

if (require.main === module) main().catch((error) => {
  let message = String(error.message || error).replace(/Bearer\s+\S+/gi, 'Bearer [redacted]');
  for (const secret of [process.env.OPENROUTER_API_KEY, process.env.OPENROUTER_KEY].filter(Boolean)) {
    message = message.split(secret).join('[redacted]');
  }
  console.error(message);
  process.exitCode = 1;
});

module.exports = {
  MANIFEST_NAME,
  OUTPUT_NAME,
  STATE_NAME,
  USAGE,
  countResults,
  eventsFrom,
  main,
  parseArgs,
  runCatalogClassification,
  validClassification
};
