import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackCaiLink(url: string, section: string, linkType: 'sito' | 'agenda' | 'escursione'): void {
    const params = {
      section,
      link_url: url,
      link_type: linkType,
      page_path: window.location.pathname
    };

    if (window.gtag) {
      window.gtag('event', 'click_sito_cai', params);
      return;
    }

    window.dataLayer?.push(['event', 'click_sito_cai', params]);
  }
}
