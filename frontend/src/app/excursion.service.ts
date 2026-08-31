import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Excursion } from './excursion.model';
import { normalizeExcursion } from './excursion-filters';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private http = inject(HttpClient);
  private dataUrl = 'excursions.json';

  getExcursions(): Observable<Excursion[]> {
    return this.http
      .get<{ excursions: Excursion[] }>(this.dataUrl)
      .pipe(map((payload) => payload.excursions.map((excursion) => normalizeExcursion({
        ...excursion,
        link: excursion.link.replace(/^http:\/\//i, 'https://')
      }))));
  }
}
