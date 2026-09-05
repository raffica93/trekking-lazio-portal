import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { App } from './app';
import { routes } from './app.routes';
import {
  AGENDA_NO_LABEL,
  AGENDA_YES_LABEL,
  CAI_PHILOSOPHY,
  CAI_QUOTE_ROWS,
  CAI_SEZIONE_LINKS,
  quoteDisplay,
  UNPUBLISHED_LABEL
} from './cai-info.data';
import { monthLabel, nextYearMonth } from './excursion-filters';
import { formatDateRange } from './excursion-dates';
import { AnalyticsService } from './analytics.service';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function dateInMonth(monthOffset: number, day: number): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, day);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', class {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds: number[] = [];

      constructor(private readonly callback: IntersectionObserverCallback) {}

      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }

      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] { return []; }
    });
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.unstubAllGlobals();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({ excursions: [] });
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the portal heading', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toContain('TREKKING CAI');
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({ excursions: [] });
  });

  it('should switch views, filter by difficulty and secure detail links', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({
      excursions: [
        { id: '1', title: 'Sentiero facile', date: dateInMonth(1, 1), category: 'E', link: 'http://example.com/e', organizer: 'CAI Roma', location: 'Lazio', lat: 41.9, lng: 12.5, cost: 'Gratis', time: '3 ore', summary: 'Anello boschivo sui Colli Albani.', distanceKm: 8, elevationM: 948 },
        { id: '2', title: 'Ferrata', date: dateInMonth(1, 2), category: 'EEA', link: 'https://example.com/eea', organizer: 'CAI Roma', location: 'Lazio', lat: 42, lng: 13, cost: 'Gratis', time: '5 ore' }
      ]
    });
    await fixture.whenStable();
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();

    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const filterBar = compiled.querySelector('app-filter-bar');
    const filters = compiled.querySelector('[aria-label="Filtri"]');

    expect(app.allExcursions[0].link).toBe('http://example.com/e');
    expect(filters).toBeTruthy();
    expect(header?.nextElementSibling).toBe(filterBar);
    expect(filterBar?.querySelector('[aria-label="Filtri"]')).toBe(filters);
    const monthGroup = compiled.querySelector('[aria-label="Filtra per mese"]');
    const whenBand = compiled.querySelector('[aria-label="Quando"]');
    const trailBand = compiled.querySelector('[aria-label="Percorso"]');
    const megaFilters = compiled.querySelector('#filter-mega');
    expect(monthGroup).toBeTruthy();
    expect(whenBand).toBeTruthy();
    expect(trailBand).toBeNull();
    expect(whenBand?.contains(monthGroup)).toBe(true);
    expect(megaFilters?.textContent).toContain('Durata');
    expect(megaFilters?.textContent).toContain('Distanza');
    expect(megaFilters?.contains(monthGroup)).toBe(false);
    expect(filters?.firstElementChild?.getAttribute('aria-label')).toBe('Filtra per sede regionale e sezione CAI');
    expect(Array.from(monthGroup?.querySelectorAll('button') ?? [])
      .some(button => button.textContent?.trim() === 'Tutto il calendario')).toBe(false);
    expect(app.filters.month).toBe('all');
    expect(compiled.textContent).not.toContain('Prossime escursioni');
    expect(compiled.querySelector('app-map')).toBeNull();
    expect(compiled.querySelector('.map-placeholder')?.getAttribute('aria-label')).toBe('Caricamento della mappa');
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('Località:');
    expect(compiled.querySelector('.difficulty-chip')?.textContent?.trim()).toBe('E');
    expect(compiled.textContent).toContain('Anello boschivo sui Colli Albani.');
    expect(compiled.textContent).toContain('8 km');
    expect(compiled.querySelector('header img')?.getAttribute('src')).toBe('logo.svg');
    const viewTabs = compiled.querySelector('[aria-label="Scegli visualizzazione"]') as HTMLElement;
    const calendarTab = Array.from(viewTabs.querySelectorAll('button'))
      .find(button => button.textContent?.trim() === 'Calendario') as HTMLButtonElement;
    const mapTab = Array.from(viewTabs.querySelectorAll('button'))
      .find(button => button.textContent?.trim() === 'Mappa') as HTMLButtonElement;
    expect(viewTabs).toBeTruthy();
    expect(calendarTab.getAttribute('aria-pressed')).toBe('true');
    expect(mapTab.getAttribute('aria-pressed')).toBe('false');
    mapTab.click();
    fixture.detectChanges();
    expect(app.mobileView).toBe('map');
    expect(mapTab.getAttribute('aria-pressed')).toBe('true');
    expect(compiled.querySelector('.map-pane')?.classList.contains('mobile-pane-active')).toBe(true);
    expect(compiled.querySelector('aside')).toBeTruthy();
    expect(compiled.querySelector('.map-placeholder')).toBeTruthy();

    const more = Array.from(compiled.querySelectorAll('button')).find(button => button.textContent?.includes('Altri filtri')) as HTMLButtonElement;
    more.click();
    fixture.detectChanges();
    const mega = compiled.querySelector('#filter-mega') as HTMLElement;
    const main = compiled.querySelector('main') as HTMLElement;
    expect(mega.parentElement).toBe(filters);
    expect(Number(getComputedStyle(filterBar as HTMLElement).zIndex))
      .toBeGreaterThan(Number(getComputedStyle(main).zIndex || '0'));
    expect(mega.querySelector('.filter-mega-kicker')?.textContent).toContain('Caratteristiche');
    expect(getComputedStyle(mega).width).not.toBe('0px');
    expect(getComputedStyle(mega.querySelector('.filter-mega-grid') as HTMLElement).maxWidth).toBe('none');
    const eea = Array.from(compiled.querySelectorAll('button')).find(button => button.textContent?.trim() === 'EEA') as HTMLButtonElement | undefined;
    eea?.click();
    fixture.detectChanges();
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['2']);
    expect(eea?.classList.contains('filter-chip-active')).toBe(true);
    expect(header?.nextElementSibling).toBe(filterBar);
  });

  it('selects the card and opens the detail from a map marker', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({
      excursions: [
        { id: '1', title: 'Sentiero facile', date: dateInMonth(1, 1), category: 'E', link: 'http://example.com/e', organizer: 'CAI Roma', location: 'Lazio', lat: 41.9, lng: 12.5, cost: 'Gratis', time: '3 ore', summary: 'Anello boschivo sui Colli Albani.', distanceKm: 8, elevationM: 948 },
        { id: '2', title: 'Ferrata', date: dateInMonth(1, 2), category: 'EEA', link: 'https://example.com/eea', organizer: 'CAI Roma', location: 'Lazio', lat: 42, lng: 13, cost: 'Gratis', time: '5 ore' }
      ]
    });
    fixture.detectChanges();

    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.excursion-popup')).toBeNull();
    expect(compiled.querySelector('[aria-label="Dettaglio escursione"]')).toBeNull();

    app.onMapSelect(app.excursions[0]);
    fixture.detectChanges();

    expect(app.selectedId).toBe('1');
    expect(app.detailOpen).toBe(true);
    expect(compiled.querySelector('app-excursion-card.is-selected')).toBeTruthy();
    expect(compiled.querySelector('.excursion-card.is-selected')).toBeTruthy();
    const detail = compiled.querySelector('[aria-label="Dettaglio escursione"]') as HTMLElement;
    expect(detail).toBeTruthy();
    expect(detail.textContent).toContain('Sentiero facile');
    expect(detail.textContent).toContain('Anello boschivo sui Colli Albani.');
    const detailCta = detail.querySelector('.detail-cta') as HTMLAnchorElement;
    expect(detailCta?.getAttribute('href')).toBe('http://example.com/e');
    const trackCaiLink = vi.spyOn(TestBed.inject(AnalyticsService), 'trackCaiLink');
    detailCta.addEventListener('click', event => event.preventDefault(), { once: true });
    detailCta.click();
    expect(trackCaiLink).toHaveBeenCalledWith(expect.any(Event), 'http://example.com/e', 'CAI Roma', 'escursione');
    const header = detail.querySelector('.detail-header') as HTMLElement;
    const close = header?.querySelector('.detail-close') as HTMLElement;
    const chip = header?.querySelector('.difficulty-chip') as HTMLElement;
    expect(header).toBeTruthy();
    expect(header.lastElementChild).toBe(close);
    expect(chip?.textContent?.trim()).toBe('E');
    expect(getComputedStyle(close).position).not.toBe('absolute');
    expect(Boolean(close.compareDocumentPosition(chip) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(false);
    expect(compiled.querySelector('.leaflet-popup')).toBeNull();
  });

  it('keeps unlocated outings in the list and marks the position as unconfirmed', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({
      excursions: [
        {
          id: 'no-pin',
          title: 'Open day arrampicata',
          date: dateInMonth(1, 1),
          category: 'E',
          link: 'https://example.com/open',
          organizer: 'CAI Esperia',
          location: 'Non specificato',
          cost: 'Vedi sito',
          time: 'Vedi sito'
        }
      ]
    });
    fixture.detectChanges();

    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    expect(app.excursions.map((excursion) => excursion.id)).toEqual(['no-pin']);
    expect(app.hasCoords(app.excursions[0])).toBe(false);
    expect(compiled.textContent).toContain('Open day arrampicata');
    expect(compiled.textContent).toContain('Posizione da confermare');
  });

  it('shows a date range and nights for multi-day trips', () => {
    const start = dateInMonth(1, 12);
    const end = dateInMonth(1, 13);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({
      excursions: [
        {
          id: 'weekend',
          title: 'Gran Sasso',
          date: start,
          dateEnd: end,
          days: 2,
          category: 'EE',
          link: 'https://example.com/gs',
          organizer: 'CAI Roma',
          location: 'Gran Sasso',
          lat: 42.47,
          lng: 13.56,
          cost: 'Gratis',
          time: '7 ore'
        },
        {
          id: 'day',
          title: 'Anello Ernici',
          date: dateInMonth(1, 20),
          dateEnd: dateInMonth(1, 20),
          days: 1,
          category: 'E',
          link: 'https://example.com/e',
          organizer: 'CAI Roma',
          location: 'Monti Ernici',
          lat: 41.8,
          lng: 13.4,
          cost: 'Gratis',
          time: '5 ore'
        }
      ]
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const weekendCard = compiled.querySelector('[data-excursion-id="weekend"]') as HTMLElement;
    const dayCard = compiled.querySelector('[data-excursion-id="day"]') as HTMLElement;
    expect(weekendCard.textContent).toContain(formatDateRange(start, end));
    expect(weekendCard.textContent).toContain('2 giorni · 1 notte');
    expect(dayCard.textContent).not.toContain('notte');

    const app = fixture.componentInstance;
    app.onMapSelect(app.excursions.find(item => item.id === 'weekend')!);
    fixture.detectChanges();
    const detail = compiled.querySelector('[aria-label="Dettaglio escursione"]') as HTMLElement;
    expect(detail.textContent).toContain(formatDateRange(start, end, 'long'));
    expect(detail.textContent).toContain('2 giorni');
    expect(detail.textContent).toContain('Notti');
    expect(detail.textContent).toContain('1 notte');
  });

  it('filters by month, region, days, distance and cost', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({
      excursions: [
        {
          id: 'week',
          title: 'Settimana ferrate',
          date: dateInMonth(1, 26),
          dateEnd: dateInMonth(2, 3),
          days: 8,
          category: 'EEA',
          link: 'https://example.com/w',
          organizer: 'CAI Tivoli',
          location: 'Trentino',
          region: 'Trentino-Alto Adige',
          lat: 46.3,
          lng: 11.6,
          cost: 'Vedi sito',
          time: 'max 7 ore',
          durationHours: 7,
          distanceKm: 15,
          transport: 'Aereo + macchina',
          privateCar: true
        },
        {
          id: 'day',
          title: 'Anello Ernici',
          date: dateInMonth(1, 12),
          dateEnd: dateInMonth(1, 12),
          days: 1,
          category: 'E',
          link: 'https://example.com/d',
          organizer: 'CAI Roma',
          location: 'Monti Ernici',
          region: 'Lazio',
          lat: 41.8,
          lng: 13.4,
          cost: '15 euro',
          costAmount: 15,
          time: '6 ore',
          durationHours: 6,
          distanceKm: 10,
          transport: 'pullman',
          privateCar: false
        }
      ]
    });
    fixture.detectChanges();

    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    const clickInGroup = (group: string, label: string) => {
      const root = compiled.querySelector(`[aria-label="${group}"]`);
      const button = Array.from(root?.querySelectorAll('button') ?? []).find(item => item.textContent?.trim() === label) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
    };
    const clickReset = () => {
      const button = Array.from(compiled.querySelectorAll('button')).find(item => item.textContent?.includes('Azzera')) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
    };
    const openMega = () => {
      const button = Array.from(compiled.querySelectorAll('button')).find(item => item.textContent?.includes('Altri filtri')) as HTMLButtonElement;
      if (button.getAttribute('aria-expanded') !== 'true') {
        button.click();
        fixture.detectChanges();
      }
    };

    expect(app.filters.month).toBe('all');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day', 'week']);

    openMega();
    clickInGroup('Filtra per regione', 'Lazio');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day']);

    clickInGroup('Filtra per regione', 'Tutte');
    clickInGroup('Filtra per mese', monthLabel(dateInMonth(2, 3).slice(0, 7)));
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);

    clickReset();
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day', 'week']);
    clickInGroup('Filtra per mese', monthLabel(nextYearMonth()));
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day', 'week']);

    clickInGroup('Filtra per giorni della gita', '4–10');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);

    clickReset();
    expect(app.filters.month).toBe('all');
    expect(Array.from(compiled.querySelectorAll('[aria-label="Filtra per mese"] button'))
      .some(button => button.textContent?.trim() === 'Tutto il calendario')).toBe(false);
    openMega();
    clickInGroup('Filtra per distanza', '≤10 km');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day']);

    clickReset();
    openMega();
    clickInGroup('Filtra per costo', 'Vedi sito');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);

    clickReset();
    openMega();
    clickInGroup('Filtra per auto privata', 'No');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day']);

    clickReset();
    openMega();
    const section = compiled.querySelector('[aria-label="Filtra per sezione CAI"]') as HTMLSelectElement;
    expect(section).toBeTruthy();
    section.value = 'CAI Tivoli';
    section.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);
    expect(compiled.querySelector('app-excursion-card .section-tag')?.textContent).toContain('CAI Tivoli');
  });

  it('shows the national registry with distinct coverage and searchable section links', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('excursions.json').flush({ excursions: [] });
    await TestBed.inject(Router).navigateByUrl('/info');
    fixture.detectChanges();
    http.expectOne('cai-sections.json').flush({ sections: [
      { id: 'milano', organizer: 'CAI Milano', region: 'Lombardia', municipality: 'Milano', website: 'https://www.caimilano.org', calendarUrls: ['https://www.caimilano.org/programma'], sectionType: 'section' },
      { id: 'roma', organizer: 'CAI Roma', region: 'Lazio', municipality: 'Roma', website: 'http://www.cairoma.it', calendarUrls: [] }
    ] });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const page = compiled.querySelector('app-info-page') as HTMLElement;
    expect(compiled.querySelector('app-filter-bar')).toBeNull();
    expect(page.textContent).toContain('portale indipendente');
    expect(page.textContent).toContain('2 sezioni e sottosezioni');
    expect(page.textContent).toContain('1 con collegamenti ai programmi');
    expect(page.textContent).toContain(CAI_PHILOSOPHY.body);
    expect(page.querySelector('a[href="http://www.cairoma.it"]')).toBeTruthy();
    const region = page.querySelector('[aria-label="Regione del repertorio"]') as HTMLSelectElement;
    region.value = 'Lombardia'; region.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(page.querySelectorAll('.directory-row').length).toBe(1);
    expect(page.querySelector('.directory-row')?.textContent).toContain('CAI Milano');
  });

  it('renders every filtered calendar event and reveals the selected map event', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({ excursions: Array.from({ length: 65 }, (_, index) => ({ id: String(index).padStart(3, '0'), title: `Escursione ${index}`, date: dateInMonth(1, 1), category: 'E', link: 'https://cai.it', organizer: index % 2 ? 'CAI Milano' : 'CAI Roma', organizerRegion: index % 2 ? 'Lombardia' : 'Lazio', location: 'Monte', cost: 'Vedi sito', time: '' })) });
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    expect(app.excursions.length).toBe(65);
    expect(compiled.querySelectorAll('app-excursion-card').length).toBe(65);
    app.onMapSelect(app.excursions[64]); fixture.detectChanges();
    expect(compiled.querySelector('[data-excursion-id="064"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Pagine del calendario"]')).toBeNull();
    const region = compiled.querySelector('[aria-label="Filtra per regione del CAI"]') as HTMLSelectElement;
    const section = compiled.querySelector('[aria-label="Filtra per sezione CAI"]') as HTMLSelectElement;
    section.value = 'CAI Roma'; section.dispatchEvent(new Event('change')); fixture.detectChanges();
    region.value = 'Lombardia'; region.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(app.filters.organizer).toBe('all');
    expect(app.excursions.every(item => item.organizer === 'CAI Milano')).toBe(true);
    expect(Array.from(section.options).map(option => option.value)).toEqual(['all', 'CAI Milano']);
  });
});
