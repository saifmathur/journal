import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const token = localStorage.getItem('token'); // Get the token from local storage
  //   if (token && !req.url.includes('auth')) {
  //     // Clone the request and add the Authorization header with the token
  //     const cloned = req.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // Pass the cloned request to the next handler
  //     return next.handle(cloned);
  //   } else {
  //     // If no token is found, just pass the original request
  //     return next.handle(req);
  //   }
  // }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Get the token from local storage

    let clonedRequest = req;

    // Clone the request and add the Authorization header if the token exists
    if (token && !req.url.includes('auth')) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Pass the request to the next handler and handle errors
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error); // Log the error to the console

        // Handle specific HTTP errors
        if (error.status === 401) {
          // Unauthorized error: Redirect to login
          localStorage.removeItem('token'); // Remove token if unauthorized
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden error: Show a message or redirect
          alert('You do not have permission to access this resource.');
        } else if (error.status === 500) {
          // Internal server error: Handle it accordingly
          alert('An error occurred on the server. Please try again later.');
        }

        // Pass the error back to the caller
        return throwError(() => new Error(error.message || 'Server Error'));
      })
    );
  }
}
