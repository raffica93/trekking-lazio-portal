import { Injectable, Injector, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, defer, map } from 'rxjs';
import { Excursion } from './excursion.model';
import { currentAndFutureExcursions, currentMonthStart, normalizeExcursion } from './excursion-filters';
import { isSupabaseConfigured } from './supabase.config';
import { PlaceRow, placeToExcursion } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private dataUrl = 'excursions.json';

  /** Exposed for a clear fallback notice when the published database is unavailable. */
  source: 'database' | 'snapshot' = 'snapshot';

  getExcursions(): Observable<Excursion[]> {
    if (isSupabaseConfigured()) {
      return defer(() => this.loadPublished()).pipe(
        catchError(() => this.loadSnapshot()),
        map((excursions) => this.prepare(excursions))
      );
    }
    return this.loadSnapshot().pipe(map((excursions) => this.prepare(excursions)));
  }

  private loadSnapshot(): Observable<Excursion[]> {
    this.source = 'snapshot';
    return this.http
      .get<{ excursions: Excursion[] }>(this.dataUrl)
      .pipe(map((payload) => payload.excursions));
  }

  private async loadPublished(): Promise<Excursion[]> {
    const { SupabaseService } = await import('./supabase.service');
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
    return rows.map(placeToExcursion);
  }

  private prepare(excursions: Excursion[]): Excursion[] {
    return currentAndFutureExcursions(excursions.map(normalizeExcursion))
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  }
}
