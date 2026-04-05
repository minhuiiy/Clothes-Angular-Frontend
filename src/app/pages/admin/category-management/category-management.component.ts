import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, ICategory } from '../../../core/services/category.service';

// 1. Tạo một Interface dành riêng cho giao diện (View Model)
// Nó kế thừa mọi thứ từ ICategory gốc và thêm trường productCount
export interface ICategoryVM extends ICategory {
  productCount?: number;
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagementComponent implements OnInit {

  // 2. Thay thế any[] bằng mảng chứa dữ liệu chuẩn ICategoryVM
  allCategories: ICategoryVM[] = [];
  filteredCategories: ICategoryVM[] = [];
  searchTerm: string = '';
  showModal = false;
  isEdit = false;

  // 3. Dùng Partial<> vì khi tạo mới, currentCategory chưa có 'id'
  currentCategory: Partial<ICategoryVM> = { name: '', description: '', status: true };

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    // Ép kiểu data trả về từ service là mảng ICategory
    this.categoryService.categories$.subscribe((data: ICategory[]) => {
      this.allCategories = data.map((cat) => ({
        ...cat,
        productCount: Math.floor(Math.random() * 50) // Placeholder
      }));
      this.onSearchChange();
      this.cdr.markForCheck();
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.allCategories.filter(cat =>
      // Kiểm tra an toàn xem cat.name có tồn tại không trước khi toLowerCase()
      cat.name && cat.name.toLowerCase().includes(term)
    );
    this.cdr.markForCheck();
  }

  // 4. Khai báo rõ ràng tham số cat có kiểu là ICategoryVM
  toggleStatus(cat: ICategoryVM): void {
    const updated = { ...cat, status: !cat.status };

    // Đảm bảo id tồn tại trước khi gọi API update
    if (cat.id !== undefined) {
      this.categoryService.update(cat.id, updated as ICategory).subscribe();
    }
  }

  openModal(cat?: ICategoryVM): void {
    if (cat) {
      this.isEdit = true;
      this.currentCategory = { ...cat };
    } else {
      this.isEdit = false;
      this.currentCategory = { name: '', description: '', status: true };
    }
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  saveCategory(): void {
    if (this.isEdit && this.currentCategory.id !== undefined) {
      // Cập nhật
      this.categoryService.update(this.currentCategory.id, this.currentCategory as ICategory).subscribe(() => this.closeModal());
    } else {
      // Thêm mới
      this.categoryService.create(this.currentCategory as ICategory).subscribe(() => this.closeModal());
    }
  }

  // Khai báo rõ kiểu number cho id
  deleteCategory(id: number | undefined): void {
    if (id !== undefined && confirm('Xác nhận xóa danh mục này?')) {
      this.categoryService.delete(id).subscribe();
    }
  }
}