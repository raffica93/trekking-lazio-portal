import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmCardFooter],hlm-card-footer',
  host: {
    'data-slot': 'card-footer',
  },
})
export class HlmCardFooter {
  constructor() {
    classes(
      () =>
        'flex items-center rounded-b-lg px-3.5 py-2 group-data-[size=sm]/card:px-3 [.border-t]:pt-2',
    );
  }
}
