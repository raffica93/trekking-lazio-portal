import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Excursion } from './excursion.model';
import { primaryDifficulty } from './difficulty';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmCardContent, HlmCardFooter } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-excursion-card',
  standalone: true,
  imports: [
    CommonModule,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    HlmCardFooter,
    HlmButton
  ],
  host: {
    '[attr.data-excursion-id]': 'excursion?.id',
    '[class.is-selected]': 'selected'
  },
  template: `
    <article
      hlmCard
      size="sm"
      class="excursion-card mb-2.5 flex-row"
      [class.is-selected]="selected"
      (click)="selectExcursion.emit(excursion)"
    >
      <span class="excursion-card-rail" [style.background-color]="tone.color" aria-hidden="true"></span>
      <div class="min-w-0 flex-1">
        <div hlmCardHeader>
          <div class="flex items-start justify-between gap-3">
            <p hlmCardDescription class="m-0 text-[11px] font-medium capitalize tracking-wide text-stone-500">
              {{ excursion.date | date:'EEE d MMM':'':'it' }}
            </p>
            <span
              class="difficulty-chip"
              [style.background-color]="tone.color"
              [attr.aria-label]="'Difficoltà ' + tone.label"
            >{{ tone.code }}</span>
          </div>
          <h3 hlmCardTitle>{{ excursion.title }}</h3>
        </div>
        <div hlmCardContent *ngIf="meta || excursion.summary">
          <p class="truncate text-[13px] text-stone-600">{{ meta }}</p>
          <p *ngIf="excursion.summary" class="excursion-summary">{{ excursion.summary }}</p>
        </div>
        <div hlmCardFooter class="justify-end border-t border-stone-100">
          <a
            [href]="excursion.link"
            target="_blank"
            rel="noopener noreferrer"
            hlmBtn
            variant="link"
            size="sm"
            class="h-auto px-0 text-emerald-800"
          >Dettagli</a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host.is-selected {
      display: block;
    }

    .excursion-card {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 0;
      cursor: pointer;
    }

    .excursion-card.is-selected {
      box-shadow: 0 0 0 2px #065f46, 0 8px 20px rgb(18 38 28 / 0.12);
    }

    .excursion-card-rail {
      width: 6px;
      flex-shrink: 0;
    }

    .excursion-summary {
      display: -webkit-box;
      margin: 0.35rem 0 0;
      overflow: hidden;
      color: #78716c;
      font-size: 12px;
      line-height: 1.4;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .excursion-card.is-selected .excursion-summary {
      -webkit-line-clamp: unset;
      overflow: visible;
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
      line-height: 1;
    }
  `]
})
export class ExcursionCardComponent {
  @Input() excursion!: Excursion;
  @Input() selected = false;
  @Output() selectExcursion = new EventEmitter<Excursion>();

  get tone() {
    return primaryDifficulty(this.excursion.category);
  }

  get meta(): string {
    const parts = [this.excursion.location];
    if (this.excursion.days && this.excursion.days > 1) {
      parts.push(`${this.excursion.days} giorni`);
    }
    if (this.excursion.transport && this.isUseful(this.excursion.transport)) {
      parts.push(this.excursion.transport);
    }
    if (this.excursion.distanceKm != null) {
      parts.push(`${this.excursion.distanceKm} km`);
    }
    if (this.excursion.elevationM != null) {
      parts.push(`${this.excursion.elevationM} m`);
    }
    if (this.isUseful(this.excursion.time)) {
      parts.push(this.excursion.time);
    }
    if (this.isUseful(this.excursion.cost)) {
      parts.push(this.excursion.cost);
    }
    return parts.filter(Boolean).join(' · ');
  }

  private isUseful(value: string): boolean {
    return Boolean(value) && !/^vedi sito$/i.test(value.trim());
  }
}
