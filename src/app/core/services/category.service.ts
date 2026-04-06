import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface ICategory {
  id?: number;
  name: string;
  slug?: string;
  imageUrl?: string;
  description?: string;
  status?: boolean;
  children?: ICategory[];
  parent_id?: number | null;
}

export type CategoryMenuResponse = {
  nam: ICategory[];
  nu: ICategory[];
  phuKien: ICategory[];
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';
  
  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAll(); // Initial fetch
  }

  getAll(): void {
    this.http.get<ICategory[]>(this.apiUrl).subscribe({
      next: (data: ICategory[]) => this.categoriesSubject.next(data),
      error: (err: any) => console.error('Error fetching categories:', err)
    });
  }

  getMenu(): Observable<CategoryMenuResponse> {
    return this.http.get<CategoryMenuResponse>(`${this.apiUrl}/menu`);
  }

  create(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.apiUrl, category).pipe(
      tap(() => this.getAll())
    );
  }

  update(id: number, category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/${id}`, category).pipe(
      tap(() => this.getAll())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAll())
    );
  }
}
