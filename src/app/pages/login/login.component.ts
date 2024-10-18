import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../security/service/auth.service';

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
  registerForm: FormGroup;

  constructor(private router: Router, private titleService: Title, private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(9)]],
      confirm: ['', [Validators.required, Validators.minLength(9)]]
    });
   }

  @ViewChild(DialogComponent) dialog!: DialogComponent;

  ngOnInit() {
    this.titleService.setTitle('LABMedical - Login');
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
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
        this.router.navigate(['/home']);
      });
  }
  
  forgotPassword() {
    // implementar lógica 
  }

  userPreRegister() {
    // implementar lógica
  }

}
