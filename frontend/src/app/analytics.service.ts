import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private static readonly measurementId = 'G-2ZZKHQPCYC';

  enable(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined' || typeof window.gtag === 'function') return;
    window.dataLayer = window.dataLayer || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${AnalyticsService.measurementId}`;
    document.head.appendChild(script);
    window.gtag = function (..._args: unknown[]): void {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', AnalyticsService.measurementId);
  }

  trackCaiLink(url: string, section: string, linkType: 'sito' | 'agenda' | 'escursione'): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    const params = {
      section,
      link_url: url,
      link_type: linkType,
      page_path: window.location.pathname,
      send_to: AnalyticsService.measurementId
    };

    window.gtag?.('event', 'click_sito_cai', params);
  }
}
