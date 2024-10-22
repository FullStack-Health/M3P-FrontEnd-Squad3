import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { PatientCard } from '../../../models/patient-card.model';
import { Router } from '@angular/router';
import { Page } from '../../../models/page.interface';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgePipe } from '../../../shared/pipes/age.pipe';
import { ShortenNamePipe } from '../../../shared/pipes/shorten-name.pipe';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, AgePipe, ShortenNamePipe],
  providers: [ApiService],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss'
})
export class PatientCardComponent implements OnInit {
  patientID: any = '';
  dashboardPatientsCard: PatientCard[] = [];
  patientsList: any = [];
  searchTerm: string = '';
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 12;
  hasMorePages: boolean = false;
  noResults: boolean = false;

  dashboardPatientsCardPlaceHolder = [{
    "id": "USR123456789",
    "name": "João da Silva",
    "birthdate": "1990-04-12",
    "gender": "Masculino",
    "phone": "(11) 9 8765-4321",
    "email": "joao.silva@example.com",
    "healthInsurance": "Unimed"
  },
  {
    "id": "USR987654321",
    "name": "Maria Oliveira",
    "birthdate": "1985-09-23",
    "gender": "Feminino",
    "phone": "(21) 9 6543-2109",
    "email": "maria.oliveira@example.com",
    "healthInsurance": "Bradesco Saúde"
  },
  {
    "id": "USR456123789",
    "name": "Carlos Pereira",
    "birthdate": "1978-11-02",
    "gender": "Masculino",
    "phone": "(31) 9 1122-3344",
    "email": "carlos.pereira@example.com",
    "healthInsurance": "Amil"
  },
  {
    "id": "USR321654987",
    "name": "Ana Fernandes",
    "birthdate": "1995-06-30",
    "gender": "Feminino",
    "phone": "(41) 9 2233-4455",
    "email": "ana.fernandes@example.com",
    "healthInsurance": "SulAmérica"
  },
  {
    "id": "USR789123456",
    "name": "Pedro Souza",
    "birthdate": "1988-01-19",
    "gender": "Masculino",
    "phone": "(51) 9 3344-5566",
    "email": "pedro.souza@example.com",
    "healthInsurance": "Porto Seguro"
  }];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getPatients(this.currentPage);
  }

  getPatients(page: number): void {
    const searchTerm = this.searchTerm.trim();

    let name: string | undefined;
    let phone: string | undefined;
    let email: string | undefined;

    if (searchTerm) {
      if (/\d/.test(searchTerm)) {
          phone = searchTerm.replace(/[^\d]/g, '');
      } else if (searchTerm.includes('@')) {
          email = searchTerm;
      } else {
          name = searchTerm;
      }
    }

    this.apiService.getPatientCard(page, this.pageSize, name, phone, email).subscribe({
        next: (response: Page<PatientCard>) => {
            this.patientsList = response.content;
            this.dashboardPatientsCard = this.patientsList;

            if (this.patientsList.length === 0) {
                this.noResults = true;
                this.dashboardPatientsCard = [];
            } else {
                this.noResults = false;
            }

            this.totalPages = response.totalPages;
            this.hasMorePages = this.currentPage < this.totalPages - 1;
            console.log('Patients loaded successfully:', this.dashboardPatientsCard);
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error loading patients:', error);
            this.noResults = true;
            this.dashboardPatientsCard = [];
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
  
  medicalRecord(id: string) {
    this.router.navigate(['/lista-prontuarios', id]);
  }
}
