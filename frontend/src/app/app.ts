import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, DOCUMENT, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExcursionService } from './excursion.service';
import { Excursion } from './excursion.model';
import { ExcursionCardComponent } from './excursion-card.component';
import { FilterBarComponent } from './filter-bar.component';
import { MapComponent } from './map.component';
import { FilterState, applyFilters, landingFilters, DEFAULT_FILTERS } from './excursion-filters';
import { formatDateRange, nights } from './excursion-dates';
import { primaryDifficulty } from './difficulty';
import { sectionColor } from './section-color';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { AnalyticsService } from './analytics.service';

registerLocaleData(localeIt);

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
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-stone-100 text-slate-900">
      <!-- Header -->
      <header class="z-20 border-b border-emerald-950/20 bg-emerald-900 px-3 py-3 text-white shadow-lg md:px-6">
        <div class="mx-auto flex max-w-screen-2xl items-center gap-2.5 md:gap-3">
          <a
            routerLink="/"
            class="flex min-w-0 items-center gap-2.5 text-inherit no-underline md:gap-3"
            aria-label="Trekking CAI, torna alla mappa"
          >
            <img
              src="logo.svg"
              width="40"
              height="40"
              alt=""
              class="h-9 w-9 shrink-0 rounded-[0.7rem] object-cover shadow-sm md:h-10 md:w-10"
            >
            <div class="flex min-w-0 items-center gap-2">
              <span class="truncate text-lg font-black tracking-[-0.04em] md:text-2xl">TREKKING CAI</span>
              <span class="rounded-sm bg-lime-300 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-emerald-950">PORTAL</span>
            </div>
          </a>
          <a
            routerLink="/info"
            class="ml-auto shrink-0 rounded-md border border-lime-300/40 bg-lime-300 px-2.5 py-1 text-xs font-black tracking-wide text-emerald-950 no-underline md:px-3 md:text-sm"
            aria-label="Info"
          >Info</a>
        </div>
      </header>

      <app-filter-bar
        *ngIf="!onContentPage"
        class="relative z-30 w-full shrink-0"
        [filters]="filters"
        [allExcursions]="allExcursions"
        [resultCount]="excursions.length"
        (filtersChange)="onFiltersChange($event)"
      ></app-filter-bar>

      <!-- Main Content -->
      <main *ngIf="!onContentPage" class="portal-main relative z-0 flex min-h-0 flex-1 overflow-hidden md:flex-row">
        <h1 class="sr-only">Escursioni CAI nel Lazio</h1>
        <!-- Sidebar / List -->
        <aside
          class="calendar-pane flex h-full w-full shrink-0 flex-col border-r border-stone-200 bg-stone-50 md:w-[24rem] lg:w-[27rem]"
          [class.mobile-pane-active]="mobileView === 'calendar'"
        >
          <div class="flex items-center justify-end border-b border-stone-200 bg-white px-4 py-2">
            <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold tabular-nums text-emerald-900">{{ excursions.length }}</span>
          </div>
          
          <div #excursionList class="flex-1 overflow-y-auto p-3 md:p-4">
            <div *ngIf="loading" class="flex justify-center p-8">
               <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
            
            <ng-container *ngIf="!loading">
              <app-excursion-card 
                *ngFor="let ex of excursions" 
                [excursion]="ex"
                [selected]="ex.id === selectedId"
                (selectExcursion)="onCardSelect($event)"
              ></app-excursion-card>
              
              <div *ngIf="excursions.length === 0" class="text-center p-8 text-slate-500">
                <p>Nessuna escursione con questi filtri.</p>
                <button
                  type="button"
                  class="mt-3 text-sm font-bold text-emerald-800 underline"
                  (click)="resetFilters()"
                >Azzera filtri</button>
              </div>
            </ng-container>
          </div>
        </aside>

        <!-- Map -->
        <section
          class="map-pane relative min-h-0 min-w-0 flex-1 overflow-hidden md:flex"
          [class.mobile-pane-active]="mobileView === 'map'"
        >
          @defer (on viewport; prefetch on idle) {
            <app-map
              [excursions]="excursions"
              [selectedId]="selectedId"
              class="h-full w-full"
              (selectExcursion)="onMapSelect($event)"
            ></app-map>
          } @placeholder {
            <div class="map-placeholder" aria-label="Caricamento della mappa">
              <span>Caricamento mappa…</span>
            </div>
          }

          <article
            *ngIf="selectedExcursion && detailOpen"
            class="detail-sheet"
            tabindex="-1"
            aria-label="Dettaglio escursione"
          >
            <div class="detail-header">
              <p class="detail-kicker">
                {{ dateLabel(selectedExcursion) }}
                <span
                  class="difficulty-chip"
                  [style.background-color]="tone(selectedExcursion).color"
                >{{ tone(selectedExcursion).code }}</span>
              </p>
              <button
                type="button"
                class="detail-close"
                aria-label="Chiudi dettaglio"
                (click)="clearSelection()"
              >×</button>
            </div>
            <h2>{{ selectedExcursion.title }}</h2>
            <p class="detail-place">{{ placeLine(selectedExcursion) }}</p>
            <p *ngIf="!hasCoords(selectedExcursion)" class="detail-note">Posizione da confermare</p>
            <p *ngIf="selectedExcursion.summary" class="detail-summary">{{ selectedExcursion.summary }}</p>
            <dl class="detail-meta" *ngIf="metaItems(selectedExcursion).length">
              <div *ngFor="let item of metaItems(selectedExcursion)">
                <dt>{{ item.label }}</dt>
                <dd>
                  <span class="section-tag" *ngIf="item.color; else plainMeta">
                    <span
                      class="section-dot"
                      [style.background-color]="item.color"
                      aria-hidden="true"
                    ></span>
                    {{ item.value }}
                  </span>
                  <ng-template #plainMeta>{{ item.value }}</ng-template>
                </dd>
              </div>
            </dl>
            <p *ngIf="selectedExcursion.difficultyNote" class="detail-note">{{ selectedExcursion.difficultyNote }}</p>
            <a
              class="detail-cta"
              [href]="selectedExcursion.link"
              target="_blank"
              rel="noopener noreferrer"
              data-cai-track
              [attr.data-cai-section]="selectedExcursion.organizer"
              data-cai-link-type="escursione"
            >Dettagli</a>
          </article>
        </section>
      </main>
      <nav *ngIf="!onContentPage" class="mobile-view-tabs" aria-label="Scegli visualizzazione">
        <button
          type="button"
          [class.is-active]="mobileView === 'calendar'"
          [attr.aria-pressed]="mobileView === 'calendar'"
          (click)="setMobileView('calendar')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v3M18 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M8 13h3v3H8z"/></svg>
          <span>Calendario</span>
        </button>
        <button
          type="button"
          [class.is-active]="mobileView === 'map'"
          [attr.aria-pressed]="mobileView === 'map'"
          (click)="setMobileView('map')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18-5 2V6l5-2 6 2 5-2v14l-5 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>
          <span>Mappa</span>
        </button>
      </nav>
      <footer class="site-footer" aria-label="Informazioni del sito">
        <span>© {{ currentYear }} Trekking CAI</span>
        <span class="footer-note">Escursioni pubblicate dalle sezioni CAI del Lazio</span>
        <nav aria-label="Link nel footer">
          <a routerLink="/servizi">Servizi</a>
          <a routerLink="/termini">Termini e condizioni</a>
          <a routerLink="/privacy">Privacy</a>
          <button type="button" class="cookie-settings" (click)="openCookieSettings()">Cookie</button>
        </nav>
      </footer>
      <aside *ngIf="showCookieBanner" class="cookie-banner" aria-labelledby="cookie-title" role="dialog">
        <div class="cookie-copy">
          <p class="cookie-label">La tua privacy</p>
          <h2 id="cookie-title">Cookie essenziali e analisi opzionale</h2>
          <p>Usiamo solo ciò che serve al funzionamento del portale. Con il tuo consenso possiamo usare Google Analytics per capire quali contenuti sono più utili. Puoi cambiare scelta in qualsiasi momento.</p>
          <a routerLink="/privacy">Leggi la privacy</a>
        </div>
        <div class="cookie-actions">
          <button type="button" class="cookie-button cookie-button-secondary" (click)="setCookieConsent(false)">Solo necessari</button>
          <button type="button" class="cookie-button cookie-button-primary" (click)="setCookieConsent(true)">Accetta analisi</button>
        </div>
      </aside>
      <router-outlet class="hidden" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .detail-sheet {
      position: absolute;
      right: 0.75rem;
      bottom: 0.75rem;
      left: 0.75rem;
      z-index: 1100;
      display: grid;
      gap: 0.55rem;
      max-height: min(62vh, 34rem);
      overflow: auto;
      padding: 1rem 1.05rem 1.1rem;
      border: 1px solid rgb(28 25 23 / 0.12);
      border-radius: 0.75rem;
      background: rgb(255 255 255 / 0.97);
      box-shadow: 0 16px 40px rgb(18 38 28 / 0.18);
    }

    .cookie-banner {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
      z-index: 2000;
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1.25rem;
      max-width: 54rem;
      margin: 0 auto;
      padding: 1rem 1.1rem;
      border: 1px solid rgb(28 25 23 / .14);
      border-radius: .8rem;
      background: rgb(255 255 255 / .98);
      box-shadow: 0 18px 45px rgb(18 38 28 / .2);
    }

    .cookie-copy { min-width: 0; }
    .cookie-label { margin: 0 0 .25rem; color: #3f6212; font: 700 .68rem/1.2 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }
    .cookie-copy h2 { margin: 0 0 .35rem; font-size: 1rem; letter-spacing: -.02em; }
    .cookie-copy > p:not(.cookie-label) { margin: 0; color: #57534e; font-size: .82rem; line-height: 1.45; }
    .cookie-copy a { display: inline-block; margin-top: .35rem; color: #14532d; font-size: .8rem; font-weight: 800; }
    .cookie-actions { display: flex; flex-shrink: 0; gap: .5rem; }
    .cookie-button { border-radius: .45rem; padding: .65rem .8rem; font-size: .78rem; font-weight: 800; cursor: pointer; }
    .cookie-button-secondary { border: 1px solid #d6d3d1; background: #fff; color: #14532d; }
    .cookie-button-primary { border: 1px solid #14532d; background: #14532d; color: #fff; }
    .cookie-button:focus-visible, .cookie-settings:focus-visible { outline: 3px solid #bef264; outline-offset: 2px; }
    .cookie-settings { border: 0; padding: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
    @media (max-width: 640px) {
      .cookie-banner { align-items: stretch; flex-direction: column; gap: .8rem; }
      .cookie-actions { justify-content: stretch; }
      .cookie-button { flex: 1; }
    }

    .map-placeholder {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
      background:
        radial-gradient(circle at 20% 20%, rgb(236 253 208 / 0.8), transparent 35%),
        #e7efe6;
      color: #3f6212;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .mobile-view-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.3rem;
      flex-shrink: 0;
      padding: 0.4rem 0.6rem calc(0.4rem + env(safe-area-inset-bottom));
      border-top: 1px solid rgb(6 78 59 / 0.16);
      background: rgb(255 255 255 / 0.96);
      box-shadow: 0 -8px 24px rgb(18 38 28 / 0.08);
      backdrop-filter: blur(12px);
    }

    .mobile-view-tabs button {
      display: flex;
      min-height: 2.8rem;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: 0;
      border-radius: 0.7rem;
      background: transparent;
      color: #64748b;
      font: inherit;
      font-size: 0.76rem;
      font-weight: 800;
      cursor: pointer;
    }

    .mobile-view-tabs button.is-active {
      background: #064e3b;
      color: #ecfccb;
      box-shadow: 0 4px 12px rgb(6 78 59 / 0.18);
    }

    .mobile-view-tabs button:focus-visible {
      outline: 2px solid #65a30d;
      outline-offset: 2px;
    }

    .mobile-view-tabs svg {
      width: 1.15rem;
      height: 1.15rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.8;
    }

    @media (max-width: 767px) {
      .calendar-pane,
      .map-pane {
        display: none;
      }

      .calendar-pane.mobile-pane-active {
        display: flex;
      }

      .map-pane.mobile-pane-active {
        display: flex;
      }

      .detail-sheet {
        bottom: 0.55rem;
      }
    }

    @media (min-width: 768px) {
      .mobile-view-tabs {
        display: none;
      }
    }

    .site-footer {
      display: flex;
      min-height: 2.5rem;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25rem 1rem;
      padding: 0.45rem 1rem;
      border-top: 1px solid rgb(6 78 59 / 0.22);
      background: #123f34;
      color: #d9e8dd;
      font-size: 0.68rem;
      line-height: 1.3;
    }

    .footer-note { color: #a8c6b7; }
    .site-footer nav { display: flex; gap: 0.8rem; margin-left: auto; }
    .site-footer a { color: #ecfccb; font-weight: 700; text-decoration: none; }
    .site-footer a:hover, .site-footer a:focus-visible { text-decoration: underline; }
    @media (max-width: 640px) { .site-footer nav { width: 100%; margin-left: 0; } .footer-note { display: none; } }

    .detail-sheet h2 {
      margin: 0;
      color: #1c1917;
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.25;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .detail-kicker {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin: 0;
      color: #57534e;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: capitalize;
    }

    .detail-place,
    .detail-summary,
    .detail-note {
      margin: 0;
      color: #44403c;
      font-size: 13px;
      line-height: 1.45;
    }

    .detail-note {
      color: #57534e;
      font-size: 12px;
    }

    .detail-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.55rem 0.75rem;
      margin: 0.15rem 0 0;
    }

    .detail-meta div {
      min-width: 0;
    }

    .detail-meta dt {
      color: #78716c;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .detail-meta dd {
      margin: 0.1rem 0 0;
      color: #1c1917;
      font-size: 13px;
    }

    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      min-height: 1.4rem;
      padding: 0.12rem 0.5rem 0.12rem 0.35rem;
      border: 1px solid rgb(28 25 23 / 0.08);
      border-radius: 999px;
      background: #f6f8f6;
      color: #1c1917;
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
    }

    .section-dot {
      width: 0.5rem;
      height: 0.5rem;
      flex-shrink: 0;
      border-radius: 999px;
      box-shadow: 0 0 0 1.5px rgb(255 255 255 / 0.9);
    }

    .detail-cta {
      justify-self: start;
      margin-top: 0.2rem;
      padding: 0.45rem 0.8rem;
      border-radius: 0.45rem;
      background: #065f46;
      color: #ecfccb;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
    }

    .detail-close {
      flex-shrink: 0;
      width: 1.8rem;
      height: 1.8rem;
      border: 0;
      border-radius: 999px;
      background: rgb(245 245 244);
      color: #44403c;
      font-size: 1.35rem;
      line-height: 1;
      cursor: pointer;
    }

    .difficulty-chip {
      display: inline-flex;
      min-width: 1.75rem;
      height: 1.5rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      padding: 0 0.4rem;
      color: #fff;
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: none;
    }

    @media (min-width: 768px) {
      .detail-sheet {
        left: auto;
        width: 26rem;
      }
    }
  `]
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
    try { localStorage.setItem('trekking-cai-cookie-consent', analyticsAllowed ? 'accepted' : 'rejected'); } catch { /* storage non disponibile: la scelta resta valida per la sessione */ }
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
      const value = localStorage.getItem('trekking-cai-cookie-consent');
      return value === 'accepted' ? true : value === 'rejected' ? false : null;
    } catch { return null; }
  }

  fetchExcursions() {
    this.loading = true;
    this.excursionService.getExcursions().subscribe({
      next: (data) => {
        this.allExcursions = data;
        this.applyFilters();
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.loading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  get selectedExcursion(): Excursion | null {
    return this.excursions.find(excursion => excursion.id === this.selectedId) ?? null;
  }

  onFiltersChange(filters: FilterState) {
    this.filters = filters;
    this.applyFilters();
  }

  resetFilters() {
    this.filters = { ...DEFAULT_FILTERS };
    this.applyFilters();
  }

  onCardSelect(excursion: Excursion) {
    this.selectedId = excursion.id;
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
    return Number.isFinite(excursion.lat) && Number.isFinite(excursion.lng);
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
    this.onContentPage = /(^|\/)(info|servizi|termini|privacy)\/?$/.test(path);
    const seo = /servizi\/?$/.test(path)
      ? ['Servizi | Trekking CAI', 'Come funziona il portale Trekking CAI e come usare le informazioni sulle escursioni.', '/servizi']
      : /termini\/?$/.test(path)
        ? ['Termini e condizioni | Trekking CAI', 'Termini e condizioni d’uso del portale Trekking CAI.', '/termini']
        : /privacy\/?$/.test(path)
          ? ['Privacy | Trekking CAI', 'Informazioni sulla privacy di Trekking CAI.', '/privacy']
          : /info\/?$/.test(path)
            ? ['Info CAI Lazio | Trekking CAI', 'Informazioni sul CAI e sulle sezioni del Lazio.', '/info']
            : ['Trekking CAI | Escursioni CAI nel Lazio', 'Scopri le prossime escursioni CAI nel Lazio: calendario aggiornato, mappa interattiva e informazioni dalle sezioni del territorio.', '/'];
    const canonicalUrl = `https://trekking-cai.it${seo[2]}`;
    this.title.setTitle(seo[0]);
    this.meta.updateTag({ name: 'description', content: seo[1] });
    this.meta.updateTag({ property: 'og:title', content: seo[0] });
    this.meta.updateTag({ property: 'og:description', content: seo[1] });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: seo[0] });
    this.meta.updateTag({ name: 'twitter:description', content: seo[1] });
    this.document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  }

  private applyFilters() {
    this.excursions = applyFilters(this.allExcursions, this.filters);
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
