import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private reviewService = inject(ReviewService);

  // State using Signals
  product = signal<any>(null);
  mainImage = signal<string | null>(null);
  quantity = signal(1);
  loading = signal(false);
  addingToCart = signal(false);
  
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  availableSizes = signal<string[]>([]);
  availableColors = signal<string[]>([]);
  currentVariant = signal<any>(null);

  // Review State
  canReview = signal(false);
  reviewRating = signal<number>(0);
  reviewComment = signal('');
  submittingReview = signal(false);
  showReviewForm = signal(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loading.set(true);
      this.productService.getProductById(+idParam).subscribe({
        next: (data) => {
          this.product.set(data);
          this.mainImage.set(data.imageUrl || null);
          this.extractVariants(data.variants);
          this.checkReviewPermission(data.id);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error fetching product details', err);
          this.router.navigate(['/products']);
          this.loading.set(false);
        }
      });
    }
  }

  extractVariants(variants: any[]) {
    if (!variants || variants.length === 0) return;
    const sizes = [...new Set(variants.map(v => v.size))];
    const colors = [...new Set(variants.map(v => v.color))];
    this.availableSizes.set(sizes);
    this.availableColors.set(colors);
    
    this.selectSize(variants[0].size);
    this.selectColor(variants[0].color);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
    this.updateCurrentVariant();
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
    this.updateCurrentVariant();
  }

  updateCurrentVariant() {
    const variant = this.product()?.variants.find(
      (v: any) => v.size === this.selectedSize() && v.color === this.selectedColor()
    );
    this.currentVariant.set(variant || null);
  }

  increaseQuantity() {
    const stock = this.currentVariant()?.stock || 0;
    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const variantId = this.currentVariant()?.id;
    if (!variantId) {
       // Should not happen if UI is correct
      return;
    }

    this.addingToCart.set(true);
    this.cartService.addToCart(variantId, this.quantity()).subscribe({
      next: () => {
        this.addingToCart.set(false);
        alert('Thiết kế đã được tiếp nhận vào giỏ hàng!');
      },
      error: (err) => {
        console.error('Error adding to cart', err);
        this.addingToCart.set(false);
        alert('Số lượng lựa chọn vượt quá khả năng điều phối hiện tại!');
      }
    });
  }

  toggleWishlist() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    const productId = this.product()?.id;
    if (productId) {
      this.wishlistService.toggleWishlist(productId);
    }
  }

  isInWishlist(): boolean {
    const productId = this.product()?.id;
    return productId ? this.wishlistService.isInWishlist(productId) : false;
  }

  checkReviewPermission(productId: number) {
    if (this.authService.isLoggedIn()) {
      this.reviewService.canReview(productId).subscribe({
        next: (canReview) => this.canReview.set(canReview),
        error: () => this.canReview.set(false)
      });
    }
  }

  toggleReviewForm() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    if (!this.canReview()) {
      alert('Bạn cần mua và nhận hàng thành công (Trạng thái: DELIVERED) mới có thể gửi đánh giá.');
      return;
    }
    this.showReviewForm.set(!this.showReviewForm());
  }

  submitRating() {
    if (this.reviewRating() === 0 || !this.reviewComment().trim()) {
      alert('Vui lòng chọn số sao và nhập bình luận.');
      return;
    }

    this.submittingReview.set(true);
    this.reviewService.postReview({
      productId: this.product().id,
      rating: this.reviewRating(),
      comment: this.reviewComment()
    }).subscribe({
      next: (review) => {
        // Optimistically add review to top of list
        const currentProduct = this.product();
        currentProduct.reviews = [review, ...(currentProduct.reviews || [])];
        this.product.set(currentProduct);
        
        this.submittingReview.set(false);
        this.showReviewForm.set(false);
        this.reviewComment.set('');
        this.reviewRating.set(0);
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
      },
      error: (err) => {
        console.error('Error submitting review', err);
        this.submittingReview.set(false);
        alert(err.error?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
      }
    });
  }
}
