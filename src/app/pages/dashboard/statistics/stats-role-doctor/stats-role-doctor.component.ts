import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DashboardStats } from '../../../../models/dashboard-stats.interface';

@Component({
  selector: 'app-stats-role-doctor',
  standalone: true,
  imports: [],
  providers: [ApiService],
  templateUrl: './stats-role-doctor.component.html',
  styleUrl: './stats-role-doctor.component.scss'
})
export class StatsRoleDoctorComponent {
  countPatients: number = 0;
  countAppointments: number = 0;
  countExams: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getDashboardStats();
  }
    
  getDashboardStats(): void {
    this.apiService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.countPatients = stats.totalPatients;
        this.countAppointments = stats.totalAppointments;
        this.countExams = stats.totalExams;
        console.log('Dashboard stats loaded successfully:', stats);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
}
