import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private enabled = false;

  enable(): void {
    if (this.enabled || typeof document === 'undefined') return;
    this.enabled = true;
    window.dataLayer = window.dataLayer || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2ZZKHQPCYC';
    document.head.appendChild(script);
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag('js', new Date());
    window.gtag('config', 'G-2ZZKHQPCYC');
  }

  trackCaiLink(url: string, section: string, linkType: 'sito' | 'agenda' | 'escursione'): void {
    if (!this.enabled) return;
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
