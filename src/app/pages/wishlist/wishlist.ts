import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
})
export class WishlistPage implements OnInit {
  private wishlistService = inject(WishlistService);

  wishlistItems = this.wishlistService.wishlistItems;
  wishlistCount = this.wishlistService.wishlistCount;

  ngOnInit() {
    this.wishlistService.loadWishlist();
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }
}
