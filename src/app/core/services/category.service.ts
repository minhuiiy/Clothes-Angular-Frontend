import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CategorySummary = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  children?: CategorySummary[];
};

export type CategoryMenuResponse = {
  nam: CategorySummary[];
  nu: CategorySummary[];
  phuKien: CategorySummary[];
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<CategoryMenuResponse> {
    return this.http.get<CategoryMenuResponse>(`${this.apiUrl}/menu`);
  }
}
