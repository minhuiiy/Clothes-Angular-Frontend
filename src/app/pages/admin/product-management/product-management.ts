import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, IProduct } from '../../../core/services/product.service';
import { CategoryService, ICategory } from '../../../core/services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-admin-v2">
      <div class="page-header">
        <h1>QUẢN LÝ SẢN PHẨM</h1>
        <button class="add-pill-btn" (click)="openModal()">+ Thêm sản phẩm</button>
      </div>

      <div class="filter-bar">
        <div class="filter-icon">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"></path></svg>
        </div>
        <div class="filter-pills">
          <div class="pill">Màu sắc <span>⌵</span></div>
          <div class="pill">Kích thước <span>⌵</span></div>
          <div class="pill">Giá <span>⌵</span></div>
        </div>
        <div class="sort-pill">Sắp xếp theo <span>⌵</span></div>
      </div>

      <div class="product-grid">
        <div class="product-card" *ngFor="let prod of productList; trackBy: trackByProductId"
             [@cardAnimation]>
          <div class="card-image">
            <img [src]="getImageUrl(prod)" [alt]="prod.name"
                 (error)="onImageError($event)">
          </div>
          <div class="card-body">
            <div class="meta-row">
              <span class="meta-item">{{ prod.stock || 0 }} Size</span>
              <span class="meta-item">{{ getColorCount(prod) }} Màu sắc</span>
            </div>
            <h3 class="product-title">{{ prod.name }}</h3>
            <div class="price-row">
              <span class="price-val">{{ formatPrice(prod.price) }} VNĐ</span>
              <span class="sold-val">Đã bán: {{ formatSoldCount(prod.soldCount || 0) }}</span>
            </div>
            <div class="action-grid">
               <button class="action-btn buy-now">
                 <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"></path></svg>
                 Mua ngay
               </button>
               <button class="action-btn add-cart">
                 <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                 Thêm vào giỏ hàng
               </button>
               <button class="action-btn edit-btn" (click)="openModal(prod)">
                 <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                 Sửa
               </button>
               <button class="action-btn delete-btn" (click)="deleteProduct(prod.id!)">
                 <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                 Xóa
               </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="productList.length === 0">
          <div class="empty-icon">📦</div>
          <p>Chưa có sản phẩm nào</p>
          <button class="add-pill-btn" (click)="openModal()">+ Thêm sản phẩm đầu tiên</button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{isEdit ? 'Cập nhật' : 'Thêm mới'}} sản phẩm</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          
          <div class="modal-content">
            <div class="form-group">
              <label>Tên sản phẩm</label>
              <input type="text" [(ngModel)]="currentProduct.name" placeholder="Nhập tên sản phẩm...">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Giá bán (VNĐ)</label>
                <input type="number" [(ngModel)]="currentProduct.price" placeholder="0">
              </div>
              <div class="form-group">
                <label>Số lượng kho</label>
                <input type="number" [(ngModel)]="currentProduct.stock" placeholder="0">
              </div>
            </div>

            <div class="form-group">
              <label>Danh mục</label>
              <select [(ngModel)]="currentProduct.categoryId">
                <option [ngValue]="null">Chọn danh mục</option>
                <option *ngFor="let cat of categoryList" [value]="cat.id">{{cat.name}}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea [(ngModel)]="currentProduct.description" placeholder="Nhập mô tả sản phẩm..." rows="3"></textarea>
            </div>

            <div class="form-group">
              <label>Hình ảnh sản phẩm</label>
              <div class="image-upload-wrapper">
                <input type="file" (change)="onFileSelected($event)" accept="image/*" class="file-input">
                <div class="upload-placeholder" *ngIf="!imagePreviewUrl">
                  <span class="upload-icon">
                    <svg width="40" height="40" fill="none" stroke="#94a3b8" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </span>
                  <span class="upload-text">Nhấn để chọn ảnh</span>
                  <span class="upload-hint">PNG, JPG, WEBP (Tối đa 5MB)</span>
                </div>
                <div class="image-preview" *ngIf="imagePreviewUrl">
                  <img [src]="imagePreviewUrl" alt="Preview">
                  <div class="change-overlay">
                    <svg width="20" height="20" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
                    Thay đổi ảnh
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeModal()">Hủy bỏ</button>
            <button class="btn-save" (click)="saveProduct()" [disabled]="!currentProduct.name">
              {{ isEdit ? 'Cập nhật' : 'Lưu thông tin' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===================== LAYOUT ===================== */
    .product-admin-v2 {
      padding: 0;
      background-color: white;
      min-height: 100%;
    }

    /* ===================== PAGE HEADER ===================== */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .add-pill-btn {
      background-color: #0f172a;
      color: white;
      padding: 12px 28px;
      border-radius: 30px;
      font-weight: 700;
      border: 2px solid #0f172a;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      letter-spacing: 0.3px;
    }

    .add-pill-btn:hover {
      background-color: white;
      color: #0f172a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
    }

    /* ===================== FILTER BAR ===================== */
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .filter-icon {
      color: #475569;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: 0.2s;
    }

    .filter-icon:hover {
      background-color: #f1f5f9;
    }

    .filter-pills {
      display: flex;
      gap: 10px;
    }

    .pill, .sort-pill {
      background-color: #f1f5f9;
      padding: 10px 18px;
      border-radius: 24px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      user-select: none;
    }

    .pill:hover, .sort-pill:hover {
      background-color: #e2e8f0;
      border-color: #cbd5e1;
    }

    .pill span, .sort-pill span {
      font-size: 10px;
      font-weight: 400;
      color: #64748b;
    }

    .sort-pill {
      margin-left: auto;
    }

    /* ===================== PRODUCT GRID ===================== */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    /* ===================== PRODUCT CARD ===================== */
    .product-card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid #e2e8f0;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08),
                  0 4px 12px rgba(15, 23, 42, 0.04);
      border-color: #cbd5e1;
    }

    /* ===================== CARD IMAGE ===================== */
    .card-image {
      height: 280px;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 12px;
      transition: transform 0.4s ease;
    }

    .product-card:hover .card-image img {
      transform: scale(1.05);
    }

    /* ===================== CARD BODY ===================== */
    .card-body {
      padding: 16px 18px 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .meta-item {
      font-size: 12px;
      color: #0f172a;
      font-weight: 800;
      letter-spacing: 0.2px;
    }

    .product-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 40px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .price-val {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
    }

    .sold-val {
      font-size: 12px;
      font-weight: 700;
      color: #ef4444;
    }

    /* ===================== ACTION BUTTONS ===================== */
    .action-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 6px;
    }

    .action-btn {
      padding: 7px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .buy-now {
      background-color: #ef4444;
      color: white;
    }

    .buy-now:hover {
      background-color: #dc2626;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
    }

    .add-cart {
      background-color: #e2e8f0;
      color: #334155;
    }

    .add-cart:hover {
      background-color: #cbd5e1;
    }

    .edit-btn {
      background-color: #fbbf24;
      color: white;
    }

    .edit-btn:hover {
      background-color: #f59e0b;
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.35);
    }

    .delete-btn {
      background-color: #ef4444;
      color: white;
    }

    .delete-btn:hover {
      background-color: #dc2626;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
    }

    /* ===================== EMPTY STATE ===================== */
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
      color: #94a3b8;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state p {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    /* ===================== MODAL ===================== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-container {
      background: white;
      width: 520px;
      max-width: 90vw;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 60px -12px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      padding: 24px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
    }

    .modal-header h2 {
      font-size: 20px;
      font-weight: 800;
      margin: 0;
      color: #0f172a;
    }

    .close-btn {
      background: #f1f5f9;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #64748b;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
    }

    .close-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .modal-content {
      padding: 24px 28px;
      max-height: 65vh;
      overflow-y: auto;
    }

    .modal-content::-webkit-scrollbar {
      width: 6px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .form-group {
      margin-bottom: 18px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 700;
      font-size: 13px;
      color: #475569;
      letter-spacing: 0.2px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      font-size: 14px;
      color: #0f172a;
      transition: all 0.2s ease;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: white;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* ===================== IMAGE UPLOAD ===================== */
    .image-upload-wrapper {
      height: 200px;
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafbfc;
      transition: all 0.25s ease;
    }

    .image-upload-wrapper:hover {
      border-color: #3b82f6;
      background: #f0f7ff;
    }

    .file-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
    }

    .upload-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .upload-text {
      font-size: 14px;
      font-weight: 700;
      color: #64748b;
    }

    .upload-hint {
      font-size: 11px;
      color: #94a3b8;
    }

    .image-preview {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: white;
      padding: 8px;
    }

    .change-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      opacity: 0;
      transition: 0.3s ease;
      font-size: 13px;
      font-weight: 700;
    }

    .image-preview:hover .change-overlay {
      opacity: 1;
    }

    /* ===================== MODAL ACTIONS ===================== */
    .modal-actions {
      padding: 20px 28px;
      background: #f8fafc;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      border-top: 1px solid #f1f5f9;
    }

    .btn-cancel {
      padding: 12px 24px;
      background: transparent;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      color: #475569;
      font-size: 14px;
      transition: 0.2s;
    }

    .btn-cancel:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .btn-save {
      padding: 12px 28px;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
      transition: 0.2s;
    }

    .btn-save:hover:not(:disabled) {
      background: #1e293b;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
    }

    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
})
export class ProductManagementComponent implements OnInit {
  productList: IProduct[] = [];
  categoryList: ICategory[] = [];
  showModal = false;
  isEdit = false;
  currentProduct: any = { name: '', price: 0, stock: 0, categoryId: null, description: '' };
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts({ size: 100 }).subscribe({
      next: (data) => {
        this.productList = data.products || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  loadCategories(): void {
    this.categoryService.categories$.subscribe({
      next: (cats) => {
        this.categoryList = cats;
        this.cdr.detectChanges();
      }
    });
  }

  trackByProductId(index: number, product: IProduct): number {
    return product.id || index;
  }

  getImageUrl(product: IProduct): string {
    if (product.imageUrl) {
      if (product.imageUrl.startsWith('http')) {
        return product.imageUrl;
      }
      return 'http://localhost:8080' + product.imageUrl;
    }
    return 'https://placehold.co/400x500/f8fafc/94a3b8?text=No+Image';
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/400x500/f8fafc/94a3b8?text=No+Image';
  }

  getColorCount(product: IProduct): number {
    if (product.color) {
      return product.color.split(',').length;
    }
    return 1;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  formatSoldCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  openModal(prod?: IProduct): void {
    if (prod) {
      this.isEdit = true;
      this.currentProduct = {
        ...prod,
        categoryId: prod.category?.id
      };
      this.imagePreviewUrl = this.getImageUrl(prod);
    } else {
      this.isEdit = false;
      this.currentProduct = { name: '', price: 0, stock: 0, categoryId: null, description: '' };
      this.imagePreviewUrl = null;
    }
    this.selectedFile = null;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.imagePreviewUrl = null;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct(): void {
    const payload: Partial<IProduct> = {
      name: this.currentProduct.name || '',
      price: Number(this.currentProduct.price) || 0,
      stock: Number(this.currentProduct.stock) || 0,
      description: this.currentProduct.description || '',
    };
    
    // Add categoryId if it's selected
    if (this.currentProduct.categoryId) {
      payload.categoryId = this.currentProduct.categoryId as any;
    }

    if (this.isEdit) {
      this.productService.updateProduct(this.currentProduct.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => console.error('Error creating product:', err)
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Xác nhận xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }
}
