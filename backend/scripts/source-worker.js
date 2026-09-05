// Every section has an isolated process and a source-specific configuration, with shared format parsers.
const { scrapeDeterministic } = require('../adapters/deterministic');
process.once('message', async ({ source, options }) => {
  try {
    const result = await scrapeDeterministic(source, options);
    if (process.send) process.send({ ok: true, result }, () => process.disconnect());
  } catch (error) {
    if (process.send) process.send({ ok: false, error: error.message, details: error.details }, () => process.disconnect());
  }
});
