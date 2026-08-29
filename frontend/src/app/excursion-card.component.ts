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
    <div hlmCard class="mb-4">
      <div hlmCardHeader>
        <h3 hlmCardTitle class="text-lg font-bold">{{ excursion.title }}</h3>
        <p hlmCardDescription>{{ excursion.date | date:'fullDate':'':'it' }} - {{ excursion.organizer }}</p>
      </div>
      <div hlmCardContent>
        <div class="flex flex-col gap-1 text-sm">
          <p><strong>Località:</strong> {{ excursion.location }}</p>
          <p><strong>Categoria:</strong> {{ excursion.category }}</p>
          <p><strong>Costo:</strong> {{ excursion.cost }}</p>
          <p><strong>Orario:</strong> {{ excursion.time }}</p>
        </div>
      </div>
      <div hlmCardFooter class="flex justify-end">
        <a [href]="excursion.link" target="_blank" hlmBtn variant="outline" size="sm">Dettagli</a>
      </div>
    </div>
  `
})
export class ExcursionCardComponent {
  @Input() excursion!: Excursion;
}
