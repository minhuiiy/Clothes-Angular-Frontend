import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderId: string = '#ORD-2024-082';
  orderDate: string = '12 THÁNG 10, 2024';
  
  status = 'ĐANG GIAO';
  statusSteps = [
    { label: 'ĐÃ ĐẶT', completed: true },
    { label: 'XÁC NHẬN', completed: true },
    { label: 'ĐANG GIAO', completed: true, active: true },
    { label: 'HOÀN THÀNH', completed: false }
  ];

  items = [
    {
      name: 'Đầm Lụa Midi Charcoal',
      category: 'LOOKBOOK FW23',
      variant: 'Size: S | Màu: Than chì',
      quantity: 1,
      price: '4.200.000 VNĐ',
      image: 'https://source.unsplash.com/random/100x150/?dress,fashion'
    },
    {
      name: 'Túi Tote Da Thủ Công',
      category: 'PHỤ KIỆN ĐẶC BIỆT',
      variant: 'Chất liệu: Da Calfskin | Màu: Đen',
      quantity: 1,
      price: '8.500.000 VNĐ',
      image: 'https://source.unsplash.com/random/100x150/?handbag,leather'
    }
  ];

  shipping = {
    name: 'Nguyễn Hoàng Anh',
    address: '123 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, 700000, Việt Nam',
    phone: '+84 90 123 4567'
  };

  summary = {
    subtotal: '12.700.000 VNĐ',
    shipping: '50.000 VNĐ',
    discount: '- 500.000 VNĐ',
    total: '12.250.000 VNĐ'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // get order details by standard routing
  }
}
