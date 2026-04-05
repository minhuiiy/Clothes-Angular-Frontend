import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(options: { keyword?: string; page?: number; size?: number; categoryId?: number } = {}): Observable<any> {
    const page = options.page ?? 0;
    const size = options.size ?? 10;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (options.keyword) {
      params = params.set('keyword', options.keyword);
    }

    if (options.categoryId != null) {
      params = params.set('categoryId', options.categoryId.toString());
    }

    return this.http.get(API_URL, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/${id}`);
  }
}
