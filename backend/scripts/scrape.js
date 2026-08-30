const fs = require('node:fs/promises');
const path = require('node:path');
const { buildPayload, parseScrapeArgs, scrapeAll } = require('../pipeline');
const { SOURCES } = require('../sources');

const outputPath = path.join(__dirname, '..', 'data', 'excursions.json');

function usage() {
  return [
    'Usage: npm run scrape -- [--dry-run] [--source id]',
    '',
    'Scrapes enabled CAI Lazio sources into backend/data/excursions.json.',
    'CAI Roma uses the HTML parser. Other sections use Grok (XAI_API_KEY).',
    'Without an API key, Roma still runs and Grok sources keep their cache.',
    'Repeat --source to limit the run, e.g. --source tivoli --source viterbo.'
  ].join('\n');
}

async function writeJsonAtomic(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, filePath);
}

async function readExistingPayload(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

async function runScrape({
  argv = process.argv.slice(2),
  dataPath = outputPath,
  sources = SOURCES,
  scrapeAllImpl = scrapeAll,
  log = console
} = {}) {
  const args = parseScrapeArgs(argv);
  if (args.help) {
    log.log(usage());
    return { args, skipped: true };
  }

  const existing = await readExistingPayload(dataPath);
  const result = await scrapeAllImpl({
    sources,
    existingPayload: existing || {},
    sourceIds: args.sources.length > 0 ? args.sources : undefined,
    log
  });

  const payload = buildPayload(result, existing || {});
  const unchanged = JSON.stringify(existing?.excursions) === JSON.stringify(payload.excursions)
    && JSON.stringify(existing?.sourceHashes || {}) === JSON.stringify(payload.sourceHashes || {});

  if (unchanged) {
    log.log(`No changes: ${payload.excursions.length} upcoming excursions`);
    return { args, result, wrote: false, payload };
  }

  if (args.dryRun) {
    log.log(`Dry-run: ${payload.excursions.length} upcoming excursions (not written)`);
    return { args, result, wrote: false, payload };
  }

  await writeJsonAtomic(dataPath, payload);
  log.log(`Updated cache with ${payload.excursions.length} upcoming excursions`);
  return { args, result, wrote: true, payload };
}

async function main() {
  await runScrape();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseScrapeArgs, runScrape, usage };
