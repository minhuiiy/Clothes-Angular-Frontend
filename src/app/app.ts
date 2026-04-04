import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, BreadcrumbComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('clothes-ui');
}
