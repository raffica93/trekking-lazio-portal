import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { monthLabel, nextYearMonth } from './excursion-filters';

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
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

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
    expect(compiled.querySelector('header')?.textContent).toContain('TREKKING LAZIO');
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({ excursions: [] });
  });

  it('should switch views, filter by difficulty and secure detail links', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('excursions.json').flush({
      excursions: [
        { id: '1', title: 'Sentiero facile', date: dateInMonth(1, 1), category: 'E', link: 'http://example.com/e', organizer: 'CAI Roma', location: 'Lazio', lat: 41.9, lng: 12.5, cost: 'Gratis', time: '3 ore', summary: 'Anello boschivo sui Colli Albani.', distanceKm: 8, elevationM: 948 },
        { id: '2', title: 'Ferrata', date: dateInMonth(1, 2), category: 'EEA', link: 'https://example.com/eea', organizer: 'CAI Roma', location: 'Lazio', lat: 42, lng: 13, cost: 'Gratis', time: '5 ore' }
      ]
    });

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
    expect(monthGroup).toBeTruthy();
    expect(compiled.querySelector('#filter-mega')?.contains(monthGroup)).toBe(false);
    expect(filters?.firstElementChild).toBe(monthGroup);
    const landingMonth = nextYearMonth();
    const landingChip = Array.from(monthGroup?.querySelectorAll('button') ?? [])
      .find(button => button.textContent?.trim() === monthLabel(landingMonth));
    expect(landingChip?.classList.contains('filter-chip-active')).toBe(true);
    expect(app.filters.month).toBe(landingMonth);
    expect(compiled.textContent).not.toContain('Prossime escursioni');
    expect(compiled.querySelector('app-map')?.querySelector('[aria-label="Filtri"]')).toBeNull();
    expect(compiled.querySelector('[aria-label="Legenda difficoltà"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Legenda difficoltà"]')?.textContent).toContain('Turistico');
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('Località:');
    expect(compiled.querySelector('.difficulty-chip')?.textContent?.trim()).toBe('E');
    expect(compiled.textContent).toContain('Anello boschivo sui Colli Albani.');
    expect(compiled.textContent).toContain('8 km');
    expect(compiled.querySelector('header img')?.getAttribute('src')).toBe('logo.png');
    expect(Array.from(compiled.querySelectorAll('button')).some(button => button.textContent?.trim() === 'Mappa')).toBe(false);
    expect(compiled.querySelector('aside')).toBeTruthy();
    expect(compiled.querySelector('app-map')).toBeTruthy();

    const more = Array.from(compiled.querySelectorAll('button')).find(button => button.textContent?.includes('Altri filtri')) as HTMLButtonElement;
    more.click();
    fixture.detectChanges();
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
    expect(compiled.querySelector('.leaflet-popup')).toBeNull();
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
      const button = Array.from(compiled.querySelectorAll('button')).find(item => item.textContent?.trim() === 'Azzera') as HTMLButtonElement;
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
    const section = compiled.querySelector('[aria-label="Filtra per sezione"]') as HTMLSelectElement;
    expect(section).toBeTruthy();
    section.value = 'CAI Tivoli';
    section.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['week']);
  });
});
