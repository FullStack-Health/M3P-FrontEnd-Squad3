import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataTransformService } from '../../shared/services/data-transform.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Patient } from '../../models/patient.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { ApiService } from '../../shared/services/api.service';
import { Exam } from '../../models/exam.model';
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-exam-register-page',
  standalone: true,
  imports: [ToolbarComponent, SidebarMenuComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatFormField, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButton, ReactiveFormsModule, CommonModule, MatDatepickerModule, HttpClientModule, MatAutocompleteModule, DialogComponent, ConfirmDialogComponent],
  providers: [DataTransformService, ApiService],
  templateUrl: './exam-registration.component.html',
  styleUrl: './exam-registration.component.scss'
})
export class ExamRegistrationComponent implements OnInit {
  showMessage = false;
  patients: any[] = [];
  examId: any = '';
  filteredPatients: Patient[] = [];
  patientSearchControl = new FormControl();
  isEditing: boolean = false;
  saveDisabled: boolean = false;
  examRegistration: FormGroup;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  totalPatients: number = 0;
  noResults: boolean = false;
  menuTrueFalse: boolean | undefined;
  formSubmitted = false;

  constructor(
    private dataTransformService: DataTransformService,
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shareMenuStatusService: ShareMenuStatusService
  ) {
    this.isEditing = !!this.activatedRoute.snapshot.paramMap.get('id'),
      this.examRegistration = this.fb.group({
        id: [{ value: '', disabled: true }, Validators.required],
        fullName: [{ value: '', disabled: true }, Validators.required],
        examName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
        examDate: ['', Validators.required],
        examTime: ['', Validators.required],
        examType: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
        lab: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
        docUrl: ['',],
        result: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(1024)]],
      });
  }

  @ViewChild(DialogComponent) dialog!: DialogComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  matcher = new MyErrorStateMatcher()

  setDate(date: Date) {
    let d = new Date(date);
    d.setHours(d.getHours());
    return d;
  }

  ngOnInit() {
    this.titleService.setTitle('Registro de Exame');
    this.examId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getExamData();

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

  setCurrentTimeAndDate() {
    const currentDate = this.setDate(new Date());
    const dateString = moment(currentDate).format('YYYY-MM-DD');
    const timeString = moment(currentDate).format('HH:mm');

    this.examRegistration.patchValue({
      examDate: dateString,
      examTime: timeString,
    });
  }

  getPatientsBySearchTerm(searchTerm: string, page: number, size: number): void {
    this.apiService.getPatients(searchTerm, 'fullName', page, size).subscribe({
      next: (response: any) => {
        this.filteredPatients = response.content;
        this.totalPatients = response.totalElements;

        if (this.totalPatients === 0) {
          this.noResults = true;
          console.log(this.noResults);
          this.filteredPatients = [];
        } else {
          this.noResults = false;
        }

        this.totalPages = Math.ceil(this.totalPatients / this.pageSize);
        console.log('Successfully loaded patients:', this.filteredPatients);
      },
      error: (error) => {
        console.error('Error when searching for patients:', error);
        this.noResults = true;
      }
    });
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  onSearch() {
    const searchTerm = this.patientSearchControl.value?.trim();
    console.log('Searching for:', searchTerm);

    if (searchTerm && searchTerm.length > 0) {
      this.getPatientsBySearchTerm(searchTerm, this.currentPage, this.pageSize);
    } else {
      this.filteredPatients = [];
      this.totalPatients = 0;
      this.noResults = true;
      console.log(this.noResults);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      const searchTerm = this.patientSearchControl.value?.trim();
      if (searchTerm) {
        this.getPatientsBySearchTerm(searchTerm, this.currentPage, this.pageSize);
      }
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      const searchTerm = this.patientSearchControl.value?.trim();
      if (searchTerm) {
        this.getPatientsBySearchTerm(searchTerm, this.currentPage, this.pageSize);
      }
    }
  }

  selectPatient(patient: any): void {
    this.examRegistration.patchValue({
      id: patient.id,
      fullName: patient.fullName
    })
    this.filteredPatients = [];
    this.patientSearchControl.reset();
  }

  setPatientData(patient: { id: any; fullName: any; }) {
    this.examRegistration.patchValue({
      id: patient.id,
      fullName: patient.fullName
    });

    this.patientSearchControl.setValue('');
  }

  examRegister() {
    this.formSubmitted = true;
    const idPatientValue = this.examRegistration.getRawValue().id;
    const nameValue = this.examRegistration.getRawValue().fullName;

    if(!idPatientValue || !nameValue) {
      this.dialog.openDialog('Por favor, busque um paciente antes de salvar o exame.');
      return;
    }

    if (!this.examRegistration.valid) {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (this.examRegistration.valid) {
      this.formSubmitted = false;

      const newExam: Exam = {
        id: this.examRegistration.getRawValue().id,
        examName: this.examRegistration.value.examName,
        examDate: this.dataTransformService.formatDate(this.examRegistration.value.examDate),
        examTime: this.examRegistration.value.examTime,
        examType: this.examRegistration.value.examType,
        lab: this.examRegistration.value.lab,
        docUrl: this.examRegistration.value.docUrl,
        result: this.examRegistration.value.result,
      }

      this.apiService.saveExam(newExam).subscribe({
        next: (response) => {
          console.log('Exam saved successfully:', response);
          this.showMessage = true;
          this.examRegistration.reset();
          this.setCurrentTimeAndDate();

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (error) => {
          console.error('Error saving exam:', error);
        }
      });

    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
    }
  }

  getExamData() {
    if (this.examId) {
      this.apiService.getExam(this.examId).subscribe({
        next: (exam: Exam) => {
          this.examRegistration.patchValue({
            id: exam.id,
            fullName: exam.fullName,
            examName: exam.examName,
            examDate: exam.examDate,
            examTime: exam.examTime,
            examType: exam.examType,
            lab: exam.lab,
            docUrl: exam.docUrl,
            result: exam.result
          });

        },
        error: (error) => {
          console.error('Error when fetching exam data:', error);
        },
        complete: () => {
          console.log('Exam search completed.');
        }
      });
    } else {
      this.setCurrentTimeAndDate();
    }
  }

  saveEditExam() {
    this.examRegistration.enable();
    this.saveDisabled = false;
    this.formSubmitted = true;

    if (this.examRegistration.valid) {
      this.formSubmitted = false;
      
      const newExam: Exam = {
        id: this.examRegistration.getRawValue().id,
        examName: this.examRegistration.value.examName,
        examDate: this.examRegistration.value.examDate,
        examTime: this.examRegistration.value.examTime,
        examType: this.examRegistration.value.examType,
        lab: this.examRegistration.value.lab,
        docUrl: this.examRegistration.value.docUrl,
        result: this.examRegistration.value.result,
      };

      this.apiService.editExam(this.examId, newExam).subscribe({
        next: (response) => {
          console.log('Exam updated successfully:', response);
          this.showMessage = true;
          this.examRegistration.disable();
          this.saveDisabled = true;

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating exam:', error);

        }
      });
    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
    }
  }

  editExam() {
    this.examRegistration.enable();
    this.saveDisabled = false;
    this.examRegistration.get('id')?.disable();
    this.examRegistration.get('fullName')?.disable();
  }

  deleteExam(id: string) {
    this.confirmDialog.openDialog("Tem certeza que deseja excluir o exame? Essa ação não pode ser desfeita.");

    const subscription = this.confirmDialog.confirm.subscribe(result => {
      if (result) {
        this.apiService.deleteExam(id).subscribe({
          next: () => {
            this.router.navigate(['/lista-prontuarios']);
            subscription.unsubscribe();
          },
          error: (error) => {
            console.error('Error deleting exam:', error);
          }
        });
      } else {
        subscription.unsubscribe();
      }
    });
  }



}








