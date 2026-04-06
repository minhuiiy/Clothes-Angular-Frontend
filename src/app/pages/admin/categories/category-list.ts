import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class AdminCategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories: any[] = [];
  loading = false;
  
  // For adding/editing
  showModal = false;
  editingCategory: any = null;
  categoryForm = {
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parent_id: null as number | null
  };

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.editingCategory = null;
    this.categoryForm = { name: '', slug: '', description: '', imageUrl: '', parent_id: null };
    this.showModal = true;
  }

  openEditModal(category: any) {
    this.editingCategory = category;
    this.categoryForm = { 
      name: category.name, 
      slug: category.slug, 
      description: category.description || '',
      imageUrl: category.imageUrl, 
      parent_id: category.parent_id 
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory.id, this.categoryForm).subscribe({
        next: () => {
          this.fetchCategories();
          this.closeModal();
        },
        error: (err) => alert('Lỗi khi cập nhật danh mục: ' + err.message)
      });
    } else {
      this.categoryService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.fetchCategories();
          this.closeModal();
        },
        error: (err) => alert('Lỗi khi tạo danh mục: ' + err.message)
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Điều này có thể ảnh hưởng đến các sản phẩm thuộc danh mục?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.fetchCategories();
        },
        error: (err) => alert('Lỗi khi xóa danh mục: ' + err.message)
      });
    }
  }
}
