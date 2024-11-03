import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask, NgxMaskPipe } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../../shared/services/api.service';
import { AddressService } from '../../shared/services/address.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { DataTransformService } from '../../shared/services/data-transform.service';
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [SidebarMenuComponent, ToolbarComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatFormField, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe, HttpClientModule, CommonModule, DialogComponent, ConfirmDialogComponent],
  providers: [provideNgxMask(), ApiService, AddressService, DataTransformService],
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss'
})
export class PatientRegistrationComponent implements OnInit {
  showMessage = false;
  patientId: any = '';
  patients: any[] = [];
  filteredPatients: Observable<any[]> | undefined;
  patientSearchControl = new FormControl();
  saveDisabled: boolean = false;
  isEditing: boolean = false;
  patRegistration: FormGroup;
  menuTrueFalse: boolean | undefined;

  constructor(
    private apiService: ApiService,
    private titleService: Title,
    private addressService: AddressService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataTransformService: DataTransformService,
    private shareMenuStatusService: ShareMenuStatusService
  ) {
    this.isEditing = !!this.activatedRoute.snapshot.paramMap.get('id'),
    this.patRegistration = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      // issOrg: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      placeOfBirth: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
      emergencyContact: ['', Validators.required],
      // emergContNumber: ['', Validators.required],
      listOfAllergies: [''],
      listCare: [''],
      healthInsurance: ['', Validators.required],
      healthInsuranceNumber: [''],
      healthInsuranceVal: [''],
      zipcode: ['', Validators.required],
      street: ['', Validators.required],
      addressNumber: [''],
      complement: [''],
      referencePoint: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });
  }

  @ViewChild(DialogComponent) dialog!: DialogComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  matcher = new MyErrorStateMatcher()

  ngOnInit() {
    this.titleService.setTitle('Registro de Paciente');
    this.patientId = this.activatedRoute.snapshot.paramMap.get('id');
    this.monitorZipcodeChanges();
    this.getPatientData();

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
  }

  searchZipcode(zipcode: string) {
    this.addressService.getCep(zipcode).subscribe(data => {
      this.patRegistration.patchValue({
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      });
    });
  }

  monitorZipcodeChanges() {
    const zipcodeControl = this.patRegistration.get('zipcode');
    if (zipcodeControl) {
      zipcodeControl.valueChanges.subscribe(zipcode => {
        if (zipcode && zipcode.length === 8) {
          this.searchZipcode(zipcode);
        }
      });
    }
  }

  patientRegister() {
    if (this.patRegistration.valid) {

      const newPatient: Patient = {
        fullName: this.patRegistration.value.fullName,
        gender: this.patRegistration.value.gender,
        birthDate: this.patRegistration.value.birthDate,
        cpf: this.dataTransformService.formatCpf(this.patRegistration.value.cpf),
        rg: this.patRegistration.value.rg,
        // issOrg: this.patRegistration.value.issOrg,
        maritalStatus: this.patRegistration.value.maritalStatus,
        phone: this.dataTransformService.formatPhone(this.patRegistration.value.phone),
        email: this.patRegistration.value.email,
        placeOfBirth: this.patRegistration.value.placeOfBirth,
        emergencyContact: this.dataTransformService.formatPhone(this.patRegistration.value.emergencyContact),
        // emergContNumber: this.dataTransformService.formatPhone(this.patRegistration.value.emergContNumber),
        listOfAllergies: this.patRegistration.value.listOfAllergies,
        listCare: this.patRegistration.value.listCare,
        healthInsurance: this.patRegistration.value.healthInsurance,
        healthInsuranceNumber: this.patRegistration.value.healthInsuranceNumber,
        healthInsuranceVal: this.patRegistration.value.healthInsuranceVal ? 
            this.patRegistration.value.healthInsuranceVal : undefined,
        zipcode: this.dataTransformService.formatCep(this.patRegistration.value.zipcode),
        street: this.patRegistration.value.street,
        addressNumber: this.patRegistration.value.addressNumber,
        complement: this.patRegistration.value.complement,
        referencePoint: this.patRegistration.value.referencePoint,
        neighborhood: this.patRegistration.value.neighborhood,
        city: this.patRegistration.value.city,
        state: this.patRegistration.value.state,
      };

      this.apiService.savePatient(newPatient).subscribe({
        next: (response) => {
          console.log('Patient saved successfully:', response);
          this.showMessage = true;
          this.patRegistration.reset();

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (err) => {
          if (err.status === 400 && err.error.errors) {
            const birthDateError = err.error.errors.find((e: any) => e.fieldName === 'birthDate');
            const healthInsValError = err.error.errors.find((e: any) => e.fieldName === 'healthInsuranceVal');
            
            if (birthDateError) {
              this.dialog.openDialog("A data de nascimento precisa estar no passado.");
            } else if (healthInsValError) {
              this.dialog.openDialog("A data de validade do convênio deve estar no futuro.");
            } else {
              this.dialog.openDialog('Preencha os campos obrigatórios corretamente.');
            }
            
            } else if (err.status === 409) {
              const cpfAlreadyExists = err.status === 409 && err.error.error.includes("O CPF já está cadastrado");
              const emailAlreadyExists = err.status === 409 && err.error.error.includes("O Email já está cadastrado");
              const rgAlreadyExists = err.status === 409 && err.error.error.includes("O RG já está cadastrado");

              if (cpfAlreadyExists) {
              this.dialog.openDialog("Já existe paciente cadastrado com este CPF.");

              } else if (rgAlreadyExists) {
                this.dialog.openDialog("Já existe paciente cadastrado com este RG.");
              } else if (emailAlreadyExists) {
                this.dialog.openDialog("Já existe paciente cadastrado com este e-mail.");
              } else {
                console.error('Error saving patient:', err);
                this.dialog.openDialog('Ocorreu um erro ao salvar o paciente.');
              }
          }
        }
      });

    }
  }

  saveEditPatient() {
    this.patRegistration.enable();
    this.saveDisabled = false;

    if (this.patRegistration.valid) {

      const newPatient: Patient = {
        fullName: this.patRegistration.value.fullName,
        gender: this.patRegistration.value.gender,
        birthDate: this.patRegistration.value.birthDate,
        cpf: this.dataTransformService.formatCpf(this.patRegistration.value.cpf),
        rg: this.patRegistration.value.rg,
        // issOrg: this.patRegistration.value.issOrg,
        maritalStatus: this.patRegistration.value.maritalStatus,
        phone: this.dataTransformService.formatPhone(this.patRegistration.value.phone),
        email: this.patRegistration.value.email,
        placeOfBirth: this.patRegistration.value.placeOfBirth,
        emergencyContact: this.dataTransformService.formatPhone(this.patRegistration.value.emergencyContact),
        // emergContNumber: this.patRegistration.value.emergContNumber,
        listOfAllergies: this.patRegistration.value.listOfAllergies,
        listCare: this.patRegistration.value.listCare,
        healthInsurance: this.patRegistration.value.healthInsurance,
        healthInsuranceNumber: this.patRegistration.value.healthInsuranceNumber,
        healthInsuranceVal: this.patRegistration.value.healthInsuranceVal ? 
            this.patRegistration.value.healthInsuranceVal : undefined,
        zipcode: this.dataTransformService.formatCep(this.patRegistration.value.zipcode),
        street: this.patRegistration.value.street,
        addressNumber: this.patRegistration.value.addressNumber,
        complement: this.patRegistration.value.complement,
        referencePoint: this.patRegistration.value.referencePoint,
        neighborhood: this.patRegistration.value.neighborhood,
        city: this.patRegistration.value.city,
        state: this.patRegistration.value.state,
      };

      this.apiService.editPatient(this.patientId, newPatient).subscribe({
        next: (response) => {
          console.log('Patient updated successfully:', response);
          this.showMessage = true;
          this.patRegistration.disable();
          this.saveDisabled = true;

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (err) => {
          if (err.status === 400 && err.error.errors) {
            const birthDateError = err.error.errors.find((e: any) => e.fieldName === 'birthDate');
            const healthInsValError = err.error.errors.find((e: any) => e.fieldName === 'healthInsuranceVal');
            
            if (birthDateError) {
              this.dialog.openDialog("A data de nascimento precisa estar no passado.");
            } else if (healthInsValError) {
              this.dialog.openDialog("A data de validade do convênio deve estar no futuro.");
            } else {
              this.dialog.openDialog('Preencha os campos obrigatórios corretamente.');
            }
            
            } else if (err.status === 409) {
              const cpfAlreadyExists = err.status === 409 && err.error.error.includes("O CPF já está cadastrado");
              const emailAlreadyExists = err.status === 409 && err.error.error.includes("O Email já está cadastrado");
              const rgAlreadyExists = err.status === 409 && err.error.error.includes("O RG já está cadastrado");

              if (cpfAlreadyExists) {
              this.dialog.openDialog("Já existe paciente cadastrado com este CPF.");

              } else if (rgAlreadyExists) {
                this.dialog.openDialog("Já existe paciente cadastrado com este RG.");
              } else if (emailAlreadyExists) {
                this.dialog.openDialog("Já existe paciente cadastrado com este e-mail.");
              } else {
                console.error('Error saving patient:', err);
                this.dialog.openDialog('Ocorreu um erro ao salvar o paciente.');
              }
          }
        }
      });
    }
  }
  

  editPatient() {
    this.patRegistration.enable();
    this.saveDisabled = false;
  }

  deletePatient(id: string) {
    this.apiService.hasAppointmentsOrExamsByPatientId(id).subscribe({
      next: (hasRecords: boolean) => {
        if (hasRecords) {
          this.dialog.openDialog('O paciente tem exames ou consultas vinculadas a ele e não pode ser deletado.');
        } else {
          this.confirmDialog.openDialog("Tem certeza que deseja excluir o paciente? Essa ação não pode ser desfeita.");
  
          const subscription = this.confirmDialog.confirm.subscribe(result => {
            if (result) {
              this.apiService.deletePatient(id).subscribe(() => {
                this.router.navigate(['/dashboard']);
                subscription.unsubscribe();
              });
            } else {
              subscription.unsubscribe();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error checking patient records:', error);
      }
    });
  }

  getPatientData() {
    if (this.patientId) {
      this.apiService.getPatient(this.patientId).subscribe({
        next: (patient: Patient) => {

          const formattedBirthdate = this.convertDate(patient.birthDate);
          const formattedInsuranceVal = patient.healthInsuranceVal ? this.convertDate(patient.healthInsuranceVal) : undefined;

          this.patRegistration.patchValue({
            
            fullName: patient.fullName,
            gender: patient.gender,
            birthDate: formattedBirthdate,
            cpf: patient.cpf,
            rg: patient.rg,
            // issOrg: patient.issOrg,
            maritalStatus: patient.maritalStatus,
            phone: patient.phone,
            email: patient.email,
            placeOfBirth: patient.placeOfBirth,
            emergencyContact: patient.emergencyContact,
            // emergContNumber: patient.emergContNumber,
            listOfAllergies: patient.listOfAllergies,
            listCare: patient.listCare,
            healthInsurance: patient.healthInsurance,
            healthInsuranceNumber: patient.healthInsuranceNumber,
            healthInsuranceVal: formattedInsuranceVal,
            zipcode: patient.zipcode,
            street: patient.street,
            addressNumber: patient.addressNumber,
            complement: patient.complement,
            referencePoint: patient.referencePoint,
            neighborhood: patient.neighborhood,
            city: patient.city,
            state: patient.state
          });
        },
        error: (error) => {
          console.error('Error when fetching patient data:', error);
        },
        complete: () => {
          console.log('Patient search completed.');
        }
      });
    }
  }

  convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}


}


