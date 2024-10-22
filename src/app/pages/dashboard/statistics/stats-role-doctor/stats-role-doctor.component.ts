import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DashboardStats } from '../../../../models/dashboard-stats.interface';
import { ShareMenuStatusService } from '../../../../shared/services/share-menu-status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-role-doctor',
  standalone: true,
  imports: [CommonModule],
  providers: [ApiService],
  templateUrl: './stats-role-doctor.component.html',
  styleUrl: './stats-role-doctor.component.scss'
})
export class StatsRoleDoctorComponent {
  countPatients: number = 0;
  countAppointments: number = 0;
  countExams: number = 0;
  menuTrueFalse: boolean | undefined;

  constructor(private apiService: ApiService, private shareMenuStatusService: ShareMenuStatusService) { }

  ngOnInit(): void {
    this.getDashboardStats();

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
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
