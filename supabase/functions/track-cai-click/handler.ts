export type TrackingFetch = (
  input: string | URL | Request,
  init?: RequestInit
) => Promise<Response>;

export interface TrackingHandlerOptions {
  measurementId: string;
  apiSecret: string;
  fetchImpl?: TrackingFetch;
  timeoutMs?: number;
}

const allowedLinkTypes = new Set(['sito', 'agenda', 'escursione']);

// Keep this narrow: the function is intentionally public and must never become
// a general-purpose open redirect. www. is stripped before matching.
const allowedDestinationHosts = new Set([
  'cai.it',
  'cailazio.org',
  'caialatri.it',
  'caiamatrice.it',
  'caiantrodoco.it',
  'caiaprilia.com',
  'caicassino.com',
  'caicassino.it',
  'caicolleferro.it',
  'caiesperia.it',
  'caifrascati.it',
  'caifrosinone.it',
  'cailatina.com',
  'caileonessa.org',
  'caimonterotondo.it',
  'caipalestrina.it',
  'cairieti.it',
  'cairoma.it',
  'caisora.it',
  'caitivoli.it',
  'caiviterbo.it',
  'caisezionedigallinaro.wordpress.com'
]);

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function safeDestination(raw: string | null): URL | null {
  if (!raw) return null;
  try {
    const destination = new URL(raw);
    if (!['http:', 'https:'].includes(destination.protocol)) return null;
    const hostname = destination.hostname.toLowerCase().replace(/^www\./, '');
    const isAllowed = allowedDestinationHosts.has(hostname) || hostname.endsWith('.cai.it');
    return isAllowed ? destination : null;
  } catch {
    return null;
  }
}

function cleanText(value: string | null, fallback: string, maxLength = 100): string {
  const normalized = (value ?? '').trim().replace(/[\u0000-\u001f\u007f]/g, '');
  return (normalized || fallback).slice(0, maxLength);
}

function cleanAnalyticsId(value: string | null, fallback: string): string {
  const normalized = (value ?? '').trim();
  return /^[A-Za-z0-9._$-]{1,100}$/.test(normalized) ? normalized : fallback;
}

function fallbackClientId(): string {
  const random = crypto.getRandomValues(new Uint32Array(1))[0] || 1;
  return `${random}.${Math.max(1, Math.floor(Date.now() / 1000))}`;
}

function redirect(destination: URL, trackingStatus: 'sent' | 'failed' | 'unconfigured'): Response {
  return new Response(null, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store',
      'Location': destination.toString(),
      'Referrer-Policy': 'no-referrer',
      'X-Tracking-Status': trackingStatus
    }
  });
}

export function measurementPayload(requestUrl: URL, destination: URL): Record<string, unknown> {
  const clientId = cleanAnalyticsId(requestUrl.searchParams.get('client_id'), fallbackClientId());
  const fallbackSessionId = String(Math.max(1, Math.floor(Date.now() / 1000)));
  const sessionIdRaw = cleanAnalyticsId(requestUrl.searchParams.get('session_id'), fallbackSessionId);
  const sessionId = /^\d+$/.test(sessionIdRaw) ? Number(sessionIdRaw) : sessionIdRaw;
  const requestedEngagement = Number(requestUrl.searchParams.get('engagement_time_msec'));
  const engagementTime = Number.isFinite(requestedEngagement)
    ? Math.min(3_600_000, Math.max(1, Math.round(requestedEngagement)))
    : 1;
  const linkType = cleanText(requestUrl.searchParams.get('link_type'), 'sito', 20);

  return {
    client_id: clientId,
    events: [{
      name: 'click_sito_cai',
      params: {
        section: cleanText(requestUrl.searchParams.get('section'), 'Sezione CAI'),
        link_url: destination.toString().slice(0, 100),
        link_domain: destination.hostname.slice(0, 100),
        link_type: allowedLinkTypes.has(linkType) ? linkType : 'sito',
        page_path: cleanText(requestUrl.searchParams.get('page_path'), '/', 100),
        session_id: sessionId,
        engagement_time_msec: engagementTime
      }
    }]
  };
}

export function createTrackingHandler(options: TrackingHandlerOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 1_800;

  return async (request: Request): Promise<Response> => {
    const requestUrl = new URL(request.url);

    if (requestUrl.searchParams.get('health') === '1') {
      const configured = Boolean(options.measurementId && options.apiSecret);
      return json({ ok: configured, configured }, configured ? 200 : 503);
    }

    if (request.method !== 'GET') {
      return json({ error: 'method_not_allowed' }, 405);
    }

    const destination = safeDestination(requestUrl.searchParams.get('destination'));
    if (!destination) {
      return json({ error: 'invalid_destination' }, 400);
    }

    if (!options.measurementId || !options.apiSecret) {
      console.error('track-cai-click: GA4 server configuration missing');
      return redirect(destination, 'unconfigured');
    }

    const gaEndpoint = new URL('https://region1.google-analytics.com/mp/collect');
    gaEndpoint.searchParams.set('measurement_id', options.measurementId);
    gaEndpoint.searchParams.set('api_secret', options.apiSecret);
    const payload = measurementPayload(requestUrl, destination);

    try {
      const gaResponse = await fetchImpl(gaEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!gaResponse.ok) throw new Error(`GA4 returned HTTP ${gaResponse.status}`);
      console.log(JSON.stringify({
        event: 'click_sito_cai',
        section: cleanText(requestUrl.searchParams.get('section'), 'Sezione CAI'),
        linkType: cleanText(requestUrl.searchParams.get('link_type'), 'sito', 20),
        destinationHost: destination.hostname,
        gaStatus: 'sent'
      }));
      return redirect(destination, 'sent');
    } catch (error) {
      console.error('track-cai-click: GA4 delivery failed', error instanceof Error ? error.message : error);
      return redirect(destination, 'failed');
    }
  };
}
