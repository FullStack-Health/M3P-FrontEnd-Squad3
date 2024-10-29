import { Routes } from '@angular/router';
import { AppointmentRegistrationComponent } from './pages/appointment-registration/appointment-registration.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { MedicalRecordListComponent } from './pages/medical-record-list/medical-record-list.component';
import { MedicalRecordComponent } from './pages/medical-record/medical-record.component';
import { PatientRegistrationComponent } from './pages/patient-registration/patient-registration.component';
import {ExamRegistrationComponent} from "./pages/exam-registration/exam-registration.component";
import { UserUpdateComponent } from './pages/user-update/user-update.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'lista-prontuarios', component: MedicalRecordListComponent },
    { path: 'registro-paciente', component: PatientRegistrationComponent },
    { path: 'registro-paciente/:id', component: PatientRegistrationComponent },
    {
        path: 'prontuario',
        children: [
          { path: ':id', component: MedicalRecordComponent }
        ]
    },
    { path: 'registro-consulta', component: AppointmentRegistrationComponent},
    { path: 'registro-exame', component: ExamRegistrationComponent},
    { path: 'editar-usuario/:id', component: UserUpdateComponent}


];
