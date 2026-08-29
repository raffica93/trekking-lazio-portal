import { ChangeDetectorRef, Component, OnInit, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExcursionService } from './excursion.service';
import { Excursion } from './excursion.model';
import { ExcursionCardComponent } from './excursion-card.component';
import { MapComponent } from './map.component';

registerLocaleData(localeIt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ExcursionCardComponent,
    MapComponent
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-stone-100 text-slate-900">
      <!-- Header -->
      <header class="z-10 border-b border-emerald-950/20 bg-emerald-900 px-3 py-3 text-white shadow-lg md:px-6">
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

      <!-- Main Content -->
      <main class="flex min-h-0 flex-1 overflow-hidden">
        <!-- Sidebar / List -->
        <aside
          class="h-full w-full flex-col border-r border-stone-200 bg-stone-50 md:w-[24rem] md:shrink-0 lg:w-[27rem]"
          [ngClass]="activeView === 'calendar' ? 'flex' : 'hidden md:flex'"
        >
          <div class="border-b border-stone-200 bg-white px-4 py-4">
            <div class="flex items-end justify-between gap-3">
              <div>
                <p class="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Calendario CAI Roma</p>
                <h2 class="text-xl font-black tracking-tight text-slate-900">Prossime escursioni</h2>
              </div>
              <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900">{{ excursions.length }}</span>
            </div>
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
              
              <div *ngIf="excursions.length === 0" class="text-center p-8 text-slate-400">
                Nessuna escursione trovata.
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
          
          <!-- Quick filters overlay -->
          <div class="absolute left-3 right-3 top-3 z-[1000] md:left-auto md:right-4 md:top-4">
             <div class="rounded-xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur md:w-72">
                <h4 class="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Difficoltà del percorso</h4>
                <div class="flex flex-wrap gap-1.5" aria-label="Filtra per difficoltà">
                   <button type="button" class="filter-chip" [class.filter-chip-active]="activeCategory === 'all'" (click)="resetFilters()">Tutte</button>
                   <button type="button" class="filter-chip" [class.filter-chip-active]="activeCategory === 'T'" (click)="filterByCategory('T')">T</button>
                   <button type="button" class="filter-chip" [class.filter-chip-active]="activeCategory === 'E'" (click)="filterByCategory('E')">E</button>
                   <button type="button" class="filter-chip" [class.filter-chip-active]="activeCategory === 'EE'" (click)="filterByCategory('EE')">EE</button>
                   <button type="button" class="filter-chip" [class.filter-chip-active]="activeCategory === 'EEA'" (click)="filterByCategory('EEA')">EEA</button>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .filter-chip {
      border: 1px solid rgb(203 213 225);
      border-radius: 9999px;
      background: white;
      padding: 0.35rem 0.7rem;
      color: rgb(51 65 85);
      font-size: 0.75rem;
      font-weight: 800;
      line-height: 1;
      transition: 150ms ease;
    }

    .filter-chip:hover,
    .filter-chip:focus-visible {
      border-color: rgb(5 150 105);
      outline: none;
    }

    .filter-chip-active {
      border-color: rgb(6 78 59);
      background: rgb(6 78 59);
      color: white;
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
  activeCategory = 'all';

  ngOnInit() {
    this.fetchExcursions();
  }

  fetchExcursions() {
    this.loading = true;
    this.excursionService.getExcursions().subscribe({
      next: (data) => {
        this.allExcursions = data;
        this.excursions = data;
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
  }

  filterByCategory(category: string) {
    this.activeCategory = category;
    this.excursions = this.allExcursions.filter(ex =>
      ex.category.toUpperCase().split(/[^A-Z]+/).includes(category)
    );
  }

  resetFilters() {
    this.activeCategory = 'all';
    this.excursions = [...this.allExcursions];
  }
}
