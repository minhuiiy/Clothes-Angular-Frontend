import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth';
import { Order } from '../../shared/models/order.model';

export interface CheckoutRequest {
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

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
      this.authService.logout();
    }
    return throwError(() => error);
  }

  checkoutFromCart(payload: CheckoutRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout`, payload, { headers: this.getHeaders() })
      .pipe(catchError(err => this.handleError(err)));
  }
}
