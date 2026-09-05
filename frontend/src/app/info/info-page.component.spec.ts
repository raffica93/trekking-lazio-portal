import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { App } from '../app';
import { routes } from '../app.routes';
import { CAI_PHILOSOPHY } from './cai-info.data';

describe('InfoPageComponent', () => {
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
});
