import { TestBed } from '@angular/core/testing';
import { AdminSediComponent } from './admin-sedi.component';
import { SupabaseService } from './supabase.service';

describe('AdminSediComponent', () => {
  const payload = {
    generatedAt: '2026-08-30T12:00:00.000Z',
    sources: [{
      id: 'roma',
      organizer: 'CAI Roma',
      url: 'https://www.cairoma.it/',
      kind: 'html',
      template: 'html-table',
      enabled: true,
      status: 'ok',
      excursions: 50,
      error: null,
      updatedAt: '2026-08-30T12:00:00.000Z'
    }]
  };

  let originalFetch: typeof fetch;

  beforeEach(async () => {
    originalFetch = window.fetch;
    window.fetch = (async () => ({
      ok: true,
      json: async () => payload
    })) as unknown as typeof fetch;

    await TestBed.configureTestingModule({
      imports: [AdminSediComponent],
      providers: [
        { provide: SupabaseService, useValue: { requireClient() { throw new Error('unused'); } } }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it('renders the sedi register heading', async () => {
    const fixture = TestBed.createComponent(AdminSediComponent);
    await fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sedi CAI');
    expect(compiled.textContent).toContain('CAI Roma');
    expect(compiled.textContent).toContain('Lancia script');
  });
});
