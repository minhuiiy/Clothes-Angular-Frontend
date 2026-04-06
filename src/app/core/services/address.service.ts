import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddressRequest {
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
}

export interface AddressResponse extends AddressRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/addresses';

  getAddresses(): Observable<AddressResponse[]> {
    return this.http.get<AddressResponse[]>(this.apiUrl);
  }

  createAddress(address: AddressRequest): Observable<AddressResponse> {
    return this.http.post<AddressResponse>(this.apiUrl, address);
  }

  updateAddress(id: number, address: AddressRequest): Observable<AddressResponse> {
    return this.http.put<AddressResponse>(`${this.apiUrl}/${id}`, address);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setDefault(id: number): Observable<AddressResponse> {
    return this.http.patch<AddressResponse>(`${this.apiUrl}/${id}/default`, {});
  }
}
