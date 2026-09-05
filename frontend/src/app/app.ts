import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, DOCUMENT, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExcursionService } from './portal/excursion.service';
import { Excursion } from './shared/excursion.model';
import { ExcursionCardComponent } from './portal/excursion-card/excursion-card.component';
import { FilterBarComponent } from './portal/filter-bar/filter-bar.component';
import { MapComponent } from './portal/map/map.component';
import { FilterState, applyFilters, landingFilters, currentYearMonth, currentMonthStart, currentAndFutureExcursions } from './shared/excursion-filters';
import { formatDateRange, nights } from './shared/excursion-dates';
import { primaryDifficulty } from './shared/difficulty';
import { sectionColor } from './shared/section-color';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { AnalyticsService } from './core/analytics.service';

registerLocaleData(localeIt);

const COOKIE_CONSENT_STORAGE_KEY = 'trekking-cai-cookie-consent';
const SITE_ORIGIN = 'https://trekking-cai.it';
const CONTENT_PAGE_PATH = /(^|\/)(info|servizi|termini|privacy)\/?$/;
const PAGE_SEO = [
  { test: /servizi\/?$/, title: 'Servizi | Trekking CAI', description: 'Come funziona il portale Trekking CAI e come usare le informazioni sulle escursioni.', path: '/servizi' },
  { test: /termini\/?$/, title: 'Termini e condizioni | Trekking CAI', description: 'Termini e condizioni d’uso del portale Trekking CAI.', path: '/termini' },
  { test: /privacy\/?$/, title: 'Privacy | Trekking CAI', description: 'Informazioni sulla privacy di Trekking CAI.', path: '/privacy' },
  { test: /info\/?$/, title: 'Info CAI Italia | Trekking CAI', description: 'Informazioni sul CAI e sulle sezioni d’Italia.', path: '/info' }
] as const;
const DEFAULT_SEO = {
  title: 'Trekking CAI | Escursioni CAI in Italia',
  description: 'Scopri le prossime escursioni CAI in Italia: calendario aggiornato, mappa interattiva e informazioni dalle sezioni italiane.',
  path: '/'
} as const;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ExcursionCardComponent,
    FilterBarComponent,
    MapComponent,
    RouterLink,
    RouterOutlet
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private excursionService = inject(ExcursionService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  protected analytics = inject(AnalyticsService);
  @ViewChild('excursionList') private excursionList?: ElementRef<HTMLElement>;
  
  allExcursions: Excursion[] = [];
  excursions: Excursion[] = [];
  loading = true;
  loadError = false;
  usingSnapshot = false;
  private calendarMonth = currentYearMonth();
  filters: FilterState = landingFilters();
  selectedId: string | null = null;
  detailOpen = false;
  mobileView: 'calendar' | 'map' = 'calendar';
  onContentPage = false;
  showCookieBanner = false;
  readonly currentYear = new Date().getFullYear();

  ngOnInit() {
    const cookieConsent = this.readCookieConsent();
    this.showCookieBanner = cookieConsent === null;
    if (cookieConsent === true) this.analytics.enable();
    this.syncRoute(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.syncRoute(event.urlAfterRedirects);
        this.changeDetector.markForCheck();
      });
    this.fetchExcursions();
  }

  setCookieConsent(analyticsAllowed: boolean): void {
    try { localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, analyticsAllowed ? 'accepted' : 'rejected'); } catch { /* storage non disponibile: la scelta resta valida per la sessione */ }
    this.showCookieBanner = false;
    if (analyticsAllowed) this.analytics.enable();
    this.changeDetector.markForCheck();
  }

  openCookieSettings(): void {
    this.showCookieBanner = true;
    this.changeDetector.markForCheck();
  }

  private readCookieConsent(): boolean | null {
    try {
      const value = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      return value === 'accepted' ? true : value === 'rejected' ? false : null;
    } catch { return null; }
  }

  fetchExcursions() {
    this.loading = true;
    this.loadError = false;
    this.excursionService.getExcursions().subscribe({
      next: (data) => {
        this.allExcursions = data;
        this.usingSnapshot = this.excursionService.source === 'snapshot';
        this.applyFilters();
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.loading = false;
        this.loadError = true;
        this.changeDetector.markForCheck();
      }
    });
  }

  get selectedExcursion(): Excursion | null {
    return this.excursions.find(excursion => excursion.id === this.selectedId) ?? null;
  }

  get coveredSections(): number { return new Set(this.allExcursions.map(item => item.organizer)).size; }
  get visibleExcursions(): Excursion[] { return this.excursions; }
  trackExcursion(_index: number, excursion: Excursion): string { return excursion.id; }

  @HostListener('document:visibilitychange')
  @HostListener('window:focus')
  refreshCalendarMonth(): void {
    if (this.calendarMonth === currentYearMonth()) return;
    this.calendarMonth = currentYearMonth();
    this.allExcursions = currentAndFutureExcursions(this.allExcursions);
    if (this.filters.month !== 'all' && this.filters.month < this.calendarMonth) this.filters = { ...this.filters, month: this.calendarMonth };
    if (this.filters.dateTo && this.filters.dateTo < currentMonthStart()) this.filters = { ...this.filters, dateFrom: '', dateTo: '' };
    else if (this.filters.dateFrom && this.filters.dateFrom < currentMonthStart()) this.filters = { ...this.filters, dateFrom: currentMonthStart() };
    this.applyFilters();
  }

  onFiltersChange(filters: FilterState) {
    this.filters = filters;
    this.applyFilters();
  }

  resetFilters() {
    this.filters = landingFilters();
    this.applyFilters();
  }

  onCardSelect(excursion: Excursion) {
    this.selectedId = excursion.id;
    this.detailOpen = true;
    this.mobileView = 'map';
    this.changeDetector.markForCheck();
  }

  onMapSelect(excursion: Excursion) {
    this.selectedId = excursion.id;
    this.detailOpen = true;
    this.changeDetector.detectChanges();
    this.scrollSelectedIntoView();
  }

  setMobileView(view: 'calendar' | 'map') {
    this.mobileView = view;
    this.changeDetector.markForCheck();
  }

  clearSelection() {
    this.selectedId = null;
    this.detailOpen = false;
    this.changeDetector.markForCheck();
  }

  tone(excursion: Excursion) {
    return primaryDifficulty(excursion.category);
  }

  hasCoords(excursion: Excursion): boolean {
    return excursion.lat != null && excursion.lng != null
      && Number.isFinite(Number(excursion.lat)) && Number.isFinite(Number(excursion.lng));
  }

  positionNote(excursion: Excursion): string {
    return ['source', 'exact', 'trailhead'].includes(excursion.coordinatesQuality || '')
      ? 'Coordinate della fonte. Verifica il punto di ritrovo nel programma CAI.'
      : 'Posizione indicativa della zona: non identifica il punto di ritrovo.';
  }

  placeLine(excursion: Excursion): string {
    return [excursion.location, excursion.region, excursion.startPlace].filter(Boolean).join(' · ');
  }

  dateLabel(excursion: Excursion): string {
    return formatDateRange(excursion.date, excursion.dateEnd, 'long');
  }

  metaItems(excursion: Excursion): { label: string; value: string; color?: string }[] {
    const items: { label: string; value: string; color?: string }[] = [];
    if (excursion.days && excursion.days > 1) {
      items.push({ label: 'Durata', value: `${excursion.days} giorni` });
    }
    const nightCount = nights(excursion.days);
    if (nightCount >= 1) {
      items.push({ label: 'Notti', value: `${nightCount} ${nightCount === 1 ? 'notte' : 'notti'}` });
    }
    if (excursion.distanceKm != null) {
      items.push({ label: 'Distanza', value: `${excursion.distanceKm} km` });
    }
    if (excursion.elevationM != null) {
      items.push({ label: 'Quota', value: `${excursion.elevationM} m` });
    }
    if (this.isUseful(excursion.time)) {
      items.push({ label: 'Tempo', value: excursion.time });
    }
    if (this.isUseful(excursion.cost)) {
      items.push({ label: 'Costo', value: excursion.cost });
    }
    if (this.isUseful(excursion.transport)) {
      items.push({ label: 'Trasporto', value: excursion.transport! });
    }
    if (this.isUseful(excursion.organizer)) {
      items.push({
        label: 'Organizzatore',
        value: excursion.organizer,
        color: sectionColor(excursion.organizer)
      });
    }
    if (excursion.organizerRegion) items.push({ label: 'Regione del CAI', value: excursion.organizerRegion });
    if (this.isUseful(excursion.terrain)) {
      items.push({ label: 'Terreno', value: excursion.terrain! });
    }
    return items;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.detailOpen) {
      this.clearSelection();
    }
  }

  private syncRoute(url: string) {
    const path = url.split('?')[0].split('#')[0];
    this.onContentPage = CONTENT_PAGE_PATH.test(path);
    const seo = PAGE_SEO.find(entry => entry.test.test(path)) ?? DEFAULT_SEO;
    const canonicalUrl = `${SITE_ORIGIN}${seo.path}`;
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  }

  private applyFilters() {
    this.excursions = applyFilters(this.allExcursions, this.filters);
    this.excursionList?.nativeElement.scrollTo?.({ top: 0 });
    if (this.selectedId && !this.excursions.some(excursion => excursion.id === this.selectedId)) {
      this.selectedId = null;
      this.detailOpen = false;
    }
    this.changeDetector.markForCheck();
  }

  private scrollSelectedIntoView() {
    const card = this.excursionList?.nativeElement.querySelector(
      `[data-excursion-id="${this.selectedId}"]`
    );
    if (card && typeof card.scrollIntoView === 'function') {
      card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  private isUseful(value?: string | null): boolean {
    return Boolean(value) && !/^vedi sito$/i.test(value!.trim());
  }
}
