import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: any[] = [];
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;
  keyword = '';

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.fetchProducts();
    });
  }

  fetchProducts(page: number = 0): void {
    this.productService.getProducts(this.keyword, page).subscribe({
      next: (data) => {
        this.products = data.products;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.totalItems = data.totalItems;
      },
      error: (err) => {
        console.error('Error fetching products', err);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.fetchProducts(page);
    }
  }

  getPlaceholderImage(index: number): string {
    // Generate beautiful placeholder images from Unsplash
    return `https://source.unsplash.com/random/400x500/?fashion,clothes&sig=${index}`;
  }
}
