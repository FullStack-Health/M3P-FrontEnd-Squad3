import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-50%', opacity: 0 })
        ], { optional: true }),
        query(':leave', [
          style({ left: '0%', opacity: 1 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('500ms ease-in-out', style({ left: '50%', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('500ms ease-in-out', style({ left: '0%', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
  
})
export class AppComponent {
  title = 'labinc';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
