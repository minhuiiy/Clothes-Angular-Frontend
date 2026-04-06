import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../../core/services/brand.service';

interface Brand {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-list.html'
})
export class BrandListComponent implements OnInit {
  private brandService = inject(BrandService);

  brands = signal<Brand[]>([]);
  loading = signal(false);
  
  // Modal state
  showModal = signal(false);
  isEditing = signal(false);
  currentBrandId = signal<number | null>(null);
  
  brandForm = {
    name: '',
    description: '',
    imageUrl: ''
  };

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.loading.set(true);
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải thương hiệu:', err);
        alert('Có lỗi xảy ra khi tải danh sách thương hiệu.');
        this.loading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentBrandId.set(null);
    this.brandForm = { name: '', description: '', imageUrl: '' };
    this.showModal.set(true);
  }

  openEditModal(brand: Brand) {
    this.isEditing.set(true);
    this.currentBrandId.set(brand.id);
    this.brandForm = { 
      name: brand.name, 
      description: brand.description || '', 
      imageUrl: brand.imageUrl || '' 
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveBrand() {
    if (!this.brandForm.name.trim()) {
      alert('Tên thương hiệu không được để trống.');
      return;
    }

    if (this.isEditing() && this.currentBrandId()) {
      this.brandService.updateBrand(this.currentBrandId()!, this.brandForm).subscribe({
        next: () => {
          this.loadBrands();
          this.closeModal();
        },
        error: (err) => {
          console.error('Lỗi cập nhật:', err);
          alert('Không thể cập nhật thương hiệu.');
        }
      });
    } else {
      this.brandService.createBrand(this.brandForm).subscribe({
        next: () => {
          this.loadBrands();
          this.closeModal();
        },
        error: (err) => {
          console.error('Lỗi tạo mới:', err);
          alert('Không thể tạo thương hiệu mới.');
        }
      });
    }
  }

  deleteBrand(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này? Toàn bộ thiết kế thuộc thương hiệu có thể bị ảnh hưởng.')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.loadBrands();
        },
        error: (err) => {
          console.error('Lỗi khi xóa:', err);
          alert('Không thể xóa thương hiệu. Có thể thương hiệu này đang liên kết với các sản phẩm.');
        }
      });
    }
  }
}
