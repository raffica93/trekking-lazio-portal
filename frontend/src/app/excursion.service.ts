import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { from, map } from 'rxjs';
import { Excursion } from './excursion.model';
import { normalizeExcursion } from './excursion-filters';
import { placeToExcursion, type PlaceRow } from './place.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private http = inject(HttpClient);
  private supabase = inject(SupabaseService);
  private dataUrl = 'excursions.json';

  getExcursions(): Observable<Excursion[]> {
    if (this.supabase.configured) {
      return from(
        this.supabase.requireClient()
          .from('places')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: true })
      ).pipe(
        map(({ data, error }) => {
          if (error) throw error;
          return (data as PlaceRow[]).map((place) => normalizeExcursion(placeToExcursion(place)));
        })
      );
    }

    return this.http
      .get<{ excursions: Excursion[] }>(this.dataUrl)
      .pipe(map((payload) => payload.excursions.map((excursion) => normalizeExcursion({
        ...excursion,
        link: excursion.link.replace(/^http:\/\//i, 'https://')
      }))));
  }
}
