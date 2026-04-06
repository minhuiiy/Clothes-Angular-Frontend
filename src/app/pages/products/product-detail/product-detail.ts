import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth';

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
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productService.getProductById(+idParam).subscribe({
        next: (data) => {
          this.product = data;
          this.cdr.detectChanges();
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
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        // Success silent or maybe a toast? For now just silent
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
  }
}
