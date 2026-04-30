import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <h1>Page Not Found</h1>
      <a routerLink="/" class="b2">Back Home</a>
    </main>
  `,
  styles: [`
    .not-found {
      min-height: 60vh;
      padding-top: 140px;
      text-align: center;
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 30px;
      font-style: italic;
    }
  `]
})
export class NotFoundComponent {}
