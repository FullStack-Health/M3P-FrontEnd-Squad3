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
import { authGuard } from './security/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, data: { animation: 'login'} },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { animation: 'dashboard'} },
    { path: 'lista-prontuarios', component: MedicalRecordListComponent, canActivate: [authGuard], data: { animation: 'lista-prontuarios'} },
    { path: 'prontuario/:id', component: MedicalRecordComponent, canActivate: [authGuard], data: { animation: 'prontuario/:id'} },
    { path: 'registro-paciente', component: PatientRegistrationComponent, canActivate: [authGuard], data: { animation: 'registro-paciente'} },
    { path: 'registro-paciente/:id', component: PatientRegistrationComponent, canActivate: [authGuard], data: { animation: 'registro-paciente/:id'} },
    { path: 'registro-consulta', component: AppointmentRegistrationComponent, canActivate: [authGuard], data: { animation: 'registro-consulta'} },
    { path: 'registro-consulta/:id', component: AppointmentRegistrationComponent, canActivate: [authGuard], data: { animation: 'registro-consulta/:id'} },
    { path: 'registro-exame', component: ExamRegistrationComponent, canActivate: [authGuard], data: { animation: 'registro-exame'} },
    { path: 'registro-exame/:id', component: ExamRegistrationComponent, canActivate: [authGuard], data: { animation: 'registro-exame/:id'} },
    { path: 'lista-usuarios', component: UserListComponent, canActivate: [authGuard], data: { animation: 'lista-usuarios'} },
    { path: 'editar-usuario/:id', component: UserUpdateComponent, canActivate: [authGuard], data: { animation: 'editar-usuario/:id'} }
];
