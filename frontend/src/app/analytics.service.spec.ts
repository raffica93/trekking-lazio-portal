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

  it('queues click_sito_cai through gtag after analytics is enabled', () => {
    const service = new AnalyticsService();
    service.enable();

    service.trackCaiLink('https://www.cairoma.it/', 'CAI Roma', 'sito');

    expect(window.dataLayer?.at(-1)).toEqual([
      'event',
      'click_sito_cai',
      {
        section: 'CAI Roma',
        link_url: 'https://www.cairoma.it/',
        link_type: 'sito',
        page_path: window.location.pathname
      }
    ]);
  });
});
