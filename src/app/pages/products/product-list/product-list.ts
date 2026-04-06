import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth';
import { BrandService } from '../../../core/services/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private brandService = inject(BrandService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State using Signals
  products = signal<any[]>([]);
  brands = signal<any[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalItems = signal(0);
  loading = signal(false);
  
  // Filters
  keyword = signal('');
  categorySlug = signal<string | null>(null);
  selectedBrand = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  selectedColor = signal<string | null>(null);
  selectedSize = signal<string | null>(null);
  sortBy = signal('newest');

  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe(data => this.brands.set(data));

    this.route.params.subscribe(params => {
      this.categorySlug.set(params['slug'] || null);
      this.fetchProducts();
    });

    this.route.queryParams.subscribe(params => {
      this.keyword.set(params['keyword'] || '');
      this.selectedBrand.set(params['brand'] ? +params['brand'] : null);
      this.minPrice.set(params['minPrice'] ? +params['minPrice'] : null);
      this.maxPrice.set(params['maxPrice'] ? +params['maxPrice'] : null);
      this.selectedColor.set(params['color'] || null);
      this.selectedSize.set(params['size'] || null);
      this.sortBy.set(params['sort'] || 'newest');
      this.fetchProducts();
    });
  }

  fetchProducts(page: number = 0): void {
    this.loading.set(true);
    const params: any = {
      keyword: this.keyword(),
      page: page,
      sort: this.sortBy(),
      categorySlug: this.categorySlug(),
      brandId: this.selectedBrand(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      color: this.selectedColor(),
      size: this.selectedSize()
    };

    // Clean null params
    Object.keys(params).forEach(key => params[key] == null && delete params[key]);

    this.productService.getProductsWithFilters(params).subscribe({
      next: (data) => {
        this.products.set(data.products);
        this.currentPage.set(data.currentPage);
        this.totalPages.set(data.totalPages);
        this.totalItems.set(data.totalItems);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading.set(false);
      }
    });
  }

  updateFilters(newFilters: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...newFilters, page: 0 },
      queryParamsHandling: 'merge'
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.fetchProducts(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPlaceholderImage(index: number): string {
    return `https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=500&sig=${index}`;
  }

  toggleWishlist(productId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.wishlistService.toggleWishlist(productId);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
