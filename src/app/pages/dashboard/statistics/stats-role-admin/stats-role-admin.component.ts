import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DashboardStats } from '../../../../models/dashboard-stats.interface';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-stats-role-admin',
  standalone: true,
  imports: [HttpClientModule],
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
        this.countPatients = stats.totalPatients;
        this.countAppointments = stats.totalAppointments;
        this.countExams = stats.totalExams;
        this.countUsers = stats.totalUsers;
        console.log('Dashboard stats loaded successfully:', stats);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
}
