import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MedicalRecordListComponent } from './pages/medical-record-list/medical-record-list.component';
import { PatientRegistrationComponent } from './pages/patient-registration/patient-registration.component';
import { MedicalRecordComponent } from './pages/medical-record/medical-record.component';

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
    }
    
];
