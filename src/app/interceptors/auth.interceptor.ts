import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getBearerToken();

  let headers: { [key: string]: string } = {
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (req.body && !(req.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const clonedReq = req.clone({ setHeaders: headers });
  return next(clonedReq);
};
