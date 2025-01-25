import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authType: 'token' | undefined; // Default to Basic Auth
  // private authType: 'basic' | 'token' = 'basic'; // Default to Basic Auth
  private apiUrl = environment.apiUrl+`/auth`;
  private username = environment.server_username; // Replace with your username
  private password = environment.server_password; // Replace with your password
  private token = ''; // To store the token for token-based authentication

  constructor(private http: HttpClient, private router: Router) {}

  // Set the authentication type (basic or token)
  // setAuthType(type: 'basic' | 'token'): void {
  //   this.authType = type;
  // }

  // Set the token for token-based authentication
  setToken(token: string): void {
    this.token = token;
  }

  // Get the appropriate authorization headers based on the auth type
  getAuthHeaders(): HttpHeaders {
    // if (this.authType === 'basic') {
    //   return new HttpHeaders({
    //     Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`), // Base64 encode
    //   });
    // } else if (this.authType === 'token') {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Bearer token
    });
    // }
    //return new HttpHeaders();
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
