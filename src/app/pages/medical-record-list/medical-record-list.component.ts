import { Component, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { ListPatients } from '../../models/list-patients.model';
import { Title } from '@angular/platform-browser';
import { Page } from '../../models/page.interface';
import { ShortenNamePipe } from '../../shared/pipes/shorten-name.pipe';

@Component({
  selector: 'app-medical-record-list',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, HttpClientModule, CommonModule, FormsModule, RouterModule, ShortenNamePipe],
  providers: [ApiService],
  templateUrl: './medical-record-list.component.html',
  styleUrl: './medical-record-list.component.scss'
})
export class MedicalRecordListComponent implements OnInit {
  medicalRecordPatientsList: ListPatients[] = [];
  searchTerm: string = '';
  patientsList: any = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  hasMorePages: boolean = false;
  noResults: boolean = false;

  constructor(private titleService: Title, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle('Lista de prontuários');
    this.getPatients(this.currentPage);
  }

  getPatients(page: number): void {
    const searchTerm = this.searchTerm.trim();

    let name: string | undefined;
    let id: string | undefined;

    if (searchTerm) {
      if (/\d/.test(searchTerm)) {
        id = searchTerm;
      } else {
        name = searchTerm;
    }
  }

    this.apiService.listPatients(page, this.pageSize, name, id).subscribe({
        next: (response: Page<ListPatients>) => {

            this.patientsList = response.content;
            this.medicalRecordPatientsList = this.patientsList;
            
            if (this.patientsList.length === 0) {
                this.noResults = true;
                this.medicalRecordPatientsList = [];
            } else {
                this.noResults = false;
            }

            this.totalPages = response.totalPages;
            this.hasMorePages = this.currentPage < this.totalPages - 1;
            console.log('Patients loaded successfully:', this.medicalRecordPatientsList);
            
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error loading patients:', error);
            this.noResults = true;
            this.medicalRecordPatientsList = [];
        }
    });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getPatients(this.currentPage);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getPatients(this.currentPage);
    }
  }

  isPreviousDisabled(): boolean {
    return this.currentPage === 0;
  }

  isNextDisabled(): boolean {
    return this.currentPage >= this.totalPages - 1;
  }

  search(): void {
    this.currentPage = 0;
    this.getPatients(this.currentPage);
}

  clearSearch(): void {
      this.searchTerm = '';
      this.getPatients(this.currentPage);
  }
  
  editPatient(id: string) {
    this.router.navigate(['/cadastro-paciente', id]);
  }

}
