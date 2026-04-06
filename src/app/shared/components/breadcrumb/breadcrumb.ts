import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs = signal<Breadcrumb[]>([]);

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs.set(this.buildBreadcrumbs(this.activatedRoute.root));
    });
    
    this.breadcrumbs.set(this.buildBreadcrumbs(this.activatedRoute.root));
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const label = route.routeConfig?.data?.['breadcrumb'];
    let path = route.routeConfig?.path || '';

    const lastRoutePart = path.split('/').pop();
    if (lastRoutePart?.startsWith(':')) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
    }

    const nextUrl = path ? `${url}/${path}` : url;
    const newBreadcrumbs = label ? [...breadcrumbs, { label, url: nextUrl || '/' }] : [...breadcrumbs];

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
