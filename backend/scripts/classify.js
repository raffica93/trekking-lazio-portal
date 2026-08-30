const fs = require('node:fs/promises');
const path = require('node:path');
const { enrichExcursions, resolveApiKey } = require('../classifier');

const outputPath = path.join(__dirname, '..', 'data', 'excursions.json');
const publicPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'excursions.json');

function parseArgs(argv) {
  const args = { dryRun: false, limit: null, id: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--dry-run') {
      args.dryRun = true;
    } else if (token === '--limit') {
      args.limit = Number(argv[index + 1]);
      index += 1;
    } else if (token.startsWith('--limit=')) {
      args.limit = Number(token.slice('--limit='.length));
    } else if (token === '--id') {
      args.id = argv[index + 1];
      index += 1;
    } else if (token.startsWith('--id=')) {
      args.id = token.slice('--id='.length);
    } else if (token === '--help' || token === '-h') {
      args.help = true;
    }
  }

  if (args.limit != null && !Number.isFinite(args.limit)) {
    throw new Error('--limit must be a number');
  }
  return args;
}

async function readPayload(filePath = outputPath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJsonAtomic(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, filePath);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function usage() {
  return [
    'Usage: npm run classify -- [--dry-run] [--limit N] [--id roma-...]',
    '',
    'Enriches backend/data/excursions.json with Grok.',
    'Uses XAI_API_KEY from https://console.x.ai (the key must start with xai-).',
    'Does not run as part of the scheduled scrape.'
  ].join('\n');
}

async function runClassify({
  argv = process.argv.slice(2),
  env = process.env,
  classify,
  dataPath = outputPath,
  sitePath = publicPath,
  grokHome,
  log = console
} = {}) {
  const args = parseArgs(argv);
  if (args.help) {
    log.log(usage());
    return { args, skipped: true };
  }

  const apiKey = resolveApiKey({ env, grokHome });
  if (!apiKey) {
    throw new Error('XAI_API_KEY is required. Create one at https://console.x.ai (it must start with xai-).');
  }
  log.log('Using XAI_API_KEY');

  const payload = await readPayload(dataPath);
  const existing = Array.isArray(payload.excursions) ? payload.excursions : [];
  if (existing.length === 0) {
    throw new Error(`No excursions found in ${dataPath}`);
  }

  if (args.id && !existing.some((item) => item.id === args.id)) {
    throw new Error(`Excursion ${args.id} was not found`);
  }

  const result = await enrichExcursions(existing, existing, {
    apiKey,
    model: env.XAI_MODEL,
    classify,
    limit: args.limit,
    id: args.id
  });

  const nextPayload = {
    ...payload,
    generatedAt: payload.generatedAt,
    classifiedAt: new Date().toISOString(),
    excursions: result.excursions
  };

  log.log(
    `Classified ${result.classified}, reused ${result.reused}, failed ${result.failed}`
    + (args.dryRun ? ' (dry-run)' : '')
  );

  if (args.dryRun) {
    const changed = result.excursions.filter((item, index) => (
      JSON.stringify(item) !== JSON.stringify(existing[index])
    ));
    log.log(JSON.stringify(changed.slice(0, args.limit || changed.length), null, 2));
    return { args, result, wrote: false, payload: nextPayload };
  }

  if (result.classified === 0) {
    log.log('No enrichment changes');
    return { args, result, wrote: false, payload };
  }

  await writeJsonAtomic(dataPath, nextPayload);
  if (await pathExists(path.dirname(sitePath))) {
    await writeJsonAtomic(sitePath, nextPayload);
  }

  return { args, result, wrote: true, payload: nextPayload };
}

async function main() {
  await runClassify();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseArgs, runClassify, usage };
