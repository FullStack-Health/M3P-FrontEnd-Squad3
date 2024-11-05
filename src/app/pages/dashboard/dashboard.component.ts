import { Component, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { Title } from '@angular/platform-browser';
import { StatsRoleDoctorComponent } from './statistics/stats-role-doctor/stats-role-doctor.component';
import { AuthService } from '../../security/auth.service';
import { CommonModule } from '@angular/common';
import { StatsRoleAdminComponent } from './statistics/stats-role-admin/stats-role-admin.component';
import { PatientCardComponent } from './patient-card/patient-card.component';
import { HttpClientModule } from '@angular/common/http';
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, StatsRoleDoctorComponent, CommonModule, StatsRoleAdminComponent, PatientCardComponent, HttpClientModule],
  providers: [AuthService, ApiService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userRole: string | null;
  menuTrueFalse: boolean | undefined;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private shareMenuStatusService: ShareMenuStatusService,
    private apiService: ApiService
  ) {
    this.userRole = this.authService.getDecodedToken()?.scope || null;
    console.log(this.userRole);
  }

  ngOnInit() {
    this.titleService.setTitle('Informações e Estatísticas');

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
    this.callBackend();
  }

  callBackend(): void {
    this.apiService.callBackend().subscribe({
      next: (response) => {
        console.log('Backend is alive!', response);
      },
      error: (error) => {
        console.error('Error trying to call backend:', error);
      }
    });
  }
}
