import { AnalyticsService } from './analytics.service';
import { supabaseRuntimeConfig } from './supabase.config';

describe('AnalyticsService', () => {
  const originalSupabaseUrl = supabaseRuntimeConfig.supabaseUrl;

  beforeEach(() => {
    supabaseRuntimeConfig.supabaseUrl = 'https://project-ref.supabase.co';
  });

  afterEach(() => {
    document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').forEach(script => script.remove());
    delete window.dataLayer;
    delete window.gtag;
    localStorage.removeItem('trekking-cai-ga-client-id');
    localStorage.removeItem('trekking-cai-ga-session-id');
    supabaseRuntimeConfig.supabaseUrl = originalSupabaseUrl;
  });

  it('leaves CAI links untouched before analytics consent', () => {
    const service = new AnalyticsService();
    const anchor = document.createElement('a');
    anchor.href = 'https://www.cairoma.it/';

    service.trackCaiLink(
      { currentTarget: anchor } as unknown as Event,
      anchor.href,
      'CAI Roma',
      'sito'
    );

    expect(anchor.href).toBe('https://www.cairoma.it/');
    expect(window.dataLayer).toBeUndefined();
  });

  it('routes a CAI link through the dedicated endpoint from another service instance', () => {
    const initializer = new AnalyticsService();
    const lazyRouteService = new AnalyticsService();
    const anchor = document.createElement('a');
    anchor.href = 'https://www.cairoma.it/?page_id=582';
    initializer.enable();

    lazyRouteService.trackCaiLink(
      { currentTarget: anchor } as unknown as Event,
      'https://www.cairoma.it/?page_id=582',
      'CAI Roma',
      'sito'
    );

    const trackingUrl = new URL(anchor.href);
    expect(trackingUrl.origin).toBe('https://project-ref.supabase.co');
    expect(trackingUrl.pathname).toBe('/functions/v1/track-cai-click');
    expect(trackingUrl.searchParams.get('destination')).toBe('https://www.cairoma.it/?page_id=582');
    expect(trackingUrl.searchParams.get('section')).toBe('CAI Roma');
    expect(trackingUrl.searchParams.get('link_type')).toBe('sito');
    expect(trackingUrl.searchParams.get('client_id')).toMatch(/^\d+\.\d+$/);
    expect(trackingUrl.searchParams.get('session_id')).toMatch(/^\d+$/);

    const queuedCommands = (window.dataLayer ?? []).map(command => Array.from(command as IArguments));
    expect(queuedCommands.some(command => command[0] === 'event' && command[1] === 'click_sito_cai')).toBe(false);
  });
});
