import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SignupService } from '../signup-service';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, FormsModule, MatButtonModule,
    MatInputModule, MatSnackBarModule, MatIconModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  fb = inject(FormBuilder);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  signupService = inject(SignupService);

  loginForm: FormGroup;

  hide = signal(true);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // login
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.signupService.getUsers().subscribe({
      next: (users) => {
        const user = users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          this.loginForm.controls['email'].setErrors({ emailNotRegistered: true });
          this.loginForm.controls['email'].markAsTouched();
          return;
        }

        if(user.password !== password){
          this.loginForm.controls['password'].setErrors({ incorrectPassword: true });
          this.loginForm.controls['password'].markAsTouched();
          return;
        }

        if (user) {
          this.snackBar.open('Login successfully', 'Close', {
            duration: 3000
          });
          this.loginForm.reset();
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Invalid email or password', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.snackBar.open('Login failed', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
