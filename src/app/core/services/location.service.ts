import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationInfo {
  name: string;
  code: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  // Sử dụng API cung cấp bởi provinces.open-api.vn (dùng v1 để tránh redirect)
  private apiUrl = 'https://provinces.open-api.vn/api/v1';

  getProvinces(): Observable<LocationInfo[]> {
    return this.http.get<LocationInfo[]>(`${this.apiUrl}/p/`);
  }

  getDistricts(provinceCode: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/p/${provinceCode}/?depth=2`);
  }

  getWards(districtCode: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/d/${districtCode}/?depth=2`);
  }
}
