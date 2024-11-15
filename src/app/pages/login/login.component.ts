import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../security/auth.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, DialogComponent, HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  showRegisterForm = false;
  showPasswordArea = false;
  registerForm: FormGroup;
  changePasswordForm: FormGroup;
  isScreenLarge: boolean | undefined;

  constructor(private router: Router, private titleService: Title, private authService: AuthService, private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(9)]],
      confirm: ['', [Validators.required, Validators.minLength(9)]]
    });
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(9)]]
    });
   }

  @ViewChild(DialogComponent) dialog!: DialogComponent;

  ngOnInit() {
    this.titleService.setTitle('Lab Inc. - Login');
    this.checkWindowSize();
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

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  togglePasswordArea() {
    this.showPasswordArea = !this.showPasswordArea;
  }

  login(): void {
    this.authService.login({ email: this.email, password: this.password })
      .pipe(
        catchError(error => {
          this.dialog.openDialog('Senha ou email inválidos.');
          return throwError(() => error);
        })
      )
      .subscribe(response => {
        this.authService.saveToken(response.token);

        const userRole = this.authService.getUserRole();
        const patientId = this.authService.getPatientId();
        
        if (userRole === 'SCOPE_PACIENTE' && patientId !== null) {
          this.router.navigate([`/prontuario/${patientId}`]);
        } else {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  
  changePassword(): void {
    if (this.changePasswordForm.valid) {
        const { email, newPassword } = this.changePasswordForm.value;

        this.apiService.updatePassword(email, newPassword).subscribe({
            next: () => {
                console.log('Password changed successfully!');
                this.dialog.openDialog('Senha alterada com sucesso!.');
                this.showPasswordArea = false;
                this.changePasswordForm.reset();
            },
            error: (err) => {
              if (err.status === 404) {
                console.error('user email not found:', err);
                this.dialog.openDialog('E-mail de usuário não encontrado.');
              }
            }
        });
    } else {
        console.log('Invalid form!');
    }
  }

  userPreRegister() {
    if (this.registerForm.invalid) {
      this.dialog.openDialog('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const formValue = this.registerForm.value;

    if (formValue.password !== formValue.confirm) {
      console.error('Passwords do not match');
      this.dialog.openDialog('As senhas precisam ser iguais.');
      return;
    }

    const newUser: User = {
      fullName: formValue.name,
      email: formValue.email,
      roleName: formValue.role,
      password: formValue.password
    };

    this.apiService.saveUser(newUser).subscribe({
      next: (response) => {
        console.log('User successfully registered', response);
        this.dialog.openDialog('Cadastro efetuado com sucesso!');
        this.showRegisterForm = false;
        this.registerForm.reset();
      },
      error: (err) => {
        if(err.status === 409 && err.error.fieldName === 'email') {
          this.dialog.openDialog('Já existe um usuário com este e-mail.');
        }
        console.error('Error registering user', err);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  private checkWindowSize(): void {
    if (window.innerWidth > 1023) {
      this.isScreenLarge = true;
    } else {
      this.isScreenLarge = false;
    }
  }
}
