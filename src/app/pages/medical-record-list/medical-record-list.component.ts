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
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';

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
  menuTrueFalse: boolean | undefined;

  medicalRecordPatientsListPlaceHolder = [{
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

  constructor(
    private titleService: Title, 
    private apiService: ApiService, 
    private router: Router,
    private shareMenuStatusService: ShareMenuStatusService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Lista de prontuários');
    this.getPatients(this.currentPage);

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
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
