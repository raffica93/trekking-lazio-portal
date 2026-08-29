import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmCard],hlm-card',
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'size()',
  },
})
export class HlmCard {
  public readonly size = input<'sm' | 'default'>('default');

  constructor() {
    classes(
      () =>
        'group/card bg-card text-card-foreground flex flex-col gap-3 overflow-hidden rounded-lg py-0 text-sm ring-1 ring-stone-300/80 shadow-[0_1px_2px_rgba(18,38,28,0.05)] has-[>img:first-child]:pt-0 data-[size=sm]:gap-2 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg',
    );
  }
}
