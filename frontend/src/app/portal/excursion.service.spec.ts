import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { ExcursionService } from './excursion.service';
import { SupabaseService } from '../core/supabase.service';
import { supabaseRuntimeConfig } from '../core/supabase.config';
import { currentMonthStart } from '../shared/excursion-filters';

describe('ExcursionService nationwide database loading', () => {
  const row = (id: number) => ({ id: String(id), source_id: `src-${id}`, title: `Evento ${id}`, date: currentMonthStart(), date_end: null, category: 'E', external_url: 'http://cai.it/evento', organizer: 'CAI Milano', organizer_region: 'Lombardia', region: 'Piemonte', location: 'Monte', latitude: null, longitude: null });
  const ranges: number[][] = [];
  const classificationBatches: string[][] = [];
  let rows: ReturnType<typeof row>[];
  let classifications: { source_id: string; decision: 'trekking' | 'non_trekking' | 'da_verificare'; category: string; confidence: number | null; probability: number | null; rationale: string; evidence_original: string; fingerprint: string; method: 'rules-v1'; model_requested: null; response_model: null; model_attested: false; policy_version: string; model_version: null }[];
  let fail: boolean;
  const query = {
    select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), or: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
    range: vi.fn(async (from: number, to: number) => { ranges.push([from, to]); return fail ? { data: null, error: new Error('Offline') } : { data: rows.slice(from, to + 1), error: null }; })
  };
  const classificationQuery = {
    select: vi.fn().mockReturnThis(),
    async in(_column: string, ids: string[]) {
      classificationBatches.push(ids);
      return { data: classifications.filter((item) => ids.includes(item.source_id)), error: null };
    }
  };

  beforeEach(() => {
    ranges.length = 0; classificationBatches.length = 0; rows = []; classifications = []; fail = false; vi.clearAllMocks();
    supabaseRuntimeConfig.supabaseUrl = 'https://test.supabase.co';
    supabaseRuntimeConfig.supabasePublishableKey = 'sb_publishable_test';
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: SupabaseService, useValue: { requireClient: () => ({ from: (table: string) => table === 'places' ? query : classificationQuery }) } }] });
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

  it('adds separate classification metadata and filters map-eligible trekking only on request', async () => {
    rows = [row(1), row(2), row(3)];
    classifications = [
      { source_id: 'src-1', decision: 'trekking', category: 'a piedi', confidence: 0.9, probability: 0.92, rationale: 'Sentiero', evidence_original: 'Escursione', fingerprint: 'fp-1', method: 'rules-v1', model_requested: null, response_model: null, model_attested: false, policy_version: 'cai-v1', model_version: null },
      { source_id: 'src-2', decision: 'non_trekking', category: 'alpinismo/ferrata', confidence: 0.8, probability: 0.8, rationale: 'Via ferrata', evidence_original: 'Ferrata', fingerprint: 'fp-2', method: 'rules-v1', model_requested: null, response_model: null, model_attested: false, policy_version: 'cai-v1', model_version: null },
      { source_id: 'src-3', decision: 'da_verificare', category: 'altro', confidence: null, probability: null, rationale: 'Testo incompleto', evidence_original: 'Da definire', fingerprint: 'fp-3', method: 'rules-v1', model_requested: null, response_model: null, model_attested: false, policy_version: 'cai-v1', model_version: null }
    ];
    const service = TestBed.inject(ExcursionService);
    const all = await firstValueFrom(service.getExcursions());
    expect(all).toHaveLength(3);
    expect(all[0].classification?.mapEligible).toBe(true);
    expect(all[1].classification?.mapEligible).toBe(false);
    expect(classificationBatches).toEqual([['src-1', 'src-2', 'src-3']]);
    const trekking = await firstValueFrom(service.getExcursions({ trekkingOnly: true }));
    expect(trekking.map((item) => item.id)).toEqual(['1']);
  });

  it('applies the same explicit trekking filter to the static snapshot fallback', async () => {
    fail = true;
    const service = TestBed.inject(ExcursionService);
    const promise = firstValueFrom(service.getExcursions({ trekkingOnly: true }));
    const request = await vi.waitFor(() => TestBed.inject(HttpTestingController).expectOne('excursions.json'));
    request.flush({ excursions: [
        { id: 'snapshot-trekking', title: 'Sentiero', date: currentMonthStart(), category: 'E', link: 'https://cai.it', organizer: 'CAI Roma', location: 'Roma', cost: '', time: '', classification: { decision: 'trekking', category: 'a piedi', confidence: 0.9, probability: 0.9, rationale: 'Sentiero', evidenceOriginal: 'Escursione', fingerprint: 'fp', method: 'rules-v1', modelRequested: null, responseModel: null, modelAttested: false, policyVersion: 'cai-v1', modelVersion: null, mapEligible: true } },
        { id: 'snapshot-review', title: 'Incerto', date: currentMonthStart(), category: 'E', link: 'https://cai.it', organizer: 'CAI Roma', location: 'Roma', cost: '', time: '', classification: { decision: 'da_verificare', category: 'altro', confidence: null, probability: null, rationale: 'Ambiguo', evidenceOriginal: 'Da definire', fingerprint: 'fp2', method: 'rules-v1', modelRequested: null, responseModel: null, modelAttested: false, policyVersion: 'cai-v1', modelVersion: null, mapEligible: false } }
    ] });
    expect((await promise).map((item) => item.id)).toEqual(['snapshot-trekking']);
    expect(service.source).toBe('snapshot');
  });
});
