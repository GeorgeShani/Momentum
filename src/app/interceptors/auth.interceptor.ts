import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

// HttpInterceptor function to intercept HTTP requests
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject the AuthService to access the token
  const token = authService.getBearerToken(); // Get the bearer token from AuthService

  // Initialize headers with default 'Accept' header
  let headers: { [key: string]: string } = {
    Accept: 'application/json',
  };

  // If token exists, add Authorization header with Bearer token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If the request has a body and it's not FormData, set Content-Type to 'application/json'
  if (req.body && !(req.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Clone the original request and set the new headers
  const clonedReq = req.clone({ setHeaders: headers });

  // Pass the cloned request to the next handler
  return next(clonedReq);
};
