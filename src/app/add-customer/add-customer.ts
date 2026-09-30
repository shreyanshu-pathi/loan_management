import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SignupService } from '../signup-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatSnackBarModule, MatDialogModule],
  selector: 'app-add-customer',
  styleUrl: './add-customer.scss',
  templateUrl: './add-customer.html',
})
export class AddCustomer {

  fb = inject(FormBuilder);
  signupService = inject(SignupService);
  snackBar = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<AddCustomer>);
  data = inject(MAT_DIALOG_DATA);

  customerForm: FormGroup;

  constructor() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      loanType: ['', Validators.required],
      loanAmount: ['', Validators.required],
      loanTenure: ['', Validators.required],
      notes: ['']
    });

    // edit customer form
    if (this.data) {
      this.customerForm.patchValue({
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.address,
        loanType: this.data.loanType,
        loanAmount: this.data.loanAmount,
        loanTenure: this.data.loanTenure,
        notes: this.data.notes
      });
    }
  }

  // Apply for loan
  applyForLoan(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customer = {
      name: this.customerForm.value.name,
      phone: this.customerForm.value.phone,
      address: this.customerForm.value.address,
      loanType: this.customerForm.value.loanType,
      loanAmount: this.customerForm.value.loanAmount,
      loanTenure: this.customerForm.value.loanTenure,
      notes: this.customerForm.value.notes,
      loanStatus: 'Pending'
    }

    // edits the existing user's loan form
    if (this.data?.id) {
      this.signupService.updateCustomer(this.data.id, customer).subscribe({
        next: (updatedCustomer) => {
          this.snackBar.open('Loan application submitted succssfully', 'Close', {
            duration: 3000
          });
          this.dialogRef.close(updatedCustomer);
        },
        error: (error) => {
          console.error('Failed to submit loan application', error);
          this.snackBar.open('Loan application failed to submit', 'Close', {
            duration: 3000
          });
        }
      });
    }

    // Add new loan 
    this.signupService.addCustomer(customer).subscribe({
      next: () => {
        this.snackBar.open('Loan application submitted successfully', 'Close', {
          duration: 3000
        });
        this.customerForm.reset();
      },
      error: (error) => {
        console.error('Failed to submit application', error);
        this.snackBar.open('Failed to submit application', 'Close', {
          duration: 3000
        });
      }
    });
  }

  // cancel
  cancel(): void {
    this.dialogRef.close();
  }
}