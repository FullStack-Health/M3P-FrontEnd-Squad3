import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://acc5343e-2bc7-48bd-8328-985f6db75ffc.mock.pstmn.io';

  constructor(private http: HttpClient) { }

  //user endpoint

  saveUser(user: User): Observable<User> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.post<User>(`${this.apiUrl}/user-register`, user, { headers });
  }

  updatePassword(email: string, newPassword: string): Observable<void> {
    const body: User = { 
      email: email, 
      password: newPassword 
    };
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.put<void>(`${this.apiUrl}/user`, body, { headers });
  }

}
