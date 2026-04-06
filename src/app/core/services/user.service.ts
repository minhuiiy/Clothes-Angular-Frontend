import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  updateRole(userId: number, role: string): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${userId}/role?role=${role}`, {});
  }

  updateStatus(userId: number, active: boolean): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${userId}/status`, {});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
