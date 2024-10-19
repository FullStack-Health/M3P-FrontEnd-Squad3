import { Component, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { Title } from '@angular/platform-browser';
import { StatsRoleDoctorComponent } from './statistics/stats-role-doctor/stats-role-doctor.component';
import { AuthService } from '../../security/service/auth.service';
import { CommonModule } from '@angular/common';
import { StatsRoleAdminComponent } from './statistics/stats-role-admin/stats-role-admin.component';
import { PatientCardComponent } from './patient-card/patient-card.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, StatsRoleDoctorComponent, CommonModule, StatsRoleAdminComponent, PatientCardComponent, HttpClientModule],
  providers: [AuthService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userRole: string | null;

  constructor(private titleService: Title, private authService: AuthService) {
    this.userRole = this.authService.getDecodedToken()?.scope || null;
    console.log(this.userRole);
   }

  ngOnInit() {
    this.titleService.setTitle('Informações e Estatísticas');
  }

}
