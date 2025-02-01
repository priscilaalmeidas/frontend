import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = 'http://localhost:3000';
  constructor(private readonly http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  setSession(token: string, user: any): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl + '/user', user);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl + '/user');
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(this.apiUrl + '/user/' + id);
  }

  getUserByName(name: string): Observable<any> {
    return this.http.get(this.apiUrl + '/user/name/' + name);
  }

  getTicketsByAgentAndStatus(userId: string, status: string): Observable<any> {
    return this.http.get(
      this.apiUrl + '/ticket/' + userId + '/agent/' + status + '/status'
    );
  }
  getTicketsByAgent(userId: string): Observable<any> {
    return this.http.get(this.apiUrl + '/ticket/' + userId + '/agent');
  }
  delete(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/user/' + id);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(this.apiUrl + '/user/' + id, user);
  }
}
