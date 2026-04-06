import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface IProduct {
  id?: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  imageUrl?: string;
  color?: string;
  isFeatured?: boolean;
  soldCount?: number;
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  categoryId?: number;
  brandId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private adminUrl = 'http://localhost:8080/api/admin/products';

  private productsSubject = new BehaviorSubject<IProduct[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAllProductsAdmin(); // Load initial data for admin
  }

  // Public methods
  getProducts(options: { keyword?: string; page?: number; size?: number; sort?: string; categoryId?: number } = {}): Observable<any> {
    const page = options.page ?? 0;
    const size = options.size ?? 10;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', options.sort || 'newest');

    if (options.keyword) params = params.set('keyword', options.keyword);
    if (options.categoryId) params = params.set('categoryId', options.categoryId.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  // Admin methods
  getAllProductsAdmin(): void {
    this.getProducts({ size: 100 }).subscribe({
      next: (data) => this.productsSubject.next(data.products || []),
      error: (err) => console.error('Error fetching admin products:', err)
    });
  }

  createProduct(productParam: Partial<IProduct>): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, productParam).pipe(
      tap(() => this.getAllProductsAdmin())
    );
  }

  updateProduct(id: number, productParam: Partial<IProduct>): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, productParam).pipe(
      tap(() => this.getAllProductsAdmin())
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAllProductsAdmin())
    );
  }

  // Helpers
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/brands');
  }
}
