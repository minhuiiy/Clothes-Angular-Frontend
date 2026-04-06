import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.html',
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.loading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string) {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'SHIPPED': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'DELIVERED': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'CHỜ XÁC NHẬN';
      case 'PROCESSING': return 'ĐANG ĐIỀU PHỐI';
      case 'SHIPPED': return 'ĐANG VẬN CHUYỂN';
      case 'DELIVERED': return 'HOÀN TẤT GIAO NHẬN';
      case 'CANCELLED': return 'ĐÃ HỦY GIAO DỊCH';
      default: return status;
    }
  }
}
