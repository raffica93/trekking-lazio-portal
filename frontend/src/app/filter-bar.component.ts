import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Excursion } from './excursion.model';
import {
  DEFAULT_FILTERS,
  FilterState,
  FilterTag,
  availableMonths,
  availableOrganizers,
  availableRegions,
  currentYearMonth,
  nextYearMonth,
  dateBounds,
  extraFilterTags,
  hasActiveFilters,
  isNextWeekSelected,
  landingFilters,
  monthLabel,
  nextWeekRange
} from './excursion-filters';
import { sectionColor } from './section-color';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="filter-bar" aria-label="Filtri">
      <div class="filter-band filter-band-time" role="region" aria-label="Quando">
        <p class="filter-band-title">Quando</p>
        <div class="filter-band-body">
          <div class="filter-group filter-group-months" role="group" aria-label="Filtra per mese">
            <p class="filter-label">Mese</p>
            <div class="filter-months">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.month === 'all'" (click)="set('month', 'all')">Tutti</button>
              <button
                type="button"
                class="filter-chip"
                *ngFor="let month of months"
                [class.filter-chip-active]="filters.month === month.id"
                [attr.aria-current]="filters.month === month.id ? 'date' : null"
                (click)="set('month', month.id)"
              >{{ month.label }}</button>
            </div>
          </div>

          <div class="filter-group filter-group-period" role="group" aria-label="Periodo da a">
            <p class="filter-label">Periodo</p>
            <div class="filter-chips">
              <button
                type="button"
                class="filter-chip"
                [class.filter-chip-active]="nextWeekOn"
                (click)="toggleNextWeek()"
              >Prossima settimana</button>
              <label class="filter-field filter-date-field">
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
              <label class="filter-field filter-date-field">
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

          <div class="filter-actions primary-filter-actions">
            <button
              type="button"
              class="filter-mega-toggle"
              [class.is-open]="megaOpen"
              [attr.aria-expanded]="megaOpen"
              aria-controls="filter-mega"
              (click)="toggleMega($event)"
            >
              Altri filtri
              <span *ngIf="tags.length" class="filter-badge">{{ tags.length }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="filter-tags" *ngIf="tags.length && !megaOpen">
        <button
          type="button"
          class="filter-tag"
          *ngFor="let tag of tags"
          (click)="clearTag(tag)"
        >{{ tag.label }} ×</button>
      </div>

      <div
        id="filter-mega"
        class="filter-mega"
        [class.open]="megaOpen"
        [attr.hidden]="megaOpen ? null : true"
      >
        <div class="filter-mega-heading">
          <p class="filter-mega-kicker">Caratteristiche</p>
          <button *ngIf="active" type="button" class="filter-reset" (click)="reset()">Azzera filtri</button>
        </div>
        <div class="filter-mega-grid">
          <div class="filter-stack route-extra-filter" role="group" aria-label="Filtra per durata">
            <p class="filter-label">Durata</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === 'le4'" (click)="toggle('duration', 'le4')">≤4h</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === '4-6'" (click)="toggle('duration', '4-6')">4–6h</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === '6-8'" (click)="toggle('duration', '6-8')">6–8h</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.duration === 'gt8'" (click)="toggle('duration', 'gt8')">&gt;8h</button>
            </div>
          </div>

          <div class="filter-stack route-extra-filter" role="group" aria-label="Filtra per distanza">
            <p class="filter-label">Distanza</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === 'le10'" (click)="toggle('distance', 'le10')">≤10 km</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === '10-15'" (click)="toggle('distance', '10-15')">10–15</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === '15-20'" (click)="toggle('distance', '15-20')">15–20</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.distance === 'gt20'" (click)="toggle('distance', 'gt20')">&gt;20</button>
            </div>
          </div>

          <div class="filter-stack route-extra-filter">
            <p class="filter-label">Sezione</p>
            <div class="filter-chips">
              <label class="filter-field filter-native-select" *ngIf="organizers.length">
                <span>Sezione</span>
                <select aria-label="Filtra per sezione negli altri filtri" [value]="filters.organizer" (change)="set('organizer', inputValue($event))">
                  <option value="all">Tutte</option>
                  <option *ngFor="let organizer of organizers" [value]="organizer">{{ organizer }}</option>
                </select>
              </label>
            </div>
          </div>

          <div class="filter-stack mobile-date-extra">
            <p class="filter-label">Periodo</p>
            <div class="filter-chips">
              <label class="filter-field">
                <span>Da</span>
                <input type="date" aria-label="Data di inizio" [value]="filters.dateFrom" [attr.min]="bounds.min || null" [attr.max]="filters.dateTo || bounds.max || null" (input)="set('dateFrom', inputValue($event))">
              </label>
              <label class="filter-field">
                <span>A</span>
                <input type="date" aria-label="Data di fine" [value]="filters.dateTo" [attr.min]="filters.dateFrom || bounds.min || null" [attr.max]="bounds.max || null" (input)="set('dateTo', inputValue($event))">
              </label>
            </div>
          </div>

          <div class="filter-stack" role="group" aria-label="Filtra per difficoltà">
            <p class="filter-label">Difficoltà</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.category === 'all'" (click)="set('category', 'all')">Tutte</button>
              <button type="button" class="filter-chip" data-diff="T" aria-label="Turistico" [class.filter-chip-active]="filters.category === 'T'" (click)="set('category', 'T')">T</button>
              <button type="button" class="filter-chip" data-diff="E" aria-label="Escursionistico" [class.filter-chip-active]="filters.category === 'E'" (click)="set('category', 'E')">E</button>
              <button type="button" class="filter-chip" data-diff="EE" aria-label="Esperti" [class.filter-chip-active]="filters.category === 'EE'" (click)="set('category', 'EE')">EE</button>
              <button type="button" class="filter-chip" data-diff="EEA" aria-label="Attrezzatura" [class.filter-chip-active]="filters.category === 'EEA'" (click)="set('category', 'EEA')">EEA</button>
            </div>
          </div>

          <div class="filter-stack" role="group" aria-label="Filtra per regione">
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

          <div class="filter-stack" role="group" aria-label="Filtra per giorni della gita">
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

          <div class="filter-stack" role="group" aria-label="Filtra per auto privata">
            <p class="filter-label">Auto privata</p>
            <div class="filter-chips">
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'all'" (click)="set('privateCar', 'all')">Tutti</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'yes'" (click)="set('privateCar', 'yes')">Sì</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'no'" (click)="set('privateCar', 'no')">No</button>
              <button type="button" class="filter-chip" [class.filter-chip-active]="filters.privateCar === 'unknown'" (click)="set('privateCar', 'unknown')">Non indicato</button>
            </div>
          </div>

          <div class="filter-stack" role="group" aria-label="Filtra per costo">
            <p class="filter-label">Costo</p>
            <div class="filter-chips">
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
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      z-index: 30;
    }

    .filter-bar {
      width: 100%;
      overflow: visible;
      border-bottom: 1px solid rgb(214 211 209);
      background: white;
    }

    .filter-band {
      display: grid;
      gap: 0.4rem 0.9rem;
      padding: 0.55rem 0.75rem;
    }

    .filter-band-time {
      background: white;
    }

    .filter-band-title {
      margin: 0;
      padding: 0.15rem 0 0.15rem 0.55rem;
      border-left: 3px solid #047857;
      color: #065f46;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .filter-band-body {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem 0.95rem;
      min-width: 0;
    }

    @media (min-width: 768px) {
      .filter-band {
        grid-template-columns: 6.8rem minmax(0, 1fr);
        align-items: center;
        padding: 0.55rem 1.5rem;
      }
    }

    .filter-group,
    .filter-stack {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 0.45rem;
    }

    .filter-stack {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.4rem;
    }

    .filter-group-months {
      flex: 1 1 16rem;
    }

    .filter-label {
      margin: 0;
      flex-shrink: 0;
      color: rgb(120 113 108);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .filter-stack .filter-label {
      margin: 0;
    }

    .filter-months,
    .filter-chips,
    .filter-actions,
    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
    }

    .filter-months {
      flex: 1;
      flex-wrap: nowrap;
      min-width: 0;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .filter-months .filter-chip {
      flex-shrink: 0;
    }

    .mobile-date-extra {
      display: none;
    }

    @media (min-width: 768px) {
      .filter-months {
        flex-wrap: wrap;
        overflow: visible;
      }
    }

    .filter-chip,
    .filter-mega-toggle,
    .filter-tag {
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
    .filter-chip:focus-visible,
    .filter-mega-toggle:hover,
    .filter-mega-toggle:focus-visible,
    .filter-tag:hover,
    .filter-tag:focus-visible {
      border-color: var(--diff, rgb(5 150 105));
      outline: none;
    }

    .filter-chip-active,
    .filter-mega-toggle.is-open {
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

    .filter-native-select select {
      min-width: 8rem;
      max-width: 12rem;
      border: 0;
      background: transparent;
      color: rgb(28 25 23);
      font-size: 0.75rem;
      font-weight: 700;
      outline: none;
    }

    .filter-select-trigger:focus-visible {
      outline: 2px solid rgb(6 78 59);
      outline-offset: 2px;
    }

    .filter-select {
      position: relative;
    }

    .filter-select-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      min-width: 8.5rem;
      max-width: 13rem;
      min-height: 2rem;
      padding: 0.2rem 0.55rem 0.2rem 0.65rem;
      border: 1px solid rgb(203 213 225);
      border-radius: 9999px;
      background: white;
      color: rgb(28 25 23);
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      transition: 150ms ease;
    }

    .filter-select-trigger:hover,
    .filter-select-open .filter-select-trigger {
      border-color: var(--section, rgb(5 150 105));
    }

    .filter-select-active .filter-select-trigger {
      border-color: color-mix(in srgb, var(--section, rgb(6 78 59)) 70%, rgb(203 213 225));
      background: color-mix(in srgb, var(--section, rgb(6 78 59)) 12%, white);
    }

    .filter-select-value {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .filter-select-chevron {
      flex-shrink: 0;
      width: 0.38rem;
      height: 0.38rem;
      margin-left: 0.15rem;
      border-right: 1.6px solid rgb(120 113 108);
      border-bottom: 1.6px solid rgb(120 113 108);
      transform: translateY(-1px) rotate(45deg);
    }

    .filter-select-open .filter-select-chevron {
      transform: translateY(1px) rotate(-135deg);
    }

    .filter-select-menu {
      position: absolute;
      top: calc(100% + 0.35rem);
      left: 0;
      z-index: 40;
      display: grid;
      gap: 0.1rem;
      min-width: 14.5rem;
      max-height: 18rem;
      margin: 0;
      padding: 0.35rem;
      overflow: auto;
      scrollbar-width: thin;
      list-style: none;
      border: 1px solid rgb(214 211 209);
      border-radius: 0.85rem;
      background: white;
      box-shadow: 0 16px 36px rgb(18 38 28 / 0.16);
    }

    .filter-select-menu li {
      margin: 0;
      padding: 0;
    }

    .filter-select-menu button {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 0.5rem;
      min-height: 2rem;
      padding: 0.35rem 0.6rem;
      border: 0;
      border-radius: 0.55rem;
      background: transparent;
      color: rgb(28 25 23);
      font-size: 0.78rem;
      font-weight: 600;
      line-height: 1.2;
      text-align: left;
      cursor: pointer;
    }

    .filter-select-option-label {
      min-width: 0;
      flex: 1;
    }

    .filter-select-menu button:hover,
    .filter-select-menu button:focus-visible {
      background: color-mix(in srgb, var(--section, rgb(5 150 105)) 12%, white);
      outline: none;
    }

    .filter-select-menu button.is-selected {
      background: color-mix(in srgb, var(--section, rgb(6 78 59)) 16%, white);
      color: rgb(28 25 23);
      font-weight: 800;
    }

    .filter-select .section-dot {
      width: 0.5rem;
      height: 0.5rem;
      flex-shrink: 0;
      border-radius: 999px;
      box-shadow: 0 0 0 1.5px rgb(255 255 255 / 0.9);
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

    .filter-badge {
      min-width: 1.1rem;
      padding: 0.05rem 0.3rem;
      border-radius: 999px;
      background: rgb(190 242 100);
      color: rgb(6 78 59);
      font-size: 0.65rem;
      font-weight: 800;
    }

    .filter-mega-toggle.is-open .filter-badge {
      background: white;
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

    .filter-tags {
      padding: 0 0.75rem 0.5rem;
      background: #f3f6f3;
    }

    @media (min-width: 768px) {
      .filter-tags {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    .filter-tag {
      min-height: 1.6rem;
      padding: 0.2rem 0.55rem;
      background: rgb(236 253 245);
      border-color: rgb(167 243 208);
      color: rgb(6 78 59);
      font-size: 0.68rem;
    }

    .filter-mega {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 30;
      padding: 0.85rem 0.75rem 1.1rem;
      border-bottom: 1px solid rgb(214 211 209);
      background: #f3f6f3;
      box-shadow: 0 18px 36px rgb(18 38 28 / 0.14);
    }

    .filter-mega.open {
      display: block;
    }

    .filter-mega-kicker {
      margin: 0;
      padding-left: 0.55rem;
      border-left: 3px solid #047857;
      color: #065f46;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .filter-mega-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.7rem;
    }

    @media (min-width: 768px) {
      .filter-mega {
        padding: 0.95rem 1.5rem 1.2rem;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .filter-mega.open {
        animation: filter-mega-in 140ms ease-out;
      }
    }

    @keyframes filter-mega-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: none; }
    }

    .filter-mega-grid {
      display: grid;
      gap: 1rem 1.5rem;
      width: 100%;
      max-width: none;
      margin: 0;
      grid-template-columns: 1fr;
    }

    @media (min-width: 768px) {
      .filter-mega-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (min-width: 1200px) {
      .filter-mega-grid {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }
  `]
})
export class FilterBarComponent {
  private host = inject(ElementRef<HTMLElement>);

  @Input() filters: FilterState = landingFilters();
  @Input() allExcursions: Excursion[] = [];
  @Input() resultCount = 0;
  @Output() filtersChange = new EventEmitter<FilterState>();

  megaOpen = false;
  sectionOpen = false;

  get months() {
    const months = availableMonths(this.allExcursions);
    const needed = new Set([currentYearMonth(), nextYearMonth()]);
    const extra = [...needed]
      .filter((id) => !months.some((month) => month.id === id))
      .map((id) => ({ id, label: monthLabel(id) }));
    return extra.length ? [...months, ...extra].sort((a, b) => a.id.localeCompare(b.id)) : months;
  }

  get regions() {
    return availableRegions(this.allExcursions);
  }

  get organizers() {
    return availableOrganizers(this.allExcursions);
  }

  get bounds() {
    return dateBounds(this.allExcursions);
  }

  get active() {
    return hasActiveFilters(this.filters);
  }

  get nextWeekOn() {
    return isNextWeekSelected(this.filters);
  }

  get tags(): FilterTag[] {
    return extraFilterTags(this.filters);
  }

  get sectionLabel(): string {
    return this.filters.organizer === 'all' ? 'Tutte' : this.filters.organizer;
  }

  colorFor(organizer: string): string {
    return sectionColor(organizer);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!this.host.nativeElement.contains(target)) {
      this.megaOpen = false;
      this.sectionOpen = false;
      return;
    }
    if (this.sectionOpen && !target?.closest('.filter-select')) {
      this.sectionOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.megaOpen = false;
    this.sectionOpen = false;
  }

  toggleMega(event: Event) {
    event.stopPropagation();
    this.megaOpen = !this.megaOpen;
    if (this.megaOpen) this.sectionOpen = false;
  }

  toggleSection(event: Event) {
    event.stopPropagation();
    this.sectionOpen = !this.sectionOpen;
    if (this.sectionOpen) this.megaOpen = false;
  }

  chooseSection(value: string, event: Event) {
    event.stopPropagation();
    this.sectionOpen = false;
    this.set('organizer', value);
  }

  onSectionTriggerKey(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      if (!this.sectionOpen && event.key === 'ArrowDown') {
        event.preventDefault();
        this.sectionOpen = true;
        this.megaOpen = false;
      }
    }
  }

  set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    if (key === 'month') {
      this.filtersChange.emit({ ...this.filters, month: value as string, dateFrom: '', dateTo: '' });
      return;
    }
    this.filtersChange.emit({ ...this.filters, [key]: value });
  }

  toggle<K extends 'duration' | 'distance'>(key: K, value: FilterState[K]) {
    this.set(key, this.filters[key] === value ? 'all' as FilterState[K] : value);
  }

  toggleNextWeek() {
    if (isNextWeekSelected(this.filters)) {
      this.filtersChange.emit({ ...this.filters, dateFrom: '', dateTo: '', month: 'all' });
      return;
    }
    const range = nextWeekRange();
    this.filtersChange.emit({ ...this.filters, dateFrom: range.from, dateTo: range.to, month: 'all' });
  }

  toggleVediSito() {
    this.set('vediSito', !this.filters.vediSito);
  }

  clearTag(tag: FilterTag) {
    this.filtersChange.emit({ ...this.filters, ...tag.patch });
  }

  reset() {
    this.megaOpen = false;
    this.sectionOpen = false;
    this.filtersChange.emit({ ...DEFAULT_FILTERS });
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
