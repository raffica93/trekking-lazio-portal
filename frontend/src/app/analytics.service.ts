import { Injectable } from '@angular/core';
import { supabaseRuntimeConfig } from './supabase.config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private static readonly measurementId = 'G-2ZZKHQPCYC';
  private static readonly fallbackClientIdKey = 'trekking-cai-ga-client-id';
  private static readonly fallbackSessionIdKey = 'trekking-cai-ga-session-id';
  private static enabledAt = 0;
  private static clientId = '';
  private static sessionId = '';

  enable(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined' || typeof window.gtag === 'function') return;
    AnalyticsService.enabledAt = Date.now();
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
    window.gtag('get', AnalyticsService.measurementId, 'client_id', (value: unknown) => {
      if (typeof value === 'string' && value) AnalyticsService.clientId = value;
    });
    window.gtag('get', AnalyticsService.measurementId, 'session_id', (value: unknown) => {
      if ((typeof value === 'string' || typeof value === 'number') && String(value)) {
        AnalyticsService.sessionId = String(value);
      }
    });
  }

  /**
   * Rewrites the clicked anchor synchronously. The browser then opens the
   * tracking endpoint first; that endpoint waits for GA4 before redirecting to
   * the CAI destination. Without consent (or Supabase configuration) the
   * original link is left untouched.
   */
  trackCaiLink(
    event: Event,
    url: string,
    section: string,
    linkType: 'sito' | 'agenda' | 'escursione'
  ): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !supabaseRuntimeConfig.supabaseUrl) return;
    const anchor = event.currentTarget;
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const endpoint = new URL('/functions/v1/track-cai-click', supabaseRuntimeConfig.supabaseUrl);
    endpoint.searchParams.set('destination', url);
    endpoint.searchParams.set('section', section);
    endpoint.searchParams.set('link_type', linkType);
    endpoint.searchParams.set('page_path', `${window.location.pathname}${window.location.search}`);
    endpoint.searchParams.set('client_id', this.analyticsId('client'));
    endpoint.searchParams.set('session_id', this.analyticsId('session'));
    endpoint.searchParams.set(
      'engagement_time_msec',
      String(Math.max(1, Date.now() - (AnalyticsService.enabledAt || Date.now())))
    );
    anchor.href = endpoint.toString();
  }

  private analyticsId(kind: 'client' | 'session'): string {
    const fromGtag = kind === 'client' ? AnalyticsService.clientId : AnalyticsService.sessionId;
    if (fromGtag) return fromGtag;

    const cookieName = kind === 'client' ? '_ga' : `_ga_${AnalyticsService.measurementId.slice(2)}`;
    const fromCookie = document.cookie
      .split(';')
      .map(part => part.trim())
      .find(part => part.startsWith(`${cookieName}=`))
      ?.slice(cookieName.length + 1);
    if (fromCookie) return decodeURIComponent(fromCookie);

    const storageKey = kind === 'client'
      ? AnalyticsService.fallbackClientIdKey
      : AnalyticsService.fallbackSessionIdKey;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
    } catch { /* storage non disponibile */ }

    const seconds = Math.max(1, Math.floor(Date.now() / 1000));
    const generated = kind === 'client' ? `${this.randomPositiveInteger()}.${seconds}` : String(seconds);
    try { localStorage.setItem(storageKey, generated); } catch { /* storage non disponibile */ }
    return generated;
  }

  private randomPositiveInteger(): number {
    try {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return Math.max(1, values[0]);
    } catch {
      return Math.max(1, Math.floor(Math.random() * 4_294_967_295));
    }
  }
}
