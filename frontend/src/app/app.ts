import { Component, OnInit, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ExcursionService } from './excursion.service';
import { Excursion } from './excursion.model';
import { ExcursionCardComponent } from './excursion-card.component';
import { MapComponent } from './map.component';
import { HlmButton } from '@spartan-ng/helm/button';

registerLocaleData(localeIt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ExcursionCardComponent,
    MapComponent,
    HlmButton
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'it-IT' }],
  template: `
    <div class="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <!-- Header -->
      <header class="bg-emerald-700 text-white p-4 shadow-lg z-10">
        <div class="container mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-black tracking-tighter italic">TREKKING LAZIO</span>
            <span class="bg-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-bold">PORTAL</span>
          </div>
          <nav class="flex gap-4">
            <button hlmBtn variant="ghost" class="text-white hover:bg-emerald-600">Calendario</button>
            <button hlmBtn variant="ghost" class="text-white hover:bg-emerald-600">Mappa</button>
          </nav>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex overflow-hidden">
        <!-- Sidebar / List -->
        <aside class="w-full md:w-1/3 lg:w-1/4 h-full bg-white border-r flex flex-col">
          <div class="p-4 border-b bg-slate-50">
            <h2 class="text-xl font-bold text-slate-800">Escursioni in programma</h2>
            <p class="text-sm text-slate-500">Aggiornato da CAI Lazio</p>
          </div>
          
          <div class="flex-1 p-4 overflow-y-auto">
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
        <section class="flex-1 relative">
          <app-map [excursions]="excursions" class="h-full w-full"></app-map>
          
          <!-- Quick filters overlay -->
          <div class="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
             <div class="bg-white/90 backdrop-blur p-3 rounded-lg shadow-xl border w-64">
                <h4 class="font-bold text-sm mb-2 uppercase text-slate-500 tracking-wider">Filtra per Area</h4>
                <div class="flex flex-wrap gap-1">
                   <button hlmBtn variant="outline" size="xs" (click)="filterByArea('roma')">Roma</button>
                   <button hlmBtn variant="outline" size="xs" (click)="filterByArea('viterbo')">Viterbo</button>
                   <button hlmBtn variant="outline" size="xs" (click)="filterByArea('latina')">Latina</button>
                   <button hlmBtn variant="outline" size="xs" (click)="filterByArea('rieti')">Rieti</button>
                   <button hlmBtn variant="outline" size="xs" (click)="resetFilters()">Tutte</button>
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
  `]
})
export class App implements OnInit {
  private excursionService = inject(ExcursionService);
  
  allExcursions: Excursion[] = [];
  excursions: Excursion[] = [];
  loading = true;

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
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.loading = false;
      }
    });
  }

  filterByArea(area: string) {
    this.excursions = this.allExcursions.filter(ex => 
      ex.organizer.toLowerCase().includes(area.toLowerCase()) || 
      ex.location.toLowerCase().includes(area.toLowerCase())
    );
  }

  resetFilters() {
    this.excursions = [...this.allExcursions];
  }
}
