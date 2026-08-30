const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');
const { parseSedeArgv, runSede } = require('../scripts/sede');
const { runScrape } = require('../scripts/scrape');
const { SOURCES } = require('../sources');

test('parseSedeArgv reads the sede id and forwards flags', () => {
  assert.deepEqual(parseSedeArgv(['tivoli', '--dry-run']), {
    id: 'tivoli',
    rest: ['--dry-run']
  });
});

test('runSede all still walks remaining sedi after a Gemini quota miss', async () => {
  const seen = [];
  const logs = [];
  const result = await runSede({
    argv: ['all'],
    sources: SOURCES.filter((source) => source.id === 'roma' || source.id === 'tivoli' || source.id === 'sora'),
    sleep: async () => {},
    runScrapeImpl: async ({ argv }) => {
      seen.push(argv[1]);
      if (argv.includes('tivoli')) {
        return {
          wrote: false,
          hardFail: true,
          result: {
            failures: [{ error: new Error('You exceeded your current quota, please check your plan and billing') }]
          }
        };
      }
      return { wrote: false, hardFail: false, result: { failures: [] } };
    },
    log: { log: (message) => logs.push(String(message)), error() {} }
  });

  assert.deepEqual(seen, ['roma', 'tivoli', 'sora']);
  assert.equal(logs.some((line) => /quota exhausted earlier/.test(line)), true);
  assert.equal(result.hardFail, true);
});

test('runSede all walks enabled sources in order and keeps going after a failure', async () => {
  const seen = [];
  const result = await runSede({
    argv: ['all'],
    sources: SOURCES.filter((source) => source.id === 'roma' || source.id === 'sora'),
    runScrapeImpl: async ({ argv }) => {
      seen.push(argv);
      if (argv.includes('sora')) {
        throw new Error('Gemini down');
      }
      return { wrote: false, hardFail: false };
    },
    log: { log() {}, error() {} }
  });

  assert.deepEqual(seen, [
    ['--source', 'roma'],
    ['--source', 'sora']
  ]);
  assert.equal(result.hardFail, true);
  assert.equal(result.runs.length, 2);
});

test('runScrape writes scrape-status.json for the selected sede', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sede-scrape-'));
  const dataPath = path.join(dir, 'excursions.json');
  const statusFile = path.join(dir, 'scrape-status.json');

  const result = await runScrape({
    argv: ['--source', 'roma'],
    dataPath,
    statusFile,
    sources: SOURCES.filter((source) => source.id === 'roma'),
    scrapeAllImpl: async () => ({
      excursions: [{
        id: 'roma-aaa',
        title: 'Monte Viglio',
        date: '2026-09-12',
        organizer: 'CAI Roma'
      }],
      sources: [{ id: 'roma', organizer: 'CAI Roma', url: 'https://www.cairoma.it/', kind: 'html' }],
      sourceHashes: {},
      failures: [],
      hardFailures: [],
      results: [{
        source: SOURCES.find((source) => source.id === 'roma'),
        status: 'ok',
        excursions: [{ id: 'roma-aaa' }],
        hash: null
      }]
    }),
    log: { log() {}, error() {} }
  });

  assert.equal(result.wrote, true);
  const status = JSON.parse(await fs.readFile(statusFile, 'utf8'));
  assert.equal(status.sources.find((row) => row.id === 'roma').status, 'ok');
  assert.equal(status.sources.find((row) => row.id === 'roma').excursions, 1);
});
