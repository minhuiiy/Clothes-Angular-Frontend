import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Cart, CartItem } from '../../shared/models/cart.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  // Convert Observable to Signal
  cart = toSignal(this.cartService.cart$);

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.id, newQuantity).subscribe();
    }
  }

  removeItem(itemId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.cartService.removeItem(itemId).subscribe();
    }
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
