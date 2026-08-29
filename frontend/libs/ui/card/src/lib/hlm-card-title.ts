import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmCardTitle]',
  host: {
    'data-slot': 'card-title',
  },
})
export class HlmCardTitle {
  constructor() {
    classes(() => 'text-[15px] leading-snug font-bold tracking-tight text-stone-900 group-data-[size=sm]/card:text-sm');
  }
}
