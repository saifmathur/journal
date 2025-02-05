import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authType: 'token' | undefined; // Default to Basic Auth
  // private authType: 'basic' | 'token' = 'basic'; // Default to Basic Auth
  private apiUrl = environment.apiUrl + `/auth`;
  private username = environment.server_username; // Replace with your username
  private password = environment.server_password; // Replace with your password
  private token = ''; // To store the token for token-based authentication

  constructor(private http: HttpClient, private router: Router) {}

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    if (localStorage.getItem('token') != undefined) {
      return true;
    } else {
      return false;
    }
  }

  // Set the token for token-based authentication
  setToken(token: string): void {
    this.token = token;
  }

  // Get the appropriate authorization headers based on the auth type
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`, // Bearer token
    });
  }

  login(credentials: { email: string; password: string }) {
    this.isLoggedInSubject.next(true);
    return this.http.post<{
      token: string;
      initials: string;
      fullName: string;
      message: string;
    }>(`${this.apiUrl}/login`, credentials);
  }

  updateState() {
    this.isLoggedInSubject.next(true);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  checkDuplicateUserName(data: any) {
    return this.http.post(`${this.apiUrl}/checkDuplicateUserName`, {username:data});
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !this.isTokenExpired();
  }

  logout() {
    localStorage.removeItem('token');
    this.http.get(`${this.apiUrl}/logout`).subscribe(
      (res) => {
        this.router.navigate(['/login']);
        this.isLoggedInSubject.next(false);
      },
      (err: any) => {},
      () => {
        localStorage.clear();
      }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const decodedToken = this.decodeToken(token);
    const expiryDate = decodedToken.exp * 1000; // Convert to milliseconds
    return expiryDate < Date.now();
  }

  // Decode the JWT token
  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  // Redirect to login if the token is expired
  checkTokenAndRedirect() {
    if (this.isTokenExpired()) {
      this.router.navigate(['/login']);
    }
  }
}
