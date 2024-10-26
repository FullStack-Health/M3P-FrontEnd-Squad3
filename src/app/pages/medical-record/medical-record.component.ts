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


@Component({
  selector: 'app-medical-record',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, HttpClientModule, MatTabsModule, MatDividerModule, CommonModule, RouterLink, MatButton, MatButtonModule, SliderComponent, DateFormatPipe, TimeFormatPipe, TimelineModule, CardModule, AgePipe],
  providers: [ApiService],
  templateUrl: './medical-record.component.html',
  styleUrl: './medical-record.component.scss'
})
export class MedicalRecordComponent implements OnInit {
  patientID: any = '';
  patient: PatientRecord | undefined = undefined;
  appointment: AppointmentRecord | undefined = undefined;
  exam: ExamRecord | undefined = undefined;
  patientsList: any = [];
  appointmentsList: AppointmentRecord[] = [{
    id: '1',
    appointment_id: '1',
    patientName: 'João da Silva',
    reason: 'Consulta de rotina',
    consultDate: '2023-04-01',
    consultTime: '10:00',
    problemDescrip: 'Nenhum problema específico',
    prescMed: null,
    dosagesPrec: null,
  },
  {
    id: '2',
    appointment_id: '2',
    patientName: 'Maria Oliveira',
    reason: 'Revisão pós-cirúrgica',
    consultDate: '2023-05-15',
    consultTime: '14:30',
    problemDescrip: 'Acompanhar recuperação pós-cirúrgica',
    prescMed: 'Analgésico, Antibiótico',
    dosagesPrec: '2x ao dia, 1x ao dia por 7 dias'
  },
  {
    id: '3',
    appointment_id: '3',
    patientName: 'Carlos Pereira',
    reason: 'Exame de rotina',
    consultDate: '2023-06-20',
    consultTime: '09:00',
    problemDescrip: 'Verificação geral de saúde',
    prescMed: 'Vitamina D',
    dosagesPrec: '1x ao dia'
  }];;
  examsList: ExamRecord[] = [{
    id: '1',
    examId: '1',
    patientName: 'João da Silva',
    exam: 'Raio-X',
    examDate: '2023-04-15',
    examTime: '11:00',
    examType: 'Imagens',
    lab: 'Laboratório Diagnósticos',
    docUrl: null,
    result: 'Normal'
  },
  {
    id: '2',
    examId: '2',
    patientName: 'Maria Oliveira',
    exam: 'Ultrassonografia',
    examDate: '2023-05-10',
    examTime: '13:00',
    examType: 'Imagens',
    lab: 'Centro de Imagem',
    docUrl: "www.centroimagem/doc",
    result: 'Normal'
  },
  {
    id: '3',
    examId: '3',
    patientName: 'Carlos Pereira',
    exam: 'Eletrocardiograma',
    examDate: '2023-06-25',
    examTime: '09:30',
    examType: 'Cardiologia',
    lab: 'Laboratório São Paulo',
    docUrl: "www.labsp/doc",
    result: 'Alterações mínimas'
  }];

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Prontuário de paciente');

    this.patientID = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.patientID, 'esse é o id do paciente');

    this.getPatient(this.patientID);
    this.getAppointments(this.patientID);
    this.getExams(this.patientID);

    this.patient = {
      id: 1,
      name: 'João da Silva',
      gender: 'Masculino',
      birthdate: '1990-04-12',
      cpf: '123.456.789-00',
      rg: 'MG-12.345.678',
      issOrg: 'SSP/MG',
      maritalStatus: 'Solteiro',
      phone: '(11) 9 8765-4321',
      email: 'joao.silva@example.com',
      placeOfBirth: 'São Paulo',
      emergCont: 'Maria da Silva',
      emergContNumber: '(11) 9 1234-5678',
      listOfAllergies: 'Nenhuma',
      careList: 'N/A',
      healthInsurance: 'Unimed',
      healthInsuranceNumber: '123456789',
      healthInsuranceVal: '2025-12-31',
      zipcode: '01001-000',
      street: 'Avenida Paulista',
      addressNumber: '1000',
      complement: 'Apto 101',
      referencePoint: 'Próximo ao MASP',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      appointments: [
        {
          id: 'APP001',
          appointment_id: 'APT20230401',
          patientName: 'João da Silva',
          reason: 'Consulta de rotina',
          consultDate: '2023-04-01',
          consultTime: '10:00',
          problemDescrip: 'Nenhum problema específico',
          prescMed: null,
          dosagesPrec: null,
        },
        {
          id: 'APP002',
          appointment_id: 'APT20230515',
          patientName: 'João da Silva',
          reason: 'Revisão pós-cirúrgica',
          consultDate: '2023-05-15',
          consultTime: '14:30',
          problemDescrip: 'Acompanhar recuperação pós-cirúrgica',
          prescMed: 'Analgésico, Antibiótico',
          dosagesPrec: '2x ao dia, 1x ao dia por 7 dias',
        },
        {
          id: 'APP003',
          appointment_id: 'APT20230620',
          patientName: 'João da Silva',
          reason: 'Exame de rotina',
          consultDate: '2023-06-20',
          consultTime: '09:00',
          problemDescrip: 'Verificação geral de saúde',
          prescMed: 'Vitamina D',
          dosagesPrec: '1x ao dia',
        },
      ],
      exams: [
        {
          id: 'EX001',
          examId: 'EXM20230315',
          patientName: 'João da Silva',
          exam: 'Sangue',
          examDate: '2023-03-15',
          examTime: '09:00',
          examType: 'Hematologia',
          lab: 'Laboratório São Paulo',
          docUrl: null,
          result: 'Normal',
        },
        {
          id: 'EX002',
          examId: 'EXM20230415',
          patientName: 'João da Silva',
          exam: 'Raio-X',
          examDate: '2023-04-15',
          examTime: '11:00',
          examType: 'Imagens',
          lab: 'Laboratório Diagnósticos',
          docUrl: null,
          result: 'Normal',
        },
        {
          id: 'EX003',
          examId: 'EXM20230510',
          patientName: 'João da Silva',
          exam: 'Ultrassonografia',
          examDate: '2023-05-10',
          examTime: '13:00',
          examType: 'Imagens',
          lab: 'Centro de Imagem',
          docUrl: null,
          result: 'Normal',
        },
      ]
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


    /** Não esquecer de tirar o comentário
    this.patient = {
      id: '',
      name: '',
      emergCont: '',
      emergContNumber: '',
      listOfAllergies: null,
      careList: null,
      healthInsurance: '',
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
    */
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
