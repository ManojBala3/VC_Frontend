// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}


  // Check if user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('username') !=null ;
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }
}
