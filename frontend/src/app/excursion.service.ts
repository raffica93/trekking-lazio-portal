import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Excursion } from './excursion.model';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/excursions';

  getExcursions(): Observable<Excursion[]> {
    return this.http.get<Excursion[]>(this.apiUrl);
  }
}
