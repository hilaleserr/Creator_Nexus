import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  // Kayıt Ol (Register)
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.setSession(res))
    );
  }

  // Giriş Yap (Login)
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  // Oturumu Kapat (Logout)
  logout(): void {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  }

  // Token'ı LocalStorage'a Kaydet
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('nexus_token', authResult.token);
    localStorage.setItem('nexus_user', JSON.stringify(authResult.user));
  }

  // Kullanıcı Giriş Yapmış mı?
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('nexus_token');
  }

  // Giriş Yapan Kullanıcı Bilgileri
  get currentUser() {
    const user = localStorage.getItem('nexus_user');
    return user ? JSON.parse(user) : null;
  }

  // Token Değerini Döndür (HTTP Interceptor için)
  get token(): string | null {
    return localStorage.getItem('nexus_token');
  }
}