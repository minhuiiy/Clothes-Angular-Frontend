import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { OrderService, CheckoutRequest } from '../../core/services/order.service';
import { Cart } from '../../shared/models/cart.model';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart | null>;
  order: Order | null = null;
  isSubmitting = false;
  errorMessage = '';

  form: CheckoutRequest = {
    shippingFullName: '',
    shippingPhone: '',
    shippingAddress: '',
    note: '',
    paymentMethod: 'COD'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  placeOrder(cart: Cart): void {
    if (this.isSubmitting) return;

    if (!cart.items || cart.items.length === 0) {
      this.errorMessage = 'Giỏ hàng đang trống.';
      return;
    }

    if (!this.form.shippingFullName.trim() || !this.form.shippingPhone.trim() || !this.form.shippingAddress.trim()) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin giao hàng.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.orderService.checkoutFromCart({
      shippingFullName: this.form.shippingFullName.trim(),
      shippingPhone: this.form.shippingPhone.trim(),
      shippingAddress: this.form.shippingAddress.trim(),
      note: this.form.note?.trim() || undefined,
      paymentMethod: this.form.paymentMethod
    }).subscribe({
      next: (order) => {
        this.order = order;
        this.isSubmitting = false;
        this.cartService.loadCart();
      },
      error: (err) => {
        const message = err?.error?.message || err?.error?.error || 'Thanh toán thất bại. Vui lòng thử lại.';
        this.errorMessage = message;
        this.isSubmitting = false;
      }
    });
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }
}
