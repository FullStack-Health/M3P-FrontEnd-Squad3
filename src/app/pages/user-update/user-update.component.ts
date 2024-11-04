import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatError } from '@angular/material/form-field';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { SidebarMenuComponent } from '../../shared/components/sidebar-menu/sidebar-menu.component';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ApiService } from '../../shared/services/api.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { RoleTransformPipe } from '../../shared/pipes/role-transform.pipe';
import { AuthService } from '../../security/auth.service';
import { ShareMenuStatusService } from '../../shared/services/share-menu-status.service';
import { DataTransformService } from '../../shared/services/data-transform.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [DialogComponent, ConfirmDialogComponent, ToolbarComponent, SidebarMenuComponent, ReactiveFormsModule, MatError, CommonModule, NgxMaskDirective, NgxMaskPipe, RoleTransformPipe],
  providers: [provideNgxMask(), ApiService, AuthService, DataTransformService],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.scss'
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  isEditing: boolean = false;
  saveDisabled: boolean = false;
  showMessage = false;
  userId: any = '';
  userRole: string | null;
  menuTrueFalse: boolean | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private titleService: Title,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private shareMenuStatusService: ShareMenuStatusService,
    private dataTransformService: DataTransformService
  ) {
    this.userRole = this.authService.getDecodedToken()?.scope || null;
    console.log(this.userRole);
    this.userForm = this.fb.group({
      roleName: [{ value: '', disabled: true }, Validators.required],
      userId: [{ value: '', disabled: true }, Validators.required],
      fullName: ['', [Validators.required, Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  @ViewChild(DialogComponent) dialog!: DialogComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  ngOnInit() {
    this.titleService.setTitle('Administração de Usuários');
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUserData();

    this.shareMenuStatusService.menuTrueFalse$.subscribe(value => {
      this.menuTrueFalse = value;
    });
  }

  getUserData() {
    if (this.userId) {
      this.apiService.getUser(this.userId).subscribe({
        next: (user: User) => {
          this.userForm.patchValue({
            userId: user.userId,
            roleName: user.roleName,
            fullName: user.fullName,
            email: user.email,
            birthdate: user.birthdate,
            cpf: user.cpf,
            phone: user.phone,
          });
        },
        error: (error) => {
          console.error('Error when fetching user data:', error);
        },
        complete: () => {
          console.log('User search completed.');
        }
      });
    }
  }

  saveEditUser() {
    this.userForm.enable();
    this.saveDisabled = false;

    if (this.userForm.valid) {

      const updateUser: User = {
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
        birthdate: this.dataTransformService.formatDate(this.userForm.value.birthdate),
        cpf: this.dataTransformService.formatCpf(this.userForm.value.cpf),
        phone: this.dataTransformService.formatPhone(this.userForm.value.phone),
        roleName: this.userForm.value.roleName,
        userId: this.userForm.value.userId
      };

      this.apiService.updateUser(this.userId, updateUser).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.showMessage = true;
          this.userForm.disable();
          this.saveDisabled = true;
          this.userForm.get('phone')?.disable();

          setTimeout(() => {
            this.showMessage = false;
          }, 1000);
        },
        error: (err) => {
          if(err.status === 409 && err.error.fieldName === 'email') {
            this.dialog.openDialog('Já existe um usuário com este e-mail.');
            this.userForm.get('userId')?.disable();
            this.userForm.get('roleName')?.disable();
          } else if (err.status === 409 && err.error.fieldName === 'cpf') {
            this.dialog.openDialog('Já existe um usuário com este CPF.');
            this.userForm.get('userId')?.disable();
            this.userForm.get('roleName')?.disable();
          }
          console.error('Error updating user:', err);
        }
      });
    } else {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
      this.userForm.get('userId')?.disable();
      this.userForm.get('roleName')?.disable();
    }
  }

  editUser() {
    this.userForm.enable();
    this.saveDisabled = false;
    this.userForm.get('userId')?.disable();
    this.userForm.get('roleName')?.disable();
  }

  deleteUser(id: string) {
    const roleName = this.userForm.get('roleName')?.value;

    if (roleName === 'SCOPE_PACIENTE') {
      this.dialog.openDialog("Não é possível excluir um usuário com perfil Paciente.");
      return;
    }

    this.confirmDialog.openDialog("Tem certeza que deseja excluir o usuário? Essa ação não pode ser desfeita.");

    const subscription = this.confirmDialog.confirm.subscribe(result => {
      if (result) {
        this.apiService.deleteUser(id).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
            subscription.unsubscribe();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
      } else {
        subscription.unsubscribe();
      }
    });
  }


}

