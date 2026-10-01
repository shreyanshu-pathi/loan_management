import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SignupService } from '../signup-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatSnackBarModule, MatDialogModule, MatDatepickerModule,
    MatNativeDateModule],
  providers: [provideNativeDateAdapter()],
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
      // loanTenure: ['', Validators.required],

      loanStartDate: ['', Validators.required],
      loanEndDate: ['', Validators.required],

      interestType: ['', Validators.required],
      interestAmount: ['', Validators.required],
      interestPeriod: ['', Validators.required],

      totalInterest: [0],
      totalRepayment: [0],

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
        // loanTenure: this.data.loanTenure,
        loanStartDate: this.data.loanStartDate,
        loanEndDate: this.data.loanEndDate,
        interestType: this.data.interestType,
        interestAmount: this.data.interestAmount,
        interestPeriod: this.data.interestPeriod,
        notes: this.data.notes
      });
    }
  }

  interestTypes = [
    'Daily', 'Weekly', 'Monthly', 'Quartly'
  ]

  // Calculate interest 
  calculateInterest(): void {
    const loanAmount = Number(this.customerForm.get('loanAmount')?.value) || 0;
    const interestAmount = Number(this.customerForm.get('interestAmount')?.value) || 0;
    const interestType = this.customerForm.get('interestType')?.value;

    if (!interestAmount || !interestType) {
      this.customerForm.patchValue({
        totalInterest: 0, totalRepayment: loanAmount
      });
      return;
    }

    let monthlyInterest = 0;
    switch (interestType) {
      case 'Daily':
        monthlyInterest = interestAmount * 15;
        break;

      case 'Weekly':
        monthlyInterest = interestAmount * 30;
        break;

      case 'Monthly':
        monthlyInterest = interestAmount * 4;
        break;

      case 'Quarterly':
        monthlyInterest = interestAmount / 3;
        break;
    }

    const totalInterest = monthlyInterest * this.getNumberOfMonths();
    const totalRepayment = loanAmount + totalInterest;
    this.customerForm.patchValue({
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100
    });
  }

  getNumberOfMonths(): number {
    const start = this.customerForm.get('loanStartDate')?.value;
    const end = this.customerForm.get('loanEndDate')?.value;
    if (!start || !end) {
      return 0;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    return Math.max(months, 0);
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
      // loanTenure: this.customerForm.value.loanTenure,
      notes: this.customerForm.value.notes,
      loanStartDate: this.customerForm.value.loanStartDate,
      loanEndDate: this.customerForm.value.loanEndDate,
      interestType: this.customerForm.value.interestType,
      interestAmount: this.customerForm.value.interestAmount,
      interestPeriod: this.customerForm.value.interestPeriod,
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
      return;
    }

    // Add new loan 
    this.signupService.addCustomer(customer).subscribe({
      next: (newCustomer) => {

        // refresh total loans
        this.signupService.loanCreated$.next();
        this.snackBar.open('Loan application submitted successfully', 'Close', {
          duration: 3000
        });
        this.dialogRef.close(newCustomer);
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