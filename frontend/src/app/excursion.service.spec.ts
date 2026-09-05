import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { ExcursionService } from './excursion.service';
import { SupabaseService } from './supabase.service';
import { supabaseRuntimeConfig } from './supabase.config';
import { currentMonthStart } from './excursion-filters';

describe('ExcursionService nationwide database loading', () => {
  const row = (id: number) => ({ id: String(id), title: `Evento ${id}`, date: currentMonthStart(), date_end: null, category: 'E', external_url: 'http://cai.it/evento', organizer: 'CAI Milano', organizer_region: 'Lombardia', region: 'Piemonte', location: 'Monte', latitude: null, longitude: null });
  const ranges: number[][] = [];
  let rows: ReturnType<typeof row>[];
  let fail: boolean;
  const query = {
    select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), or: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
    range: vi.fn(async (from: number, to: number) => { ranges.push([from, to]); return fail ? { data: null, error: new Error('Offline') } : { data: rows.slice(from, to + 1), error: null }; })
  };

  beforeEach(() => {
    ranges.length = 0; rows = []; fail = false; vi.clearAllMocks();
    supabaseRuntimeConfig.supabaseUrl = 'https://test.supabase.co';
    supabaseRuntimeConfig.supabasePublishableKey = 'sb_publishable_test';
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: SupabaseService, useValue: { requireClient: () => ({ from: () => query }) } }] });
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    supabaseRuntimeConfig.supabaseUrl = '';
    supabaseRuntimeConfig.supabasePublishableKey = '';
  });

  it('reads beyond the 1000-row API default with stable pages and month overlap', async () => {
    rows = Array.from({ length: 1201 }, (_, index) => row(index));
    const data = await firstValueFrom(TestBed.inject(ExcursionService).getExcursions());
    expect(data.length).toBe(1201);
    expect(ranges).toEqual([[0, 499], [500, 999], [1000, 1499]]);
    expect(query.eq).toHaveBeenCalledWith('status', 'published');
    expect(query.or).toHaveBeenCalledWith(`date.gte.${currentMonthStart()},date_end.gte.${currentMonthStart()}`);
    expect(query.order).toHaveBeenCalledWith('id', { ascending: true });
    expect(data[0].organizerRegion).toBe('Lombardia');
    expect(data[0].lat).toBeNull();
    expect(data[0].link).toBe('http://cai.it/evento');
  });

  it('uses the published snapshot if a database page fails, without partial results', async () => {
    fail = true;
    const service = TestBed.inject(ExcursionService);
    const promise = firstValueFrom(service.getExcursions());
    const request = await vi.waitFor(() => TestBed.inject(HttpTestingController).expectOne('excursions.json'));
    request.flush({ excursions: [{ id: 'snapshot', title: 'Evento', date: currentMonthStart(), category: 'E', link: 'https://cai.it', organizer: 'CAI Roma', location: 'Roma', cost: '', time: '' }] });
    expect((await promise).map(item => item.id)).toEqual(['snapshot']);
    expect(service.source).toBe('snapshot');
  });

  it('keeps an intentionally empty published calendar empty', async () => {
    expect(await firstValueFrom(TestBed.inject(ExcursionService).getExcursions())).toEqual([]);
    TestBed.inject(HttpTestingController).expectNone('excursions.json');
  });
});
