import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders = [
    { id: '#ORD-2024-082', date: '12 Tháng 10, 2024', total: '12.500.000₫', status: 'ĐANG GIAO' },
    { id: '#ORD-2024-075', date: '28 Tháng 9, 2024', total: '8.200.000₫', status: 'ĐÃ HOÀN THÀNH' },
    { id: '#ORD-2024-012', date: '15 Tháng 5, 2024', total: '21.000.000₫', status: 'ĐÃ HOÀN THÀNH' }
  ];

  activeFilter = 'Tất cả đơn hàng';
  filters = ['Tất cả đơn hàng', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'];

  get filteredOrders() {
    if (this.activeFilter === 'Tất cả đơn hàng') return this.orders;
    return this.orders.filter(o => o.status.toLowerCase() === this.activeFilter.toLowerCase());
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  ngOnInit(): void {}
}
