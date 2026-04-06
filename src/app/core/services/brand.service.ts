import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/brands';

  getAllBrands(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBrandById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBrand(brand: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, brand);
  }

  updateBrand(id: number, brand: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, brand);
  }

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
