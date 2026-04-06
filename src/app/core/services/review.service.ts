import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/reviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);

  postReview(reviewData: { productId: number, rating: number, comment: string }): Observable<any> {
    return this.http.post(API_URL, reviewData);
  }

  getReviewsByProduct(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/product/${productId}`);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  canReview(productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_URL}/can-review/${productId}`);
  }
}
