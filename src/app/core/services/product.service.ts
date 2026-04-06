import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(keyword?: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get(API_URL, { params });
  }

  getProductsWithFilters(filterParams: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key] != null) {
        params = params.set(key, filterParams[key].toString());
      }
    });
    return this.http.get(API_URL, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(API_URL, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
