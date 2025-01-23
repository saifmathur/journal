import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authType: 'basic' | 'token' = 'basic'; // Default to Basic Auth
  private username = environment.server_username; // Replace with your username
  private password = environment.server_password; // Replace with your password
  private token = ''; // To store the token for token-based authentication

  constructor() {}

  // Set the authentication type (basic or token)
  setAuthType(type: 'basic' | 'token'): void {
    this.authType = type;
  }

  // Set the token for token-based authentication
  setToken(token: string): void {
    this.token = token;
  }

  // Get the appropriate authorization headers based on the auth type
  getAuthHeaders(): HttpHeaders {
    if (this.authType === 'basic') {
      return new HttpHeaders({
        Authorization: 'Basic ' + btoa(`${this.username}:${this.password}`), // Base64 encode
      });
    } else if (this.authType === 'token') {
      return new HttpHeaders({
        Authorization: `Bearer ${this.token}`, // Bearer token
      });
    }
    return new HttpHeaders();
  }
}
