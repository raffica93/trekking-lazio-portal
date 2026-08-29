import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

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
        { id: '1', title: 'Sentiero facile', date: '2026-09-01', category: 'E', link: 'http://example.com/e', organizer: 'CAI Roma', location: 'Lazio', lat: 41.9, lng: 12.5, cost: 'Gratis', time: '3 ore' },
        { id: '2', title: 'Ferrata', date: '2026-09-02', category: 'EEA', link: 'https://example.com/eea', organizer: 'CAI Roma', location: 'Lazio', lat: 42, lng: 13, cost: 'Gratis', time: '5 ore' }
      ]
    });

    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const filters = compiled.querySelector('[aria-label="Filtri"]');

    expect(app.allExcursions[0].link).toBe('https://example.com/e');
    expect(filters).toBeTruthy();
    expect(header?.nextElementSibling).toBe(filters);
    expect(compiled.querySelector('app-map')?.querySelector('[aria-label="Filtri"]')).toBeNull();

    const eea = Array.from(compiled.querySelectorAll('button')).find(button => button.textContent?.trim() === 'EEA') as HTMLButtonElement | undefined;
    eea?.click();
    fixture.detectChanges();
    expect(app.excursions.map(excursion => excursion.id)).toEqual(['2']);
    expect(eea?.classList.contains('filter-chip-active')).toBe(true);

    app.setView('map');
    expect(app.activeView).toBe('map');
    expect(header?.nextElementSibling).toBe(filters);
  });
});
