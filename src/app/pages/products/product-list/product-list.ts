import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  
  // High-level category groups
  mainCategories: any[] = [];
  accessoryCategories: any[] = [];
  
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;
  keyword = '';
  categoryId: number | null = null;
  isFilterOpen = false;
  sort = 'newest';
  colors = [
    { name: 'Đen', value: 'BLACK', hex: '#000000' },
    { name: 'Trắng', value: 'WHITE', hex: '#FFFFFF' },
    { name: 'Xanh dương', value: 'BLUE', hex: '#0000FF' },
    { name: 'Đỏ', value: 'RED', hex: '#FF0000' }
  ];

  priceRanges = [
    { label: 'Dưới 500.000₫', min: 0, max: 500000 },
    { label: '1.000.000₫ - 2.000.000₫', min: 1000000, max: 2000000 },
    { label: 'Từ 2.000.000₫', min: 2000000, max: null }
  ];
  filters: any = {
    categoryId: null,
    brandId: null,
    minPrice: null,
    maxPrice: null,
    color: null,
    isPromoted: false,
    isFeatured: false
  };


  constructor(private productService: ProductService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.categoryId = params['categoryId'] != null ? Number(params['categoryId']) : null;
      this.fetchProducts();
    });
  }

  loadFilterOptions(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      // Group categories: "Main" (no parent) and "Accessories" (parent slug is phu-kien)
      // Note: We'll find the parent with slug 'phu-kien' to identify accessories
      const accParent = cats.find(c => c.slug === 'phu-kien');
      const accParentId = accParent ? accParent.id : null;

      this.mainCategories = cats.filter(c => !c.parent_id && c.slug !== 'phu-kien' && c.slug !== 'sale');
      this.accessoryCategories = cats.filter(c => c.parent_id === accParentId);
    });
    this.productService.getBrands().subscribe(brs => this.brands = brs);
  }

  fetchProducts(page: number = 0): void {
    console.log('Fetching products for page:', page, 'keyword:', this.keyword, 'category:', this.categoryId);
    this.productService.getProducts({ keyword: this.keyword, page, categoryId: this.categoryId ?? undefined }).subscribe({
      next: (data) => {
        console.log('Products API success:', data);
        this.products = data.products || [];
        this.currentPage = data.currentPage || 0;
        this.totalPages = data.totalPages || 0;
        this.totalItems = data.totalItems || 0;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products API:', err)
    });
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  applyPriceRange(range: any): void {
    this.filters.minPrice = range.min;
    this.filters.maxPrice = range.max;
    this.applyFilters();
  }

  selectColor(color: string): void {
    this.filters.color = this.filters.color === color ? null : color;
    this.applyFilters();
  }

  applyFilters(): void {
    this.fetchProducts(0);
  }

  resetFilters(): void {
    this.filters = {
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      color: null,
      isPromoted: false,
      isFeatured: false
    };
    this.fetchProducts(0);
  }

  onSortChange(event: any): void {
    this.sort = event.target.value;
    this.fetchProducts(0);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.fetchProducts(page);
    }
  }

  getPlaceholderImage(index: number): string {
    return `https://source.unsplash.com/random/400x500/?fashion,clothes&sig=${index}`;
  }
}
