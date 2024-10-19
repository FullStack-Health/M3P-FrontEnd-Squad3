import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { DashboardStats } from '../../models/dashboard-stats.interface';
import { PatientCard } from '../../models/patient-card.model';
import { Page } from '../../models/page.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081';

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

  // dashboard endpoint

  getDashboardStats(): Observable<DashboardStats> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { headers });
  }

  // patient endpoint

  getPatientCard(page: number, size: number, name?: string, phone?: string, email?: string): Observable<Page<PatientCard>> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (name) {
        params = params.set('name', name);
    }
    if (phone) {
      params = params.set('phone', phone);
    }
    if (email) {
        params = params.set('email', email);
    }

    return this.http.get<Page<PatientCard>>(`${this.apiUrl}/patients`, { headers, params });
  }

}
