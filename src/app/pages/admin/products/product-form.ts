import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class AdminProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  productId: number | null = null;
  categories: any[] = [];
  brands: any[] = [];
  
  product: any = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    color: '',
    isFeatured: false,
    category: null,
    brand: null
  };

  ngOnInit() {
    this.fetchCategories();
    this.fetchBrands();
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditMode = true;
      this.fetchProduct(this.productId);
    }
  }

  fetchCategories() {
    this.categoryService.getAllCategories().subscribe(res => this.categories = res);
  }

  fetchBrands() {
    this.brandService.getAllBrands().subscribe(res => this.brands = res);
  }

  fetchProduct(id: number) {
    this.productService.getProductById(id).subscribe(res => {
      this.product = res;
      // Đồng bộ đối tượng để hiển thị đúng trong select
      if (this.product.categoryName) {
        this.product.category = this.categories.find(c => c.name === this.product.categoryName);
      }
      if (this.product.brandName) {
        this.product.brand = this.brands.find(b => b.name === this.product.brandName);
      }
    });
  }

  onSubmit() {
    const payload = {
      ...this.product,
      price: Number(this.product.price),
      stock: Number(this.product.stock),
      categoryId: this.product.category?.id,
      brandId: this.product.brand?.id || null,
      variants: [] // Gửi mảng trống để Backend sử dụng stock/color mặc định
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => alert('Lỗi: ' + err.message)
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => alert('Lỗi: ' + err.message)
      });
    }
  }
}
