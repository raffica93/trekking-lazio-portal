const express = require('express');
const cors = require('cors');
const fs = require('node:fs');
const path = require('node:path');
const { scrapeCaiRoma } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'excursions.json');

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

function readCachedExcursions() {
  try {
    const payload = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(payload.excursions) ? payload.excursions : [];
  } catch {
    return [];
  }
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/excursions', async (_req, res) => {
  const cached = readCachedExcursions();
  if (cached.length > 0) {
    res.set('X-Data-Source', 'scheduled-cache');
    return res.json(cached);
  }

  try {
    const excursions = await scrapeCaiRoma();
    if (excursions.length === 0) {
      return res.status(503).json({ error: 'No excursion data available' });
    }
    res.set('X-Data-Source', 'live-scrape');
    return res.json(excursions);
  } catch (error) {
    console.error('Unable to load excursions:', error.message);
    return res.status(503).json({ error: 'Excursion data temporarily unavailable' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = { app, readCachedExcursions };
