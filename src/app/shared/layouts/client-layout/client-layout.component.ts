import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="client-layout">
      <!-- Minimalist client layout for now, routing to home/products -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .client-layout { min-height: 100vh; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientLayoutComponent {}
