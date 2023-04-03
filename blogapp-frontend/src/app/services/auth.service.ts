import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import User from '../model/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(email: string, password: string) {
    const body = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.baseUrl}/authenticate`, body);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }

  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/user-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
