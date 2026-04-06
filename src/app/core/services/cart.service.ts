import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Cart } from '../../shared/models/cart.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.token) {
        this.loadCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  private getHeaders() {
    const user = this.authService.getCurrentUser();
    if (user && user.token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${user.token}`
      });
    }
    return new HttpHeaders();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Logout
      console.warn('Session expired or unauthorized. Logging out...');
      this.authService.logout();
    }
    return throwError(() => error);
  }

  loadCart() {
    const headers = this.getHeaders();
    if (headers.has('Authorization')) {
      this.http.get<Cart>(this.apiUrl, { headers })
        .pipe(catchError(err => this.handleError(err)))
        .subscribe(cart => this.cartSubject.next(cart));
    }
  }

  addToCart(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId, quantity }, { headers: this.getHeaders() })
      .pipe(tap(cart => this.cartSubject.next(cart)));
  }

  updateQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update/${itemId}`, null, {
      params: { quantity: quantity.toString() },
      headers: this.getHeaders()
    }).pipe(tap(cart => this.cartSubject.next(cart)));
  }

  removeItem(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${itemId}`, { headers: this.getHeaders() })
      .pipe(tap(cart => this.cartSubject.next(cart)));
  }

  getCartCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart ? cart.totalItems : 0)
    );
  }
}
