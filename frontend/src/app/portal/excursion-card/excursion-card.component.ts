import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Excursion } from '../../shared/excursion.model';
import { durationLabel, formatDateRange } from '../../shared/excursion-dates';
import { primaryDifficulty } from '../../shared/difficulty';
import { sectionColor } from '../../shared/section-color';
import { HlmCard, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmCardContent, HlmCardFooter } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { AnalyticsService } from '../../core/analytics.service';

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
  templateUrl: './excursion-card.component.html',
  styleUrl: './excursion-card.component.css'
})
export class ExcursionCardComponent {
  @Input() excursion!: Excursion;
  @Input() selected = false;
  @Output() selectExcursion = new EventEmitter<Excursion>();
  private analytics = inject(AnalyticsService);

  trackDetailsClick(event: Event): void {
    event.stopPropagation();
    this.analytics.trackCaiLink(event, this.excursion.link, this.excursion.organizer, 'escursione');
  }

  get tone() {
    return primaryDifficulty(this.excursion.category);
  }

  get sectionTone(): string {
    return sectionColor(this.excursion.organizer);
  }

  get located(): boolean {
    return Number.isFinite(this.excursion.lat) && Number.isFinite(this.excursion.lng);
  }

  get dateLabel(): string {
    return formatDateRange(this.excursion.date, this.excursion.dateEnd);
  }

  get meta(): string {
    const parts = [this.excursion.location];
    const stay = durationLabel(this.excursion.days);
    if (stay) {
      parts.push(stay);
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
