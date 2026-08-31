import assert from 'node:assert/strict';
import test from 'node:test';
import { createTrackingHandler } from './handler.ts';

function request(destination = 'https://www.cairoma.it/?page_id=582'): Request {
  const url = new URL('https://example.supabase.co/functions/v1/track-cai-click');
  url.searchParams.set('destination', destination);
  url.searchParams.set('section', 'CAI Roma');
  url.searchParams.set('link_type', 'sito');
  url.searchParams.set('page_path', '/info');
  url.searchParams.set('client_id', '123456.789012');
  url.searchParams.set('session_id', '1788188160');
  url.searchParams.set('engagement_time_msec', '250');
  return new Request(url);
}

test('waits for GA4 and then redirects to the CAI destination', async () => {
  let gaCompleted = false;
  let sentPayload: Record<string, unknown> | undefined;
  const handler = createTrackingHandler({
    measurementId: 'G-2ZZKHQPCYC',
    apiSecret: 'server-only-secret',
    fetchImpl: async (_input, init) => {
      sentPayload = JSON.parse(String(init?.body));
      await Promise.resolve();
      gaCompleted = true;
      return new Response(null, { status: 204 });
    }
  });

  const response = await handler(request());

  assert.equal(gaCompleted, true);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://www.cairoma.it/?page_id=582');
  assert.equal(response.headers.get('x-tracking-status'), 'sent');
  assert.deepEqual(sentPayload, {
    client_id: '123456.789012',
    events: [{
      name: 'click_sito_cai',
      params: {
        section: 'CAI Roma',
        link_url: 'https://www.cairoma.it/?page_id=582',
        link_domain: 'www.cairoma.it',
        link_type: 'sito',
        page_path: '/info',
        session_id: 1788188160,
        engagement_time_msec: 250
      }
    }]
  });
});

test('cannot be used as an open redirect', async () => {
  let called = false;
  const handler = createTrackingHandler({
    measurementId: 'G-2ZZKHQPCYC',
    apiSecret: 'server-only-secret',
    fetchImpl: async () => {
      called = true;
      return new Response(null, { status: 204 });
    }
  });

  const response = await handler(request('https://attacker.example/phishing'));

  assert.equal(response.status, 400);
  assert.equal(called, false);
  assert.deepEqual(await response.json(), { error: 'invalid_destination' });
});

test('does not block the destination when GA4 is temporarily unavailable', async () => {
  const handler = createTrackingHandler({
    measurementId: 'G-2ZZKHQPCYC',
    apiSecret: 'server-only-secret',
    fetchImpl: async () => { throw new Error('network unavailable'); }
  });

  const response = await handler(request());

  assert.equal(response.status, 302);
  assert.equal(response.headers.get('x-tracking-status'), 'failed');
  assert.equal(response.headers.get('location'), 'https://www.cairoma.it/?page_id=582');
});

test('health check reports whether the GA4 secret is configured', async () => {
  const handler = createTrackingHandler({ measurementId: 'G-2ZZKHQPCYC', apiSecret: '' });
  const response = await handler(new Request(
    'https://example.supabase.co/functions/v1/track-cai-click?health=1'
  ));

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, configured: false });
});
