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

    expect(app.allExcursions[0].link).toBe('https://example.com/e');
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
    expect(filters?.firstElementChild).toBe(whenBand);
    const landingMonth = nextYearMonth();
    const landingChip = Array.from(monthGroup?.querySelectorAll('button') ?? [])
      .find(button => button.textContent?.trim() === monthLabel(landingMonth));
    expect(landingChip?.classList.contains('filter-chip-active')).toBe(true);
    expect(app.filters.month).toBe(landingMonth);
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
    expect(detail.querySelector('.detail-cta')?.getAttribute('href')).toBe('https://example.com/e');
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

    expect(app.filters.month).toBe(nextYearMonth());
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week', 'day']);

    openMega();
    clickInGroup('Filtra per regione', 'Lazio');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['day']);

    clickInGroup('Filtra per regione', 'Tutte');
    clickInGroup('Filtra per mese', monthLabel(dateInMonth(2, 3).slice(0, 7)));
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);

    clickInGroup('Filtra per mese', 'Tutti');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week', 'day']);
    clickInGroup('Filtra per mese', monthLabel(nextYearMonth()));
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week', 'day']);

    clickInGroup('Filtra per giorni della gita', '4–10');
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);

    clickReset();
    expect(app.filters.month).toBe('all');
    expect(Array.from(compiled.querySelectorAll('[aria-label="Filtra per mese"] button'))
      .find(button => button.textContent?.trim() === 'Tutti')
      ?.classList.contains('filter-chip-active')).toBe(true);
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
    const section = compiled.querySelector('[aria-label="Filtra per sezione negli altri filtri"]') as HTMLSelectElement;
    expect(section).toBeTruthy();
    section.value = 'CAI Tivoli';
    section.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);
    expect(compiled.querySelector('app-excursion-card .section-tag')?.textContent).toContain('CAI Tivoli');
  });

  it('opens the Info page from the header control and renders sourced CAI content', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({ excursions: [] });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header') as HTMLElement;
    const title = Array.from(header.querySelectorAll('span'))
      .find(span => span.textContent?.trim() === 'TREKKING CAI') as HTMLElement;
    const info = Array.from(header.querySelectorAll('a'))
      .find(anchor => anchor.textContent?.trim() === 'Info') as HTMLAnchorElement;

    expect(header).toBeTruthy();
    expect(title).toBeTruthy();
    expect(info).toBeTruthy();
    expect(info.getAttribute('aria-label')).toBe('Info');
    expect(Boolean(title.compareDocumentPosition(info) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);

    info.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    expect(router.url).toMatch(/\/info$/);
    expect(compiled.querySelector('app-info-page')).toBeTruthy();
    expect(compiled.querySelector('app-filter-bar')).toBeNull();
    expect(compiled.querySelector('app-map')).toBeNull();
    expect(compiled.querySelector('app-admin-shell')).toBeNull();

    const page = compiled.querySelector('app-info-page') as HTMLElement;
    const shell = compiled.querySelector('.flex.h-dvh.flex-col') as HTMLElement;
    expect(shell).toBeTruthy();
    expect(shell.contains(header)).toBe(true);
    expect(shell.contains(page)).toBe(true);
    expect(compiled.querySelector('router-outlet')?.parentElement).toBe(shell);
    expect(compiled.querySelector('router-outlet')?.classList.contains('hidden')).toBe(true);
    expect(page.querySelector('#info-title')?.textContent?.trim()).toBe('Info');
    const inner = page.querySelector('.info-inner') as HTMLElement;
    expect(inner.firstElementChild?.classList.contains('kicker')).toBe(true);
    expect(Number.parseFloat(getComputedStyle(inner).paddingTop)).toBeLessThanOrEqual(16);
    const text = page.textContent ?? '';
    expect(text).toContain(CAI_PHILOSOPHY.body);
    expect(text).toContain('alpinismo in ogni sua manifestazione');
    expect(text).toContain('studio delle montagne');
    expect(text).toContain('difesa del loro ambiente naturale');
    expect(text).toContain('partecipare alle uscite');
    expect(text).toContain('sezione di appartenenza');
    expect(text).toContain('iscrizione');

    const costTable = page.querySelector('[aria-label="Costi di iscrizione alle sezioni CAI del Lazio"]') as HTMLTableElement;
    expect(costTable).toBeTruthy();
    const costBody = costTable.querySelector('tbody')?.textContent ?? '';
    for (const row of CAI_QUOTE_ROWS) {
      expect(costBody).toContain(row.name);
      expect(costBody).toContain(quoteDisplay(row.ordinario));
      const source = costTable.querySelector(`a[href="${row.sourceUrl}"]`);
      expect(source).toBeTruthy();
    }
    expect(costBody).toContain(UNPUBLISHED_LABEL);
    expect(costBody).toContain('CAI Viterbo');
    expect(costBody).toContain('CAI Roma');

    const linksTable = page.querySelector('[aria-label="Siti e agende delle sezioni CAI del Lazio"]') as HTMLTableElement;
    expect(linksTable).toBeTruthy();
    const linksBody = linksTable.querySelector('tbody')?.textContent ?? '';
    for (const sezione of CAI_SEZIONE_LINKS) {
      expect(linksBody).toContain(sezione.name);
      const site = linksTable.querySelector(`a[href="${sezione.websiteUrl}"]`);
      expect(site).toBeTruthy();
      if (sezione.hasAgenda) {
        expect(linksBody).toContain(AGENDA_YES_LABEL);
        expect(linksTable.querySelector(`a[href="${sezione.agendaUrl}"]`)).toBeTruthy();
      }
    }
    expect(linksBody).toContain(AGENDA_NO_LABEL);
    const esperia = CAI_SEZIONE_LINKS.find(sezione => sezione.id === 'esperia');
    expect(esperia?.hasAgenda).toBe(true);
    expect(esperia?.agendaUrl).toContain('calendario_2026.pdf');
    expect(linksTable.querySelector(`a[href="${esperia?.agendaUrl}"]`)).toBeTruthy();
  });
});
