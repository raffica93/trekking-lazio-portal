const fs = require('node:fs/promises');
const path = require('node:path');
const { buildPayload, parseScrapeArgs, scrapeAll } = require('../pipeline');
const { buildScrapeStatus } = require('../scrape-status');
const { SOURCES } = require('../sources');

const outputPath = path.join(__dirname, '..', 'data', 'excursions.json');
const statusPath = path.join(__dirname, '..', 'data', 'scrape-status.json');
const frontendPublic = path.join(__dirname, '..', '..', 'frontend', 'public');

function usage() {
  return [
    'Usage: npm run scrape -- [--dry-run] [--source id]',
    '       npm run scrape:roma',
    '       node scripts/sede.js <id|all> [--dry-run]',
    '',
    'One script per CAI section. Roma uses the HTML parser;',
    'other enabled sections use Gemini 3.5 Flash (GEMINI_KEY).',
    'Without GEMINI_KEY, Roma still runs and other sections keep their cache.'
  ].join('\n');
}

async function writeJsonAtomic(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, filePath);
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

async function copyToFrontend(fileName, payload) {
  try {
    await writeJsonAtomic(path.join(frontendPublic, fileName), payload);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

async function persistStatus({
  sources,
  result,
  existingStatus,
  dryRun,
  log,
  statusFile = statusPath,
  copyFrontend = true
}) {
  const generatedAt = new Date().toISOString();
  const status = buildScrapeStatus({
    sources,
    existingStatus: existingStatus || {},
    result,
    excursions: result.excursions,
    generatedAt
  });
  if (!dryRun) {
    await writeJsonAtomic(statusFile, status);
    if (copyFrontend) await copyToFrontend('scrape-status.json', status);
  }
  log.log(
    `Status: ${status.sources.filter((row) => row.status === 'ok' || row.status === 'reused').length}`
    + ` ok, ${status.sources.filter((row) => row.status === 'failed').length} failed`
  );
  return status;
}

async function runScrape({
  argv = process.argv.slice(2),
  dataPath = outputPath,
  statusFile = statusPath,
  sources = SOURCES,
  scrapeAllImpl = scrapeAll,
  log = console
} = {}) {
  const args = parseScrapeArgs(argv);
  if (args.help) {
    log.log(usage());
    return { args, skipped: true };
  }

  const existing = await readJson(dataPath);
  const existingStatus = await readJson(statusFile);
  const result = await scrapeAllImpl({
    sources,
    existingPayload: existing || {},
    sourceIds: args.sources.length > 0 ? args.sources : undefined,
    log
  });

  const payload = buildPayload(result, existing || {});
  const unchanged = JSON.stringify(existing?.excursions) === JSON.stringify(payload.excursions)
    && JSON.stringify(existing?.sourceHashes || {}) === JSON.stringify(payload.sourceHashes || {});

  const status = await persistStatus({
    sources,
    result,
    existingStatus,
    dryRun: args.dryRun,
    log,
    statusFile,
    copyFrontend: statusFile === statusPath
  });

  const hardFail = (result.hardFailures || []).length > 0;

  if (unchanged) {
    log.log(`No changes: ${payload.excursions.length} upcoming excursions`);
    return { args, result, wrote: false, payload, status, hardFail };
  }

  if (args.dryRun) {
    log.log(`Dry-run: ${payload.excursions.length} upcoming excursions (not written)`);
    return { args, result, wrote: false, payload, status, hardFail };
  }

  await writeJsonAtomic(dataPath, payload);
  await copyToFrontend('excursions.json', payload);
  log.log(`Updated cache with ${payload.excursions.length} upcoming excursions`);
  return { args, result, wrote: true, payload, status, hardFail };
}

async function main() {
  const result = await runScrape();
  if (result.hardFail) process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseScrapeArgs, persistStatus, runScrape, usage, writeJsonAtomic };
