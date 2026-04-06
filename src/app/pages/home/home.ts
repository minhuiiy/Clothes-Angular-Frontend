import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, IProduct } from '../../core/services/product.service';
import { CategoryService, ICategory } from '../../core/services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  featuredProducts: IProduct[] = [];
  categories: ICategory[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getProducts({ size: 8, sort: 'featured' }).subscribe({
      next: (data) => {
        if (data && data.products) {
          this.featuredProducts = data.products;
          this.cdr.detectChanges();
        }
      }
    });

    this.categoryService.getAll();
    this.categoryService.categories$.subscribe(data => {
      // Just take top 3 for the home page cards
      if (data && data.length > 0) {
         this.categories = data.slice(0, 3);
         this.cdr.detectChanges();
      }
    });
  }
}

