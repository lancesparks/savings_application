import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment/environment';
import { LoginCredentials, TokenResponse, User } from '../types/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private href = environment.settings.baseHref;

  public createUser(params: User) {
    return this.http.post(`${this.href}/user`, params, { observe: 'response' });
  }

  public login(params: LoginCredentials): Observable<TokenResponse> {
    const body = new HttpParams().set('username', params.username).set('password', params.password);

    return this.http.post<TokenResponse>(`${this.href}/user/token`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public logout() {
    localStorage.removeItem('token');
  }
}
