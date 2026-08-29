import { ChangeDetectorRef, Component, OnInit, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExcursionService } from './excursion.service';
import { Excursion } from './excursion.model';
import { ExcursionCardComponent } from './excursion-card.component';
import { FilterBarComponent } from './filter-bar.component';
import { MapComponent } from './map.component';
import { DEFAULT_FILTERS, FilterState, applyFilters } from './excursion-filters';

registerLocaleData(localeIt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ExcursionCardComponent,
    FilterBarComponent,
    MapComponent
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-stone-100 text-slate-900">
      <!-- Header -->
      <header class="z-20 border-b border-emerald-950/20 bg-emerald-900 px-3 py-3 text-white shadow-lg md:px-6">
        <div class="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-2">
            <span class="truncate text-lg font-black tracking-[-0.04em] md:text-2xl">TREKKING LAZIO</span>
            <span class="rounded-sm bg-lime-300 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-emerald-950">PORTAL</span>
          </div>
          <nav class="flex shrink-0 rounded-lg bg-emerald-950/50 p-1" aria-label="Vista principale">
            <button
              type="button"
              class="rounded-md px-3 py-1.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              [ngClass]="activeView === 'calendar' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-50 hover:bg-white/10'"
              [attr.aria-pressed]="activeView === 'calendar'"
              (click)="setView('calendar')"
            >Calendario</button>
            <button
              type="button"
              class="rounded-md px-3 py-1.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              [ngClass]="activeView === 'map' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-50 hover:bg-white/10'"
              [attr.aria-pressed]="activeView === 'map'"
              (click)="setView('map')"
            >Mappa</button>
          </nav>
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
      <main class="flex min-h-0 flex-1 overflow-hidden">
        <!-- Sidebar / List -->
        <aside
          class="h-full w-full flex-col border-r border-stone-200 bg-stone-50 md:w-[24rem] md:shrink-0 lg:w-[27rem]"
          [ngClass]="activeView === 'calendar' ? 'flex' : 'hidden'"
        >
          <div class="flex items-center justify-end border-b border-stone-200 bg-white px-4 py-2">
            <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold tabular-nums text-emerald-900">{{ excursions.length }}</span>
          </div>
          
          <div class="flex-1 overflow-y-auto p-3 md:p-4">
            <div *ngIf="loading" class="flex justify-center p-8">
               <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
            </div>
            
            <ng-container *ngIf="!loading">
              <app-excursion-card 
                *ngFor="let ex of excursions" 
                [excursion]="ex"
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
        <section
          class="relative min-w-0 flex-1"
          [ngClass]="activeView === 'map' ? 'flex' : 'hidden md:flex'"
        >
          <app-map [excursions]="excursions" class="h-full w-full"></app-map>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class App implements OnInit {
  private excursionService = inject(ExcursionService);
  private changeDetector = inject(ChangeDetectorRef);
  
  allExcursions: Excursion[] = [];
  excursions: Excursion[] = [];
  loading = true;
  activeView: 'calendar' | 'map' = 'calendar';
  filters: FilterState = { ...DEFAULT_FILTERS };

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

  setView(view: 'calendar' | 'map') {
    this.activeView = view;
    this.changeDetector.markForCheck();
  }

  onFiltersChange(filters: FilterState) {
    this.filters = filters;
    this.applyFilters();
  }

  resetFilters() {
    this.filters = { ...DEFAULT_FILTERS };
    this.applyFilters();
  }

  private applyFilters() {
    this.excursions = applyFilters(this.allExcursions, this.filters);
    this.changeDetector.markForCheck();
  }
}
