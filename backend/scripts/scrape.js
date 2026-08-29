const fs = require('node:fs/promises');
const path = require('node:path');
const { scrapeCaiRoma, CAI_ROMA_URL } = require('../scraper');

const outputPath = path.join(__dirname, '..', 'data', 'excursions.json');

async function readExisting() {
  try {
    return JSON.parse(await fs.readFile(outputPath, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const excursions = await scrapeCaiRoma();
  if (excursions.length === 0) {
    throw new Error('Scraping returned no upcoming excursions; cache left unchanged');
  }

  const existing = await readExisting();
  if (JSON.stringify(existing?.excursions) === JSON.stringify(excursions)) {
    console.log(`No changes: ${excursions.length} upcoming excursions`);
    return;
  }

  const payload = {
    source: CAI_ROMA_URL,
    generatedAt: new Date().toISOString(),
    excursions
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, outputPath);
  console.log(`Updated cache with ${excursions.length} upcoming excursions`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
