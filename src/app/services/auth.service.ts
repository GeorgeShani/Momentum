import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getBearerToken(): string {
    return '9e688ba9-5e31-42bb-a4c1-f46c3f70f578';
  }
}
