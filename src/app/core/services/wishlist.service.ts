import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8080/api/wishlist';

  // State using Signal for real-time sync
  wishlistItems = signal<any[]>([]);
  wishlistCount = signal(0);

  constructor() {
    // Initial load if user is logged in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadWishlist();
      } else {
        this.wishlistItems.set([]);
        this.wishlistCount.set(0);
      }
    });
  }

  loadWishlist() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.wishlistItems.set(items);
        this.wishlistCount.set(items.length);
      },
      error: (err) => console.error('Error loading wishlist', err)
    });
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${productId}`, {}).pipe(
      tap(() => this.loadWishlist())
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(() => this.loadWishlist())
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(item => item.id === productId);
  }

  toggleWishlist(productId: number) {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId).subscribe();
    } else {
      this.addToWishlist(productId).subscribe();
    }
  }
}
