import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { SignupService } from '../signup-service';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { email } from '@angular/forms/signals';

const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.parent?.get('password')?.value;
  const confirmPassword = control.value;

  if (!password || !confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true }
}

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule,
    MatSnackBarModule, RouterLink, MatIconModule, MatRadioModule
  ],
  selector: 'app-signup',
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
})
export class Signup {
  fb = inject(FormBuilder);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  signupService = inject(SignupService);

  data = inject(MAT_DIALOG_DATA, { optional: true });

  hide = signal(true);
  hideConfirmPassword = signal(true);

  signupForm: FormGroup;

  constructor() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      ]],
      confirmPassword: ['', [Validators.required, passwordValidator]]
    });

    // edit mode 
    if (this.data) {
      this.signupForm.patchValue({
        name: this.data.name,
        phone: this.data.phone,
        gender: this.data.gender,
        email: this.data.email,
      });
    }
  }

  // signup
  signup(): void {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const user = this.signupForm.value;

    this.signupService.signupUser(user).subscribe({
      next: (users) => {

        this.snackBar.open('Registered successfully', 'Close', {
          duration: 3000
        });

        this.signupForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.snackBar.open('Registration failed', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
