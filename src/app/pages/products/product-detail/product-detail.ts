import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  product: any;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productService.getProductById(+idParam).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          console.error('Error fetching product details', err);
          this.router.navigate(['/products']);
        }
      });
    }
  }

  getPlaceholderImage(id: number): string {
    return `https://source.unsplash.com/random/800x1000/?fashion,clothes&sig=${id}`;
  }

  increaseQuantity() {
    if (this.quantity < (this.product?.stock || 99)) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    alert(`Đã thêm ${this.quantity} sản phẩm "${this.product.name}" vào giỏ hàng!`);
  }
}
