import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-detail.html',
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private reviewService = inject(ReviewService);

  order = signal<any>(null);
  loading = signal(false);

  // Review Form State
  selectedItemForReview = signal<any>(null);
  reviewRating = signal(0);
  reviewComment = '';
  submittingReview = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOrderDetail(id);
    }
  }

  loadOrderDetail(id: number) {
    this.loading.set(true);
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.order.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading order', err);
        this.loading.set(false);
      }
    });
  }

  cancelOrder() {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      const id = this.order()?.id;
      this.orderService.cancelOrder(id).subscribe(() => {
        this.loadOrderDetail(id);
      });
    }
  }

  getStatusBadgeClass(status: string) {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'SHIPPED': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'DELIVERED': return 'bg-green-50 border-green-200 text-green-700';
      case 'CANCELLED': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đang giao hàng';
      case 'DELIVERED': return 'Giao hàng thành công';
      case 'CANCELLED': return 'Đã hủy đơn';
      default: return status;
    }
  }

  // Review logic
  openReviewModal(item: any) {
    this.selectedItemForReview.set(item);
    this.reviewRating.set(5);
    this.reviewComment = '';
  }

  submitReview() {
    if (this.reviewRating() === 0) return;

    this.submittingReview.set(true);
    const reviewData = {
      productId: this.selectedItemForReview().variant.product.id,
      rating: this.reviewRating(),
      comment: this.reviewComment
    };

    this.reviewService.postReview(reviewData).subscribe({
      next: () => {
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
        this.submittingReview.set(false);
        this.selectedItemForReview.set(null);
      },
      error: (err) => {
        console.error('Error submitting review', err);
        this.submittingReview.set(false);
        alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau!');
      }
    });
  }
}
