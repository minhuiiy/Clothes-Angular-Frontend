import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', (filters.page || 0).toString())
      .set('size', (filters.size || 10).toString())
      .set('sort', filters.sort || 'newest');

    if (filters.keyword) params = params.set('keyword', filters.keyword);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters.brandId) params = params.set('brandId', filters.brandId.toString());
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.color) params = params.set('color', filters.color);
    if (filters.isPromoted) params = params.set('isPromoted', 'true');
    if (filters.isFeatured) params = params.set('isFeatured', 'true');

    return this.http.get(`${API_URL}/products`, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/products/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/categories`);
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/brands`);
  }
}
