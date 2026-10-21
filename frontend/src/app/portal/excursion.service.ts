import { Injectable, Injector, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, defer, map } from 'rxjs';
import { Excursion, ExcursionClassificationDecision } from '../shared/excursion.model';
import { currentAndFutureExcursions, currentMonthStart, normalizeExcursion } from '../shared/excursion-filters';
import { isSupabaseConfigured } from '../core/supabase.config';
import { PlaceRow, placeToExcursion } from '../shared/place.model';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private dataUrl = 'excursions.json';

  /** Exposed for a clear fallback notice when the published database is unavailable. */
  source: 'database' | 'snapshot' = 'snapshot';

  getExcursions(options: { trekkingOnly?: boolean } = {}): Observable<Excursion[]> {
    if (isSupabaseConfigured()) {
      return defer(() => this.loadPublished()).pipe(
        catchError(() => this.loadSnapshot()),
        map((excursions) => this.prepare(excursions, options.trekkingOnly === true))
      );
    }
    return this.loadSnapshot().pipe(map((excursions) => this.prepare(excursions, options.trekkingOnly === true)));
  }

  private loadSnapshot(): Observable<Excursion[]> {
    this.source = 'snapshot';
    return this.http
      .get<{ excursions: Excursion[] }>(this.dataUrl)
      .pipe(map((payload) => payload.excursions));
  }

  private async loadPublished(): Promise<Excursion[]> {
    const { SupabaseService } = await import('../core/supabase.service');
    const supabase = this.injector.get(SupabaseService);
    const rows: PlaceRow[] = [];
    const pageSize = 500;
    const start = currentMonthStart();
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase.requireClient()
        .from('places')
        .select('*')
        .eq('status', 'published')
        .or(`date.gte.${start},date_end.gte.${start}`)
        .order('date', { ascending: true })
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) throw error;
      const page = (data ?? []) as PlaceRow[];
      rows.push(...page);
      if (page.length < pageSize) break;
    }
    this.source = 'database';
    const classificationRows: ClassificationRow[] = [];
    for (let from = 0; from < rows.length; from += 200) {
      const sourceIds = rows.slice(from, from + 200).map((row) => row.source_id).filter((id): id is string => Boolean(id));
      if (!sourceIds.length) continue;
      const { data, error } = await supabase.requireClient()
        .from('place_classifications')
        .select('source_id, decision, category, confidence, probability, rationale, evidence_original, fingerprint, method, model_requested, response_model, model_attested, policy_version, model_version')
        .in('source_id', sourceIds);
      if (error) throw error;
      classificationRows.push(...(data ?? []) as ClassificationRow[]);
    }
    const classifications = new Map(classificationRows.map((row) => [row.source_id, toClassification(row)]));
    return rows.map((row) => {
      const excursion = placeToExcursion(row);
      const classification = row.source_id ? classifications.get(row.source_id) : undefined;
      return classification ? { ...excursion, classification } : excursion;
    });
  }

  private prepare(excursions: Excursion[], trekkingOnly = false): Excursion[] {
    const current = currentAndFutureExcursions(excursions.map(normalizeExcursion));
    return (trekkingOnly ? current.filter((item) => item.classification?.mapEligible === true) : current)
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  }
}

type ClassificationRow = {
  source_id: string;
  decision: ExcursionClassificationDecision;
  category: string;
  confidence: number | null;
  probability: number | null;
  rationale: string;
  evidence_original: string;
  fingerprint: string;
  method: 'rules-v1' | 'mercury-decide';
  model_requested: string | null;
  response_model: string | null;
  model_attested: boolean;
  policy_version: string;
  model_version: string | null;
};

function toClassification(row: ClassificationRow) {
  return {
    decision: row.decision,
    category: row.category,
    confidence: row.confidence,
    probability: row.probability,
    rationale: row.rationale,
    evidenceOriginal: row.evidence_original,
    fingerprint: row.fingerprint,
    method: row.method,
    modelRequested: row.model_requested,
    responseModel: row.response_model,
    modelAttested: row.model_attested,
    policyVersion: row.policy_version,
    modelVersion: row.model_version,
    mapEligible: row.decision === 'trekking'
  };
}
