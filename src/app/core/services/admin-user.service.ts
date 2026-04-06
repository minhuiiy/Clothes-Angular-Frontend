import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUserRole(userId: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/role`, null, {
      params: { role }
    });
  }

  toggleUserStatus(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/status`, null);
  }
}
