import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Excursion } from './excursion.model';
import {
  DEFAULT_FILTERS,
  FilterState,
  availableMonths,
  availableRegions,
  dateBounds,
  hasActiveFilters
} from './excursion-filters';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="filter-bar" aria-label="Filtri">
      <div class="filter-inner">
        <div class="filter-groups">
          <div class="filter-group" role="group" aria-label="Filtra per difficoltà">
            <p class="filter-label">Difficoltà</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.category === 'all'" (click)="set('category', 'all')">Tutte</button>
              <button type="button" class="filter-chip" data-diff="T" aria-label="Turistico" [class.filter-chip-active]="filters.category === 'T'" (click)="set('category', 'T')">T</button>
              <button type="button" class="filter-chip" data-diff="E" aria-label="Escursionistico" [class.filter-chip-active]="filters.category === 'E'" (click)="set('category', 'E')">E</button>
              <button type="button" class="filter-chip" data-diff="EE" aria-label="Esperti" [class.filter-chip-active]="filters.category === 'EE'" (click)="set('category', 'EE')">EE</button>
              <button type="button" class="filter-chip" data-diff="EEA" aria-label="Attrezzatura" [class.filter-chip-active]="filters.category === 'EEA'" (click)="set('category', 'EEA')">EEA</button>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per durata">
            <p class="filter-label">Durata</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === 'all'" (click)="set('duration', 'all')">Tutte</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === 'le4'" (click)="set('duration', 'le4')">≤4h</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === '4-6'" (click)="set('duration', '4-6')">4–6h</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === '6-8'" (click)="set('duration', '6-8')">6–8h</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === 'gt8'" (click)="set('duration', 'gt8')">>8h</button>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per giorni della gita">
            <p class="filter-label">Giorni</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.days === 'all'" (click)="set('days', 'all')">Tutti</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.days === '1'" (click)="set('days', '1')">1</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.days === '2'" (click)="set('days', '2')">2</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.days === '3'" (click)="set('days', '3')">3</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.days === '4-10'" (click)="set('days', '4-10')">4–10</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.days === 'gt10'" (click)="set('days', 'gt10')">10+</button>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per distanza">
            <p class="filter-label">Distanza</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === 'all'" (click)="set('distance', 'all')">Tutte</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === 'le10'" (click)="set('distance', 'le10')">≤10 km</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === '10-15'" (click)="set('distance', '10-15')">10–15</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === '15-20'" (click)="set('distance', '15-20')">15–20</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === 'gt20'" (click)="set('distance', 'gt20')">>20</button>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per mese">
            <p class="filter-label">Mese</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.month === 'all'" (click)="set('month', 'all')">Tutti</button>
              <button
                type="button"
                class="filter-chip"
                *ngFor="let month of months"
                [class.filter-chip-active]="filters.month === month.id"
                (click)="set('month', month.id)"
              >{{ month.label }}</button>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per auto privata">
            <p class="filter-label">Auto privata</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'all'" (click)="set('privateCar', 'all')">Tutti</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'yes'" (click)="set('privateCar', 'yes')">Sì</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'no'" (click)="set('privateCar', 'no')">No</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'unknown'" (click)="set('privateCar', 'unknown')">Non indicato</button>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per regione">
            <p class="filter-label">Regione</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.region === 'all'" (click)="set('region', 'all')">Tutte</button>
              <button
                type="button"
                class="filter-chip"
                *ngFor="let region of regions"
                [class.filter-chip-active]="filters.region === region"
                (click)="set('region', region)"
              >{{ region }}</button>
            </div>
          </div>
        </div>

        <div class="filter-tools">
          <div class="filter-group" role="group" aria-label="Periodo da a">
            <p class="filter-label">Periodo</p>
            <div class="filter-fields">
              <label class="filter-field">
                <span>Da</span>
                <input
                  type="date"
                  aria-label="Data di inizio"
                  [value]="filters.dateFrom"
                  [attr.min]="bounds.min || null"
                  [attr.max]="filters.dateTo || bounds.max || null"
                  (input)="set('dateFrom', inputValue($event))"
                >
              </label>
              <label class="filter-field">
                <span>A</span>
                <input
                  type="date"
                  aria-label="Data di fine"
                  [value]="filters.dateTo"
                  [attr.min]="filters.dateFrom || bounds.min || null"
                  [attr.max]="bounds.max || null"
                  (input)="set('dateTo', inputValue($event))"
                >
              </label>
            </div>
          </div>

          <div class="filter-group" role="group" aria-label="Filtra per costo">
            <p class="filter-label">Costo</p>
            <div class="filter-fields">
              <button
                type="button"
                class="filter-chip"
                [class.filter-chip-active]="filters.vediSito"
                (click)="toggleVediSito()"
              >Vedi sito</button>
              <label class="filter-field">
                <span>€</span>
                <input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  placeholder="min"
                  aria-label="Costo minimo"
                  [value]="filters.costMin"
                  (input)="set('costMin', inputValue($event))"
                >
              </label>
              <label class="filter-field">
                <span>a</span>
                <input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  placeholder="max"
                  aria-label="Costo massimo"
                  [value]="filters.costMax"
                  (input)="set('costMax', inputValue($event))"
                >
              </label>
            </div>
          </div>

          <div class="filter-actions">
            <span class="filter-count">{{ resultCount }}</span>
            <button
              *ngIf="active"
              type="button"
              class="filter-reset"
              (click)="reset()"
            >Azzera</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .filter-bar {
      z-index: 10;
      width: 100%;
      max-height: 42vh;
      overflow-y: auto;
      border-bottom: 1px solid rgb(231 229 228);
      background: white;
    }

    @media (min-width: 768px) {
      .filter-bar {
        max-height: none;
        overflow: visible;
      }
    }

    .filter-inner {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      max-width: 96rem;
      margin: 0 auto;
      padding: 0.7rem 0.75rem 0.8rem;
    }

    @media (min-width: 768px) {
      .filter-inner {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    .filter-groups,
    .filter-tools {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 0.65rem 1.15rem;
    }

    .filter-group {
      min-width: 0;
    }

    .filter-label {
      margin: 0 0 0.3rem;
      color: rgb(120 113 108);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .filter-chips,
    .filter-fields,
    .filter-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: 1px solid rgb(203 213 225);
      border-radius: 9999px;
      background: white;
      min-height: 2rem;
      padding: 0.35rem 0.75rem;
      color: rgb(51 65 85);
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      transition: 150ms ease;
    }

    .filter-chip[data-diff] {
      font-family: 'IBM Plex Mono', ui-monospace, sans-serif;
    }

    .filter-chip[data-diff]::before {
      content: '';
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 999px;
      background: var(--diff);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--diff) 18%, white);
    }

    .filter-chip[data-diff='T'] { --diff: #2F9E6B; }
    .filter-chip[data-diff='E'] { --diff: #2F6FBD; }
    .filter-chip[data-diff='EE'] { --diff: #D4532B; }
    .filter-chip[data-diff='EEA'] { --diff: #1C1917; }

    .filter-chip:hover,
    .filter-chip:focus-visible {
      border-color: var(--diff, rgb(5 150 105));
      outline: none;
    }

    .filter-chip-active {
      border-color: var(--diff, rgb(6 78 59));
      background: var(--diff, rgb(6 78 59));
      color: white;
    }

    .filter-chip-active[data-diff]::before {
      background: white;
      box-shadow: none;
    }

    .filter-field {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      min-height: 2rem;
      padding: 0.15rem 0.55rem 0.15rem 0.65rem;
      border: 1px solid rgb(203 213 225);
      border-radius: 9999px;
      background: white;
      color: rgb(120 113 108);
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .filter-field input {
      min-width: 6.5rem;
      border: 0;
      background: transparent;
      color: rgb(28 25 23);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: none;
    }

    .filter-field input[type='number'] {
      min-width: 3.4rem;
      width: 3.6rem;
    }

    .filter-field input:focus {
      outline: none;
    }

    .filter-actions {
      margin-left: auto;
      min-height: 2rem;
    }

    .filter-count {
      min-width: 1.75rem;
      padding: 0.25rem 0.55rem;
      border-radius: 999px;
      background: rgb(209 250 229);
      color: rgb(6 78 59);
      font-size: 0.75rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      text-align: center;
    }

    .filter-reset {
      min-height: 2rem;
      padding: 0.35rem 0.75rem;
      border: 0;
      border-radius: 9999px;
      background: rgb(28 25 23);
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .filter-reset:focus-visible {
      outline: 2px solid rgb(6 78 59);
      outline-offset: 2px;
    }
  `]
})
export class FilterBarComponent {
  @Input() filters: FilterState = { ...DEFAULT_FILTERS };
  @Input() allExcursions: Excursion[] = [];
  @Input() resultCount = 0;
  @Output() filtersChange = new EventEmitter<FilterState>();

  get months() {
    return availableMonths(this.allExcursions);
  }

  get regions() {
    return availableRegions(this.allExcursions);
  }

  get bounds() {
    return dateBounds(this.allExcursions);
  }

  get active() {
    return hasActiveFilters(this.filters);
  }

  set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    this.filtersChange.emit({ ...this.filters, [key]: value });
  }

  toggleVediSito() {
    this.set('vediSito', !this.filters.vediSito);
  }

  reset() {
    this.filtersChange.emit({ ...DEFAULT_FILTERS });
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
