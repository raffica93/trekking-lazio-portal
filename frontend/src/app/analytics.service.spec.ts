import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  afterEach(() => {
    document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').forEach(script => script.remove());
    delete window.dataLayer;
    delete window.gtag;
  });

  it('does not track CAI links before analytics consent', () => {
    const service = new AnalyticsService();

    service.trackCaiLink('https://www.cairoma.it/', 'CAI Roma', 'sito');

    expect(window.dataLayer).toBeUndefined();
  });

  it('queues click_sito_cai through gtag even from another service instance', () => {
    const initializer = new AnalyticsService();
    const lazyRouteService = new AnalyticsService();
    initializer.enable();

    lazyRouteService.trackCaiLink('https://www.cairoma.it/', 'CAI Roma', 'sito');

    expect(Array.from(window.dataLayer?.at(-1) as IArguments)).toEqual([
      'event',
      'click_sito_cai',
      {
        section: 'CAI Roma',
        link_url: 'https://www.cairoma.it/',
        link_type: 'sito',
        page_path: window.location.pathname,
        send_to: 'G-2ZZKHQPCYC'
      }
    ]);
  });
});
