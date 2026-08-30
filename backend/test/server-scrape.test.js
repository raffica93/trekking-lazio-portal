const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, requireAdmin } = require('../server');

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        url: `http://127.0.0.1:${port}`
      });
    });
  });
}

test('GET /api/sedi returns the catalog', async () => {
  const app = createApp({ scrapeSede: async () => ({}) });
  const { server, url } = await listen(app);
  try {
    const response = await fetch(`${url}/api/sedi`);
    assert.equal(response.ok, true);
    const body = await response.json();
    assert.equal(Array.isArray(body.sources), true);
    assert.ok(body.sources.some((row) => row.id === 'roma'));
    assert.ok(body.sources.some((row) => row.id === 'sora'));
  } finally {
    server.close();
  }
});

test('POST /api/admin/scrape rejects missing tokens', async () => {
  const app = createApp({ scrapeSede: async () => ({ wrote: true }) });
  const { server, url } = await listen(app);
  try {
    const response = await fetch(`${url}/api/admin/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'roma' })
    });
    assert.equal(response.status, 401);
  } finally {
    server.close();
  }
});

test('POST /api/admin/scrape runs the sede script after admin auth', async () => {
  let ran = null;
  const app = createApp({
    requireAdminImpl: async () => ({ id: 'admin' }),
    scrapeSede: async ({ argv }) => {
      ran = argv;
      return { wrote: true, hardFail: false };
    }
  });
  const { server, url } = await listen(app);
  try {
    const response = await fetch(`${url}/api/admin/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'sora' })
    });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(ran, ['sora']);
    assert.equal(body.source, 'sora');
  } finally {
    server.close();
  }
});

test('requireAdmin checks the profiles.is_admin flag', async () => {
  const calls = [];
  const createClientImpl = () => ({
    auth: {
      async getUser(token) {
        calls.push(token);
        return { data: { user: { id: 'user-1' } }, error: null };
      }
    },
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                async maybeSingle() {
                  return { data: { is_admin: true }, error: null };
                }
              };
            }
          };
        }
      };
    }
  });

  const user = await requireAdmin(
    { headers: { authorization: 'Bearer tok' } },
    {
      env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'service' },
      createClientImpl
    }
  );
  assert.equal(user.id, 'user-1');
  assert.deepEqual(calls, ['tok']);
});
