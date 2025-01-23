// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl; // Replace with your API endpoint

  constructor(private http: HttpClient, private auth: AuthService) {}

  // GET request
  getWorkTypes(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    console.log(headers);
    
    return this.http.get(`${this.apiUrl}/work/getAllWorkType`, { headers });
  }

  // POST request
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, data);
  }

  // PUT request
  updateData(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/data/${id}`, data);
  }

  // DELETE request
  deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/data/${id}`);
  }
}
