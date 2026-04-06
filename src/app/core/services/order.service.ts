import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/orders';

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/admin/orders`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`http://localhost:8080/api/admin/orders/${id}/status`, { status });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }
}
