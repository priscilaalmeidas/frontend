import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '@/models/ticke.model';
import { Contact } from '@/models/contact.model';
import { User } from '@/models/user.model';
import { Message } from '@/models/message.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = 'https://18.219.189.116:3000';

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

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/user', user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/user');
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/user/' + id);
  }

  getUserByName(name: string): Observable<any> {
    return this.http.get(this.apiUrl + '/user/name/' + name);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(this.apiUrl + '/user/' + id, user);
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(this.apiUrl + '/user/' + id);
  }

  getTicketsByAgentAndStatus(
    userId: string,
    status: string
  ): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      this.apiUrl + '/ticket/' + userId + '/agent/' + status + '/status'
    );
  }
  getTicketsByAgent(userId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      this.apiUrl + '/ticket/' + userId + '/agent'
    );
  }

  updateTicket(id: string, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(this.apiUrl + '/ticket/' + id, ticket);
  }

  getTicketById(id: string): Observable<Ticket> {
    this.getMessagesByChatId(id);
    return this.http.get<Ticket>(this.apiUrl + '/ticket/' + id);
  }

  updateContact(id: string, contact: any): Observable<any> {
    return this.http.put(this.apiUrl + '/contact/' + id, contact);
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(this.apiUrl + '/contact/' + id);
  }
  getAllContact(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl + '/contact/');
  }

  getMessagesByChatId(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(
      this.apiUrl + '/chat/' + chatId + '/messages'
    );
  }

  sendMessage(
    sender: string,
    message: string,
    chatId: string
  ): Observable<void> {
    return this.http.post<void>(this.apiUrl + '/chat/message', {
      sender,
      message,
      chatId,
    });
  }
}
