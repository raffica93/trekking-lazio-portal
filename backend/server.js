const express = require('express');
const cors = require('cors');
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');
const { scrapeCaiRoma } = require('./scraper');
const { buildScrapeStatus } = require('./scrape-status');
const { runSede } = require('./scripts/sede');
const { SOURCES } = require('./sources');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'excursions.json');
const STATUS_FILE = path.join(__dirname, 'data', 'scrape-status.json');

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readCachedExcursions() {
  const payload = readJsonFile(DATA_FILE);
  return Array.isArray(payload?.excursions) ? payload.excursions : [];
}

function currentStatus() {
  const existing = readJsonFile(STATUS_FILE) || {};
  const payload = readJsonFile(DATA_FILE) || {};
  return buildScrapeStatus({
    existingStatus: existing,
    excursions: payload.excursions || [],
    generatedAt: existing.generatedAt || payload.generatedAt || new Date().toISOString()
  });
}

async function requireAdmin(req, {
  env = process.env,
  createClientImpl = createClient
} = {}) {
  const header = String(req.headers.authorization || '');
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    const error = new Error('Missing access token');
    error.status = 401;
    throw error;
  }

  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const error = new Error('Admin scrape requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    error.status = 503;
    throw error;
  }

  const supabase = createClientImpl(url, key);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    const err = new Error('Invalid session');
    err.status = 401;
    throw err;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', data.user.id)
    .maybeSingle();
  if (profileError || !profile?.is_admin) {
    const err = new Error('Not an admin');
    err.status = 403;
    throw err;
  }
  return data.user;
}

function createApp({
  scrapeSede = runSede,
  requireAdminImpl = requireAdmin,
  sources = SOURCES
} = {}) {
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/sedi', (_req, res) => {
    res.json(currentStatus());
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

  app.post('/api/admin/scrape', async (req, res) => {
    try {
      await requireAdminImpl(req);
    } catch (error) {
      return res.status(error.status || 401).json({ error: error.message });
    }

    const source = String(req.body?.source || '').trim() || 'all';
    if (source !== 'all' && !sources.some((item) => item.id === source)) {
      return res.status(400).json({ error: `Unknown source: ${source}` });
    }

    try {
      const result = await scrapeSede({ argv: [source] });
      return res.json({
        source,
        hardFail: Boolean(result.hardFail),
        wrote: Boolean(result.wrote),
        status: currentStatus()
      });
    } catch (error) {
      console.error('Admin scrape failed:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });

  return app;
}

const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  createApp,
  currentStatus,
  readCachedExcursions,
  requireAdmin
};
