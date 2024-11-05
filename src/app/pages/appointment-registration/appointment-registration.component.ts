import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Appointment } from '../../models/appointment.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { ApiService } from '../../shared/services/api.service';
import { DataTransformService } from '../../shared/services/data-transform.service';
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-appointment-registration',
  standalone: true,
  imports: [ToolbarComponent, SidebarMenuComponent, ConfirmDialogComponent, DialogComponent, HttpClientModule, CommonModule, MatFormField, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatButton, ReactiveFormsModule],
  providers: [DataTransformService, ApiService],
  templateUrl: './appointment-registration.component.html',
  styleUrl: './appointment-registration.component.scss'
})
export class AppointmentRegistrationComponent implements OnInit {
  showMessage = false;
  appointmentId: any = '';
  patients: any[] = [];
  filteredPatients: any[] = [];
  patientSearchControl = new FormControl();
  isEditing: boolean = false;
  saveDisabled: boolean = false;
  appointRegistration: FormGroup;
  noResults: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  totalPatients: number = 0;
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
      this.appointRegistration = this.fb.group({
        id: [{ value: '', disabled: true }, Validators.required],
        fullName: [{ value: '', disabled: true }, Validators.required],
        reason: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
        consultDate: ['', Validators.required],
        consultTime: ['', Validators.required],
        problemDescrip: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(1024)]],
        prescMed: ['',],
        dosagesPrec: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(256)]],
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
    this.titleService.setTitle('Registro de Consulta');
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAppointmentData();

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

    this.appointRegistration.patchValue({
      consultDate: dateString,
      consultTime: timeString,
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
    this.appointRegistration.patchValue({
      id: patient.id,
      fullName: patient.fullName
    })
    this.filteredPatients = [];
    this.patientSearchControl.reset();
  }

  appointRegister() {
    this.formSubmitted = true;
    const idPatientValue = this.appointRegistration.getRawValue().id;
    const nameValue = this.appointRegistration.getRawValue().fullName;

    if(!idPatientValue || !nameValue) {
      this.dialog.openDialog('Por favor, busque um paciente antes de salvar a consulta.');
      return;
    }

    if (!this.appointRegistration.valid) {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (this.appointRegistration.valid) {

      const newAppointment: Appointment = {
        id: this.appointRegistration.getRawValue().id,
        reason: this.appointRegistration.value.reason,
        consultDate: this.appointRegistration.value.consultDate,
        consultTime: this.appointRegistration.value.consultTime,
        problemDescrip: this.appointRegistration.value.problemDescrip,
        prescMed: this.appointRegistration.value.prescMed,
        dosagesPrec: this.appointRegistration.value.dosagesPrec,
      }

      this.apiService.saveAppointment(newAppointment).subscribe({
        next: (response) => {
          console.log('Appointment saved successfully:', response);
          this.showMessage = true;
          this.appointRegistration.reset();
          this.setCurrentTimeAndDate();

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
        }
      });

    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
    }
  }

  getAppointmentData() {
    if (this.appointmentId) {
      this.apiService.getAppointment(this.appointmentId).subscribe({
        next: (appointment: Appointment) => {
          this.appointRegistration.patchValue({
            id: appointment.id,
            fullName: appointment.fullName,
            reason: appointment.reason,
            consultDate: appointment.consultDate,
            consultTime: appointment.consultTime,
            problemDescrip: appointment.problemDescrip,
            prescMed: appointment.prescMed,
            dosagesPrec: appointment.dosagesPrec,
          });
        },
        error: (error) => {
          console.error('Error when fetching appointment data:', error);
        },
        complete: () => {
          console.log('Appointment search completed.');
        }
      });
    } else {
      this.setCurrentTimeAndDate();
    }
  }

  saveEditAppoint() {
    this.appointRegistration.enable();
    this.saveDisabled = false;
    this.formSubmitted = true;

    if (this.appointRegistration.valid) {

      const newAppointment: Appointment = {
        id: this.appointRegistration.getRawValue().id,
        reason: this.appointRegistration.value.reason,
        consultDate: this.appointRegistration.value.consultDate,
        consultTime: this.appointRegistration.value.consultTime,
        problemDescrip: this.appointRegistration.value.problemDescrip,
        prescMed: this.appointRegistration.value.prescMed,
        dosagesPrec: this.appointRegistration.value.dosagesPrec,
      };

      this.apiService.editAppointment(this.appointmentId, newAppointment).subscribe({
        next: (response) => {
          console.log('Appointment updated successfully:', response);
          this.showMessage = true;
          this.appointRegistration.disable();
          this.saveDisabled = true;

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating appointment:', error);

        }
      });
    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
    }
  }

  editAppoint() {
    this.appointRegistration.enable();
    this.saveDisabled = false;
    this.appointRegistration.get('id')?.disable();
    this.appointRegistration.get('fullName')?.disable();
  }

  deleteAppointment(id: string) {
    this.confirmDialog.openDialog("Tem certeza que deseja excluir a consulta? Essa ação não pode ser desfeita.");

    const subscription = this.confirmDialog.confirm.subscribe(result => {
      if (result) {
        this.apiService.deleteAppointment(id).subscribe({
          next: () => {
            this.router.navigate(['/lista-prontuarios']);
            subscription.unsubscribe();
          },
          error: (error) => {
            console.error('Error deleting appointment:', error);
          }
        });
      } else {
        subscription.unsubscribe();
      }
    });
  }

}