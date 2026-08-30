import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExcursionService } from './excursion.service';
import { Excursion } from './excursion.model';
import { ExcursionCardComponent } from './excursion-card.component';
import { FilterBarComponent } from './filter-bar.component';
import { MapComponent } from './map.component';
import { FilterState, applyFilters, landingFilters } from './excursion-filters';
import { primaryDifficulty } from './difficulty';
import { RouterOutlet } from '@angular/router';

registerLocaleData(localeIt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ExcursionCardComponent,
    FilterBarComponent,
    MapComponent,
    RouterOutlet
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-stone-100 text-slate-900">
      <!-- Header -->
      <header class="z-20 border-b border-emerald-950/20 bg-emerald-900 px-3 py-3 text-white shadow-lg md:px-6">
        <div class="mx-auto flex max-w-screen-2xl items-center gap-2.5 md:gap-3">
          <img
            src="logo.png"
            width="40"
            height="40"
            alt=""
            class="h-9 w-9 shrink-0 rounded-[0.7rem] object-cover shadow-sm md:h-10 md:w-10"
          >
          <div class="flex min-w-0 items-center gap-2">
            <span class="truncate text-lg font-black tracking-[-0.04em] md:text-2xl">TREKKING LAZIO</span>
            <span class="rounded-sm bg-lime-300 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-emerald-950">PORTAL</span>
          </div>
        </div>
      </header>

      <app-filter-bar
        class="z-10 w-full shrink-0"
        [filters]="filters"
        [allExcursions]="allExcursions"
        [resultCount]="excursions.length"
        (filtersChange)="onFiltersChange($event)"
      ></app-filter-bar>

      <!-- Main Content -->
      <main class="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <!-- Sidebar / List -->
        <aside
          class="flex h-[42%] w-full shrink-0 flex-col border-r border-stone-200 bg-stone-50 md:h-full md:w-[24rem] lg:w-[27rem]"
        >
          <div class="flex items-center justify-end border-b border-stone-200 bg-white px-4 py-2">
            <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold tabular-nums text-emerald-900">{{ excursions.length }}</span>
          </div>
          
          <div #excursionList class="flex-1 overflow-y-auto p-3 md:p-4">
            <div *ngIf="loading" class="flex justify-center p-8">
               <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
            
            <ng-container *ngIf="!loading">
              <app-excursion-card 
                *ngFor="let ex of excursions" 
                [excursion]="ex"
                [selected]="ex.id === selectedId"
                (selectExcursion)="onCardSelect($event)"
              ></app-excursion-card>
              
              <div *ngIf="excursions.length === 0" class="text-center p-8 text-slate-500">
                <p>Nessuna escursione con questi filtri.</p>
                <button
                  type="button"
                  class="mt-3 text-sm font-bold text-emerald-800 underline"
                  (click)="resetFilters()"
                >Azzera filtri</button>
              </div>
            </ng-container>
          </div>
        </aside>

        <!-- Map -->
        <section class="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <app-map
            [excursions]="excursions"
            [selectedId]="selectedId"
            class="h-full w-full"
            (selectExcursion)="onMapSelect($event)"
          ></app-map>

          <article
            *ngIf="selectedExcursion && detailOpen"
            class="detail-sheet"
            tabindex="-1"
            aria-label="Dettaglio escursione"
          >
            <div class="detail-header">
              <p class="detail-kicker">
                {{ selectedExcursion.date | date:'EEEE d MMMM y':'':'it' }}
                <span
                  class="difficulty-chip"
                  [style.background-color]="tone(selectedExcursion).color"
                >{{ tone(selectedExcursion).code }}</span>
              </p>
              <button
                type="button"
                class="detail-close"
                aria-label="Chiudi dettaglio"
                (click)="clearSelection()"
              >×</button>
            </div>
            <h2>{{ selectedExcursion.title }}</h2>
            <p class="detail-place">{{ placeLine(selectedExcursion) }}</p>
            <p *ngIf="selectedExcursion.summary" class="detail-summary">{{ selectedExcursion.summary }}</p>
            <dl class="detail-meta" *ngIf="metaItems(selectedExcursion).length">
              <div *ngFor="let item of metaItems(selectedExcursion)">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
            <p *ngIf="selectedExcursion.difficultyNote" class="detail-note">{{ selectedExcursion.difficultyNote }}</p>
            <a
              class="detail-cta"
              [href]="selectedExcursion.link"
              target="_blank"
              rel="noopener noreferrer"
            >Dettagli</a>
          </article>
        </section>
      </main>
    </div>
    <router-outlet />
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .detail-sheet {
      position: absolute;
      right: 0.75rem;
      bottom: 0.75rem;
      left: 0.75rem;
      z-index: 1100;
      display: grid;
      gap: 0.55rem;
      max-height: min(62vh, 34rem);
      overflow: auto;
      padding: 1rem 1.05rem 1.1rem;
      border: 1px solid rgb(28 25 23 / 0.12);
      border-radius: 0.75rem;
      background: rgb(255 255 255 / 0.97);
      box-shadow: 0 16px 40px rgb(18 38 28 / 0.18);
    }

    .detail-sheet h2 {
      margin: 0;
      color: #1c1917;
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.25;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .detail-kicker {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin: 0;
      color: #57534e;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: capitalize;
    }

    .detail-place,
    .detail-summary,
    .detail-note {
      margin: 0;
      color: #44403c;
      font-size: 13px;
      line-height: 1.45;
    }

    .detail-note {
      color: #57534e;
      font-size: 12px;
    }

    .detail-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.55rem 0.75rem;
      margin: 0.15rem 0 0;
    }

    .detail-meta div {
      min-width: 0;
    }

    .detail-meta dt {
      color: #78716c;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .detail-meta dd {
      margin: 0.1rem 0 0;
      color: #1c1917;
      font-size: 13px;
    }

    .detail-cta {
      justify-self: start;
      margin-top: 0.2rem;
      padding: 0.45rem 0.8rem;
      border-radius: 0.45rem;
      background: #065f46;
      color: #ecfccb;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
    }

    .detail-close {
      flex-shrink: 0;
      width: 1.8rem;
      height: 1.8rem;
      border: 0;
      border-radius: 999px;
      background: rgb(245 245 244);
      color: #44403c;
      font-size: 1.35rem;
      line-height: 1;
      cursor: pointer;
    }

    .difficulty-chip {
      display: inline-flex;
      min-width: 1.75rem;
      height: 1.5rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      padding: 0 0.4rem;
      color: #fff;
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: none;
    }

    @media (min-width: 768px) {
      .detail-sheet {
        left: auto;
        width: 26rem;
      }
    }
  `]
})
export class App implements OnInit {
  private excursionService = inject(ExcursionService);
  private changeDetector = inject(ChangeDetectorRef);
  @ViewChild('excursionList') private excursionList?: ElementRef<HTMLElement>;
  
  allExcursions: Excursion[] = [];
  excursions: Excursion[] = [];
  loading = true;
  filters: FilterState = landingFilters();
  selectedId: string | null = null;
  detailOpen = false;

  ngOnInit() {
    this.fetchExcursions();
  }

  fetchExcursions() {
    this.loading = true;
    this.excursionService.getExcursions().subscribe({
      next: (data) => {
        this.allExcursions = data;
        this.applyFilters();
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.loading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  get selectedExcursion(): Excursion | null {
    return this.excursions.find(excursion => excursion.id === this.selectedId) ?? null;
  }

  onFiltersChange(filters: FilterState) {
    this.filters = filters;
    this.applyFilters();
  }

  resetFilters() {
    this.filters = landingFilters();
    this.applyFilters();
  }

  onCardSelect(excursion: Excursion) {
    this.selectedId = excursion.id;
    this.changeDetector.markForCheck();
  }

  onMapSelect(excursion: Excursion) {
    this.selectedId = excursion.id;
    this.detailOpen = true;
    this.changeDetector.detectChanges();
    this.scrollSelectedIntoView();
  }

  clearSelection() {
    this.selectedId = null;
    this.detailOpen = false;
    this.changeDetector.markForCheck();
  }

  tone(excursion: Excursion) {
    return primaryDifficulty(excursion.category);
  }

  placeLine(excursion: Excursion): string {
    return [excursion.location, excursion.region, excursion.startPlace].filter(Boolean).join(' · ');
  }

  metaItems(excursion: Excursion): { label: string; value: string }[] {
    const items: { label: string; value: string }[] = [];
    if (excursion.days && excursion.days > 1) {
      items.push({ label: 'Durata', value: `${excursion.days} giorni` });
    }
    if (excursion.distanceKm != null) {
      items.push({ label: 'Distanza', value: `${excursion.distanceKm} km` });
    }
    if (excursion.elevationM != null) {
      items.push({ label: 'Quota', value: `${excursion.elevationM} m` });
    }
    if (this.isUseful(excursion.time)) {
      items.push({ label: 'Tempo', value: excursion.time });
    }
    if (this.isUseful(excursion.cost)) {
      items.push({ label: 'Costo', value: excursion.cost });
    }
    if (this.isUseful(excursion.transport)) {
      items.push({ label: 'Trasporto', value: excursion.transport! });
    }
    if (this.isUseful(excursion.organizer)) {
      items.push({ label: 'Organizzatore', value: excursion.organizer });
    }
    if (this.isUseful(excursion.terrain)) {
      items.push({ label: 'Terreno', value: excursion.terrain! });
    }
    return items;
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.detailOpen) {
      this.clearSelection();
    }
  }

  private applyFilters() {
    this.excursions = applyFilters(this.allExcursions, this.filters);
    if (this.selectedId && !this.excursions.some(excursion => excursion.id === this.selectedId)) {
      this.selectedId = null;
      this.detailOpen = false;
    }
    this.changeDetector.markForCheck();
  }

  private scrollSelectedIntoView() {
    const card = this.excursionList?.nativeElement.querySelector(
      `[data-excursion-id="${this.selectedId}"]`
    );
    if (card && typeof card.scrollIntoView === 'function') {
      card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  private isUseful(value?: string | null): boolean {
    return Boolean(value) && !/^vedi sito$/i.test(value!.trim());
  }
}
