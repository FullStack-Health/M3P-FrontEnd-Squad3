import { Component, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../shared/services/api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { SliderComponent } from '../../shared/components/slider/slider.component';
import moment from 'moment';
import { PatientRecord } from '../../models/patient-record.model';
import { AppointmentRecord } from '../../models/appointment-record.model';
import { ExamRecord } from '../../models/exam-record.model';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { TimeFormatPipe } from '../../shared/pipes/time-format.pipe';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { AgePipe } from "../../shared/pipes/age.pipe";
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';
import { ShortenNamePipe } from "../../shared/pipes/shorten-name.pipe";
import { AuthService } from '../../security/auth.service';


@Component({
  selector: 'app-medical-record',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, HttpClientModule, MatTabsModule, MatDividerModule, CommonModule, RouterLink, MatButton, MatButtonModule, SliderComponent, DateFormatPipe, TimeFormatPipe, TimelineModule, CardModule, AgePipe, ShortenNamePipe],
  providers: [ApiService, AuthService],
  templateUrl: './medical-record.component.html',
  styleUrl: './medical-record.component.scss'
})
export class MedicalRecordComponent implements OnInit {
  patientID: any = '';
  patient: PatientRecord | undefined = undefined;
  appointment: AppointmentRecord | undefined = undefined;
  exam: ExamRecord | undefined = undefined;
  patientsList: any = [];
  appointmentsList: AppointmentRecord[] = [];
  examsList: ExamRecord[] = [];
  menuTrueFalse: boolean | undefined;
  userRole: string | null = '';

  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private shareMenuStatusService: ShareMenuStatusService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Prontuário de paciente');
    this.userRole = this.authService.getDecodedToken()?.scope || null;

    this.patientID = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.patientID, 'esse é o id do paciente');

    this.getPatient(this.patientID);
    this.getAppointments(this.patientID);
    this.getExams(this.patientID);

    this.patient = {
      id: undefined,
      fullName: '',
      gender: '',
      birthDate: '',
      cpf: '',
      rg: '',
      issOrg: '',
      maritalStatus: '',
      phone: '',
      email: '',
      placeOfBirth: '',
      emergencyContact: '',
      listOfAllergies: undefined,
      listCare: undefined,
      healthInsurance: '',
      healthInsuranceNumber: undefined,
      healthInsuranceVal: undefined,
      zipcode: '',
      street: undefined,
      addressNumber: undefined,
      complement: undefined,
      referencePoint: undefined,
      neighborhood: undefined,
      city: '',
      state: '',
      appointments: [],
      exams: []
    };

    this.appointment = {
      id: '',
      appointment_id: '',
      patientName: '',
      reason: '',
      consultDate: '',
      consultTime: '',
      problemDescrip: '',
      prescMed: null,
      dosagesPrec: null,
    }

    this.exam = {
      id: '',
      examId: '',
      patientName: '',
      exam: '',
      examDate: '',
      examTime: '',
      examType: '',
      lab: '',
      docUrl: null,
      result: '',
    }

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
  }

  getPatient(id: string) {
    this.apiService.getPatientById(this.patientID).subscribe({
      next: (response) => {
        this.patient = response;
        console.log('Patient loaded successfully:', this.patient);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading patient:', error);
      }
    });
  }

  getAppointments(id: string) {
    this.apiService.getAppointmentsAndExamsByPatientId(this.patientID).subscribe({
      next: (response: any) => {
        this.appointmentsList = response.appointments;
        console.log('Appointments loaded successfully:', this.appointmentsList);

        this.appointmentsList.sort((a, b) => {
          const dateA = moment(a.consultDate + ' ' + a.consultTime, 'YYYY-MM-DD HH:mm:ss');
          const dateB = moment(b.consultDate + ' ' + b.consultTime, 'YYYY-MM-DD HH:mm:ss');
          return dateB.diff(dateA);
        });

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  getExams(id: string) {
    this.apiService.getAppointmentsAndExamsByPatientId(this.patientID).subscribe({
      next: (response: any) => {
        this.examsList = response.exams;
        console.log('Exams loaded successfully:', this.examsList);

        this.examsList.sort((a, b) => {
          const dateA = moment(a.examDate + ' ' + a.examTime, 'YYYY-MM-DD HH:mm:ss');
          const dateB = moment(b.examDate + ' ' + b.examTime, 'YYYY-MM-DD HH:mm:ss');
          return dateB.diff(dateA);
        });

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading exams:', error);
      }
    });
  }

  editAppointment(id: string) {
    this.router.navigate(['/registro-consulta', id]);
  }

  editExam(id: string) {
    this.router.navigate(['/registro-exame', id]);
  }

  editPatient(id: string) {
    this.router.navigate(['/registro-paciente', id]);
  }

}
