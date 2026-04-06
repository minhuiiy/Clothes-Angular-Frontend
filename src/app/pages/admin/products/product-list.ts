import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class AdminProductListComponent implements OnInit {
  protected readonly Math = Math;
  private productService = inject(ProductService);
  
  products: any[] = [];
  totalItems = 0;
  currentPage = 0;
  pageSize = 10;
  keyword = '';
  loading = false;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts(this.keyword, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.products;
        this.totalItems = res.totalItems;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.fetchProducts();
  }

  deleteProduct(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.fetchProducts();
        },
        error: (err) => alert('Lỗi khi xóa sản phẩm: ' + err.message)
      });
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalItems) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchProducts();
    }
  }
}
