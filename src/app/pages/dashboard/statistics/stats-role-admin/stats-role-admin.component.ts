import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DashboardStats } from '../../../../models/dashboard-stats.interface';
import { HttpClientModule } from '@angular/common/http';
import { ShareMenuStatusService } from '../../../../shared/services/share-menu-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-role-admin',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './stats-role-admin.component.html',
  styleUrl: './stats-role-admin.component.scss'
})
export class StatsRoleAdminComponent {
  countPatients: number = 0;
  countAppointments: number = 0;
  countExams: number = 0;
  countUsers: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getStats();
  }

  getStats(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.countPatients = stats.countPatients;
        this.countAppointments = stats.countAppointments;
        this.countExams = stats.countExams;
        this.countUsers = stats.countUsers;
        console.log('Dashboard stats loaded successfully:', stats);

        console.log('stats:', {
          countPatients: this.countPatients,
          countAppointments: this.countAppointments,
          countExams: this.countExams,
          countUsers: this.countUsers,
      });
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
}
