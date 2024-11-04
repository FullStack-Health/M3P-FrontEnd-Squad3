import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { DashboardStats } from '../../models/dashboard-stats.interface';
import { ListPatients } from '../../models/list-patients.model';
import { Page } from '../../models/page.interface';
import { PatientCard } from '../../models/patient-card.model';
import { PatientRecord } from '../../models/patient-record.model';
import { Patient } from '../../models/patient.model';
import { User } from '../../models/user.model';
import { Exam } from '../../models/exam.model';
import { ListUsers } from '../../models/list-users.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  //user endpoint

  saveUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/pre-registration`, user);
  }

  updatePassword(email: string, newPassword: string): Observable<void> {
    const body: User = { 
      password: newPassword 
    };

    return this.http.put<void>(`${this.apiUrl}/users/email/${email}/redefine-password`, body);
  }

  getUser(id: string): Observable<User> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { headers });
  }

  updateUser(id: string, user: User): Observable<User> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user, { headers });
  }

  deleteUser(id: string): Observable<User> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.delete<User>(`${this.apiUrl}/users/${id}`, { headers });
  }

  listUsers(page: number, size: number, userId?: string, email?: string): Observable<Page<ListUsers>> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (userId) {
      params = params.set('userId', userId);
    }
    if (email) {
      params = params.set('email', email);
    }
    
    console.log("Sending request with params:", params.toString());

    return this.http.get<Page<ListUsers>>(`${this.apiUrl}/users`, { headers, params });
  }

  // dashboard endpoint

  getDashboardStats(): Observable<DashboardStats> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);
    console.log('JWT Token:', jwtToken); 

    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { headers });
  }

  // patient endpoint

  listPatients(page: number, size: number, fullName?: string, id?: number): Observable<Page<ListPatients>> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (fullName) {
        params = params.set('fullName', fullName);
    }
    if (id) {
      params = params.set('id', id.toString());
    }

    console.log("Sending request with params:", params.toString());

    return this.http.get<Page<ListPatients>>(`${this.apiUrl}/patients`, { headers, params });
  }


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

  getPatientCard(page: number, size: number, fullName?: string, phone?: string, email?: string): Observable<Page<PatientCard>> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (fullName) {
        params = params.set('fullName', fullName);
    }
    if (phone) {
      params = params.set('phone', phone);
    }
    if (email) {
        params = params.set('email', email);
    }

    return this.http.get<Page<PatientCard>>(`${this.apiUrl}/patients`, { headers, params });
  }

  getPatients(searchTerm: string, searchField: string, page: number, size: number): Observable<Patient[]> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    let params = new HttpParams()
        .set(searchField, searchTerm)
        .set('page', page.toString())
        .set('size', size.toString());

    return this.http.get<Patient[]>(`${this.apiUrl}/patients`, { headers, params })
        .pipe(tap((response: any) => console.log('Patients response:', response)));
  }

  hasAppointmentsOrExamsByPatientId(id: string): Observable<boolean> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<PatientRecord>(`${this.apiUrl}/medical-record/${id}`, { headers }).pipe(
        map(patientRecord => {
            return patientRecord.appointments.length > 0 || patientRecord.exams.length > 0;
        }),
        catchError(() => of(false))
    );
  }

  deletePatient(id: string): Observable<Patient> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.delete<Patient>(`${this.apiUrl}/patients/${id}`, { headers });
  }

  // medical record {id} endpoint

  getPatientById(id: string): Observable<PatientRecord> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<PatientRecord>(`${this.apiUrl}/medical-record/${id}`, { headers });
  }

  getAppointmentsAndExamsByPatientId(id: string): Observable<PatientRecord[]> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<PatientRecord[]>(`${this.apiUrl}/medical-record/${id}`, { headers });
  }

  // appointment endpoint

  saveAppointment(appointment: Appointment): Observable<Appointment> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment, { headers });
  }

  editAppointment(id: string, appointment: Appointment): Observable<Appointment> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.put<Appointment>(`${this.apiUrl}/appointments/${id}`, appointment, { headers });
  }

  getAppointment(id: string): Observable<Appointment> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<Appointment>(`${this.apiUrl}/appointments/${id}`, { headers });
  }

  deleteAppointment(id: string): Observable<Appointment> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.delete<Appointment>(`${this.apiUrl}/appointments/${id}`, { headers });
  }

  // exam endpoint

  saveExam(exam: Exam): Observable<Exam> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.post<Exam>(`${this.apiUrl}/exams`, exam, { headers });
  }

  editExam(id: string, exam: Exam): Observable<Exam> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.put<Exam>(`${this.apiUrl}/exams/${id}`, exam, { headers });
  }

  getExam(id: string): Observable<Exam> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<Exam>(`${this.apiUrl}/exams/${id}`, { headers });
  }

  deleteExam(id: string): Observable<Exam> {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.delete<Exam>(`${this.apiUrl}/exams/${id}`, { headers });
  }
}
