import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminPlacesService } from './admin-places.service';
import type { PlaceSummary } from './place.model';

@Component({
  selector: 'app-admin-place-list',
  standalone: true,
  imports: [DatePipe, FormsModule, NgFor, NgIf, RouterLink],
  template: `
    <section class="page-heading">
      <div>
        <p class="eyebrow">Archivio operativo</p>
        <h1>Luoghi e itinerari</h1>
        <p>Ogni riga corrisponde a un punto che può comparire nel portale pubblico.</p>
      </div>
      <a routerLink="/admin/places/new" class="new-place">+ Nuovo luogo</a>
    </section>

    <section class="catalogue" aria-label="Elenco luoghi">
      <div class="catalogue-tools">
        <label>
          <span>Cerca nell’archivio</span>
          <input [(ngModel)]="query" type="search" placeholder="Titolo o località">
        </label>
        <span class="count">{{ filtered.length }} elementi</span>
      </div>

      <p *ngIf="loading" class="state">Carico l’archivio…</p>
      <p *ngIf="error" class="state error" role="alert">{{ error }}</p>
      <p *ngIf="!loading && !error && filtered.length === 0" class="state">Nessun luogo corrisponde alla ricerca.</p>

      <div *ngIf="!loading && !error && filtered.length" class="place-list">
        <a *ngFor="let place of filtered" [routerLink]="['/admin/places', place.id]" class="place-row">
          <span class="date">{{ place.date | date:'dd MMM':'':'it' }}</span>
          <span class="place-copy"><strong>{{ place.title }}</strong><small>{{ place.location }}</small></span>
          <span class="status" [class.published]="place.status === 'published'">
            {{ place.status === 'published' ? 'Pubblicato' : 'Bozza' }}
          </span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .page-heading { display: flex; align-items: end; justify-content: space-between; gap: 1.5rem; margin: 0 0 1.5rem; }
    .eyebrow { margin: 0 0 .5rem; color: #5b7f5f; font: 800 .67rem/1 'IBM Plex Mono', monospace; letter-spacing: .09em; text-transform: uppercase; }
    h1 { margin: 0; color: #163d2e; font-size: clamp(2rem, 5vw, 3.35rem); line-height: .95; letter-spacing: -.06em; }
    .page-heading p:not(.eyebrow) { max-width: 54ch; margin: .7rem 0 0; color: #597063; font-size: .9rem; }
    .new-place { flex: 0 0 auto; padding: .85rem 1rem; border-radius: .35rem; background: #1d5c46; color: #f1fad7; font-size: .85rem; font-weight: 800; text-decoration: none; }
    .catalogue { overflow: hidden; border: 1px solid #b6c9b6; background: rgb(252 253 250 / .93); box-shadow: 8px 8px 0 rgb(114 147 111 / .18); }
    .catalogue-tools { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding: 1rem 1.15rem; border-bottom: 1px solid #cfdbcc; }
    label { display: grid; gap: .38rem; color: #547163; font: 700 .67rem/1 'IBM Plex Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
    input { width: min(22rem, 70vw); padding: .6rem .7rem; border: 1px solid #b7c9b8; border-radius: .25rem; background: white; color: #183229; font: 500 .88rem/1 Inter, sans-serif; }
    .count { color: #6a8070; font: 700 .68rem/1 'IBM Plex Mono', monospace; white-space: nowrap; }
    .place-list { display: grid; }
    .place-row { display: grid; grid-template-columns: 4.4rem minmax(0, 1fr) auto 1rem; align-items: center; gap: 1rem; min-height: 4.75rem; padding: 0 1.15rem; border-bottom: 1px solid #d9e2d5; color: inherit; text-decoration: none; transition: background .15s ease; }
    .place-row:last-child { border-bottom: 0; }
    .place-row:hover { background: #edf5e5; }
    .date { color: #547262; font: 800 .68rem/1 'IBM Plex Mono', monospace; text-transform: uppercase; }
    .place-copy { display: grid; min-width: 0; gap: .25rem; }
    .place-copy strong { overflow: hidden; color: #1b3b30; font-size: .93rem; text-overflow: ellipsis; white-space: nowrap; }
    .place-copy small { overflow: hidden; color: #687d70; font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
    .status { padding: .3rem .45rem; border: 1px solid #c3cfbd; border-radius: 999px; color: #718073; font: 700 .62rem/1 'IBM Plex Mono', monospace; text-transform: uppercase; }
    .status.published { border-color: #8fba7c; color: #216345; background: #eaf6dd; }
    .arrow { color: #3b6e52; font-weight: 800; }
    .state { padding: 2.5rem 1.15rem; margin: 0; color: #697c70; text-align: center; } .error { color: #9a2519; }
    @media (max-width: 620px) { .page-heading { align-items: flex-start; flex-direction: column; } .catalogue-tools { align-items: flex-start; flex-direction: column; } .place-row { grid-template-columns: 3.75rem minmax(0, 1fr) 1rem; gap: .65rem; padding: 0 .8rem; } .status { display: none; } }
  `]
})
export class AdminPlaceListComponent implements OnInit {
  places: PlaceSummary[] = [];
  query = '';
  loading = true;
  error = '';

  constructor(private readonly placesService: AdminPlacesService) {}

  get filtered(): PlaceSummary[] {
    const query = this.query.trim().toLocaleLowerCase('it');
    if (!query) return this.places;
    return this.places.filter((place) => `${place.title} ${place.location}`.toLocaleLowerCase('it').includes(query));
  }

  async ngOnInit(): Promise<void> {
    try {
      this.places = await this.placesService.list();
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Impossibile caricare i luoghi.';
    } finally {
      this.loading = false;
    }
  }
}
