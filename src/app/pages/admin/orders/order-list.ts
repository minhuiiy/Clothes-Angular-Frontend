import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class AdminOrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  
  orders: any[] = [];
  loading = signal(false);
  
  orderStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getAllOrders().subscribe({
      next: (res: any[]) => {
        this.orders = res.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching orders', err);
        this.loading.set(false);
      }
    });
  }

  updateStatus(orderId: number, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
        alert('Cập nhật trạng thái vận hành thành công!');
      },
      error: (err: any) => alert('Lỗi khi điều phối trạng thái: ' + err.message)
    });
  }

  deleteOrder(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn vận đơn này?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err: any) => alert('Lỗi khi thực thi lệnh xóa: ' + err.message)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'PAID': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'PROCESSING': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'SHIPPED': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'DELIVERED': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-stone-500/10 text-stone-600 border-stone-500/20';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'CHỜ XÁC NHẬN';
      case 'PAID': return 'ĐÃ THANH TOÁN';
      case 'PROCESSING': return 'ĐANG ĐIỀU PHỐI';
      case 'SHIPPED': return 'ĐANG VẬN CHUYỂN';
      case 'DELIVERED': return 'HOÀN TẤT GIAO NHẬN';
      case 'CANCELLED': return 'ĐÃ HỦY GIAO DỊCH';
      default: return status;
    }
  }
}
