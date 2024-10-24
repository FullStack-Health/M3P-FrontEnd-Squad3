import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { DashboardStats } from '../../models/dashboard-stats.interface';
import { PatientCard } from '../../models/patient-card.model';
import { Page } from '../../models/page.interface';
import { ListPatients } from '../../models/list-patients.model';
import { Patient } from '../../models/patient.model';
import { PatientRecord } from '../../models/patient-record.model';

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

  // medical record list endpoint

  listPatients(page: number, size: number, name?: string, id?: string): Observable<Page<ListPatients>> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (name) {
        params = params.set('name', name);
    }
    if (id) {
      params = params.set('id', id);
    }

    console.log("Sending request with params:", params.toString());

    return this.http.get<Page<ListPatients>>(`${this.apiUrl}/patients/medical-record-list`, { headers, params });
  }

  // patient endpoint

  savePatient(patient: Patient): Observable<Patient> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient, { headers });
  }

  editPatient(id: string, patient: Patient): Observable<Patient> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.put<Patient>(`${this.apiUrl}/patients/${id}`, patient, { headers });
  }

  getPatient(id: string): Observable<Patient> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`, { headers });
  }

  // medical record {id} endpoint

  getPatientById(id: string): Observable<PatientRecord> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<PatientRecord>(`${this.apiUrl}/patients/${id}/medical-record`, { headers });
  }

  getAppointmentsAndExamsByPatientId(id: string): Observable<PatientRecord[]> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<PatientRecord[]>(`${this.apiUrl}/patients/${id}/medical-record`, { headers });
  }
}
