import { Routes } from '@angular/router';
import { AppointmentRegistrationComponent } from './pages/appointment-registration/appointment-registration.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { MedicalRecordListComponent } from './pages/medical-record-list/medical-record-list.component';
import { MedicalRecordComponent } from './pages/medical-record/medical-record.component';
import { PatientRegistrationComponent } from './pages/patient-registration/patient-registration.component';
import {ExamRegistrationComponent} from "./pages/exam-registration/exam-registration.component";
import { UserUpdateComponent } from './pages/user-update/user-update.component';
import { UserListComponent } from './pages/user-list/user-list.component';

export const routes: Routes = [
    { path: '', component: LoginComponent, data: { animation: 'login'} },
    { path: 'dashboard', component: DashboardComponent, data: { animation: 'dashboard'} },
    { path: 'lista-prontuarios', component: MedicalRecordListComponent, data: { animation: 'lista-prontuarios'} },
    { path: 'registro-paciente', component: PatientRegistrationComponent, data: { animation: 'registro-paciente'} },
    { path: 'registro-paciente/:id', component: PatientRegistrationComponent, data: { animation: 'registro-paciente/:id'} },
    {
        path: 'prontuario',
        children: [
          { path: ':id', component: MedicalRecordComponent, data: { animation: 'prontuario/:id'} }
        ]
    },
    { path: 'registro-consulta', component: AppointmentRegistrationComponent, data: { animation: 'registro-consulta'} },
    { path: 'registro-exame', component: ExamRegistrationComponent, data: { animation: 'registro-exame'} },
    { path: 'editar-usuario/:id', component: UserUpdateComponent, data: { animation: 'editar-usuario/:id'} },
    { path: 'lista-usuarios', component: UserListComponent, data: { animation: 'lista-usuarios'} }
];
