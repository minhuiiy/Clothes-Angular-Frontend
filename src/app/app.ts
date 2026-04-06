import { Component, signal, inject, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb';
import { slideInAnimation } from './shared/animations/page-transitions';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, BreadcrumbComponent, CommonModule],
  templateUrl: './app.html',
  animations: [slideInAnimation]
})
export class App implements OnInit {
  private contexts = inject(ChildrenOutletContexts);
  private router = inject(Router);
  
  protected readonly title = signal('TrendyBox - Thời trang cao cấp');
  isAdminRoute = signal(false);

  ngOnInit() {
    // Initial check
    this.isAdminRoute.set(window.location.pathname.startsWith('/admin'));

    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin'));
    });
  }

  prepareRoute() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
