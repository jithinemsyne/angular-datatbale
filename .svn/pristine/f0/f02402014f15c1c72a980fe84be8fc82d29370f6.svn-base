import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const deleteRowAnimation = trigger('deleteRowAnimation', [
  transition('* => *', [
    query(':leave', [
      stagger(0, [
        animate('300ms ease-out',
          style({ transform: 'translateX(-50px)', opacity: 0, height: 0, backgroundColor: '#FF7B7B' }))
      ])
    ], { optional: true }),
    query(':enter', [
      stagger(0, [
        style({ transform: 'translateX(-50px)', opacity: 0.5, backgroundColor: '#83F28F' }),
        animate('300ms ease-out',
          style({ transform: 'translateX(0px)', opacity: 0, height: 0, backgroundColor: '#FFFFFF' }))
      ])
    ], { optional: true })
  ])
]);
