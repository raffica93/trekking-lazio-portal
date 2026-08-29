import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Excursion } from './excursion.model';
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
  template: `
    <article hlmCard class="mb-3 overflow-hidden border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div hlmCardHeader>
        <p class="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">{{ excursion.category }} · {{ excursion.organizer }}</p>
        <h3 hlmCardTitle class="text-lg font-black leading-snug tracking-tight text-slate-900">{{ excursion.title }}</h3>
        <p hlmCardDescription class="mt-1 capitalize">{{ excursion.date | date:'fullDate':'':'it' }}</p>
      </div>
      <div hlmCardContent>
        <div class="flex flex-col gap-1.5 text-sm text-slate-600">
          <p><strong>Località:</strong> {{ excursion.location }}</p>
          <p><strong>Costo:</strong> {{ excursion.cost }}</p>
          <p><strong>Orario:</strong> {{ excursion.time }}</p>
        </div>
      </div>
      <div hlmCardFooter class="flex justify-end">
        <a [href]="excursion.link" target="_blank" rel="noopener noreferrer" hlmBtn variant="outline" size="sm">Apri dettagli</a>
      </div>
    </article>
  `
})
export class ExcursionCardComponent {
  @Input() excursion!: Excursion;
}
