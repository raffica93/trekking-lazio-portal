const { enabledSources, findSource, SOURCES } = require('../sources');
const { runScrape } = require('./scrape');

function parseSedeArgv(argv = process.argv.slice(2)) {
  const rest = [];
  let id = '';
  for (const token of argv) {
    if (!id && !token.startsWith('-')) {
      id = token.trim();
    } else {
      rest.push(token);
    }
  }
  return { id, rest };
}

function usage() {
  const ids = SOURCES.map((source) => source.id).join(', ');
  return [
    'Usage: node scripts/sede.js <id|all> [--dry-run]',
    '',
    `Known sedi: ${ids}`,
    'Enabled-only when using "all". A single id runs even if disabled.',
    'Examples:',
    '  node scripts/sede.js roma',
    '  node scripts/sede.js tivoli --dry-run',
    '  node scripts/sede.js all'
  ].join('\n');
}

async function runSede({
  argv = process.argv.slice(2),
  runScrapeImpl = runScrape,
  sources = SOURCES,
  log = console
} = {}) {
  const { id, rest } = parseSedeArgv(argv);
  if (!id || id === '--help' || id === '-h') {
    log.log(usage());
    return { skipped: true };
  }

  if (id === 'all') {
    const selected = enabledSources(sources);
    const runs = [];
    let hardFail = false;
    for (const source of selected) {
      log.log(`--- sede ${source.id} ---`);
      try {
        const run = await runScrapeImpl({
          argv: ['--source', source.id, ...rest],
          sources,
          log
        });
        runs.push({ id: source.id, run });
        if (run.hardFail) hardFail = true;
      } catch (error) {
        hardFail = true;
        log.error(`${source.id} failed: ${error.message}`);
        runs.push({ id: source.id, error: error.message });
      }
    }
    log.log(`Finished ${runs.length} sedi`);
    return { id: 'all', runs, hardFail };
  }

  if (!findSource(id, sources)) {
    throw new Error(`Unknown source: ${id}`);
  }

  return runScrapeImpl({
    argv: ['--source', id, ...rest],
    sources,
    log
  });
}

async function main() {
  const result = await runSede();
  if (result?.hardFail) process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseSedeArgv, runSede, usage };
