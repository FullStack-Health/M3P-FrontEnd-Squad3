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
  
  constructor(private apiService: ApiService, private titleService: Title, private addressService: AddressService, private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private dataTransformService: DataTransformService) { this.isEditing = !!this.activatedRoute.snapshot.paramMap.get('id'),
    this.patRegistration = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['', [Validators.required, Validators.maxLength(20)]],
      issOrg: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      placeOfBirth: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
      emergCont: ['', Validators.required],
      emergContNumber: ['', Validators.required],
      listOfAllergies: [''],
      careList: [''],
      healthInsurance: ['',Validators.required],
      healthInsuranceNumber: [''],
      healthInsuranceVal: [''],
      zipcode: ['', Validators.required],
      street: [''],
      addressNumber: [''],
      complement: [''],
      referencePoint: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
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
  
      const cpf = this.patRegistration.value.cpf.replace(/\D/g, '');
      const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

      const newPatient: Patient = {
          name: this.patRegistration.value.name,
          gender: this.patRegistration.value.gender,
          birthdate: this.patRegistration.value.birthdate,
          cpf: formattedCpf,
          rg: this.patRegistration.value.rg,
          issOrg: this.patRegistration.value.issOrg,
          maritalStatus: this.patRegistration.value.maritalStatus,
          phone: this.dataTransformService.formatPhone(this.patRegistration.value.phone),
          email: this.patRegistration.value.email,
          placeOfBirth: this.patRegistration.value.placeOfBirth,
          emergCont: this.patRegistration.value.emergCont,
          emergContNumber: this.dataTransformService.formatPhone(this.patRegistration.value.emergContNumber),
          listOfAllergies: this.patRegistration.value.listOfAllergies,
          careList: this.patRegistration.value.careList,
          healthInsurance: this.patRegistration.value.healthInsurance,
          healthInsuranceNumber: this.patRegistration.value.healthInsuranceNumber,
          healthInsuranceVal: this.patRegistration.value.healthInsuranceVal ?
          this.patRegistration.value.healthInsuranceVal : null,
          zipcode: this.patRegistration.value.zipcode,
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
        error: (error) => {
          console.error('Error saving patient:', error);
        }
      });
      
    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
    }
  }

  saveEditPatient() {
    this.patRegistration.enable();
    this.saveDisabled = false;

    if (this.patRegistration.valid) {
    
      const cpf = this.patRegistration.value.cpf.replace(/\D/g, '');
      const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

      const newPatient: Patient = {
          name: this.patRegistration.value.name,
          gender: this.patRegistration.value.gender,
          birthdate: this.patRegistration.value.birthdate,
          cpf: formattedCpf,
          rg: this.patRegistration.value.rg,
          issOrg: this.patRegistration.value.issOrg,
          maritalStatus: this.patRegistration.value.maritalStatus,
          phone: this.patRegistration.value.phone,
          email: this.patRegistration.value.email,
          placeOfBirth: this.patRegistration.value.placeOfBirth,
          emergCont: this.patRegistration.value.emergCont,
          emergContNumber: this.patRegistration.value.emergContNumber,
          listOfAllergies: this.patRegistration.value.listOfAllergies,
          careList: this.patRegistration.value.careList,
          healthInsurance: this.patRegistration.value.healthInsurance,
          healthInsuranceNumber: this.patRegistration.value.healthInsuranceNumber,
          healthInsuranceVal: this.patRegistration.value.healthInsuranceVal ?
          this.patRegistration.value.healthInsuranceVal : null,
          zipcode: this.patRegistration.value.zipcode,
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
        error: (error) => {
          console.error('Error updating patient:', error);
        
        }
      });
    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
    }
  }

  editPatient(){
    this.patRegistration.enable();
    this.saveDisabled = false;
  }

  deletePatient(id: string) {
    // implementar lógica após criação dos components e models para exam e appointment (paciente não pode ser excluído se tiver exames ou consultas)
  }
  
  getPatientData() {
    if (this.patientId) {
      this.apiService.getPatient(this.patientId).subscribe({
        next: (patient: Patient) => {
          this.patRegistration.patchValue({
            name: patient.name,
            gender: patient.gender,
            birthdate: patient.birthdate,
            cpf: patient.cpf,
            rg: patient.rg,
            issOrg: patient.issOrg,
            maritalStatus: patient.maritalStatus,
            phone: patient.phone,
            email: patient.email,
            placeOfBirth: patient.placeOfBirth,
            emergCont: patient.emergCont,
            emergContNumber: patient.emergContNumber,
            listOfAllergies: patient.listOfAllergies,
            careList: patient.careList,
            healthInsurance: patient.healthInsurance,
            healthInsuranceNumber: patient.healthInsuranceNumber,
            healthInsuranceVal: patient.healthInsuranceVal,
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
  

}

