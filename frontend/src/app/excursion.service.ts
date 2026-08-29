import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Excursion } from './excursion.model';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private http = inject(HttpClient);
  private dataUrl = 'excursions.json';

  getExcursions(): Observable<Excursion[]> {
    return this.http
      .get<{ excursions: Excursion[] }>(this.dataUrl)
      .pipe(map((payload) => payload.excursions));
  }
}
