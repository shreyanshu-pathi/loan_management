import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AddCustomer } from '../add-customer/add-customer';
import { SignupService } from '../signup-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  router = inject(Router);
  dialog = inject(MatDialog);
  signupService = inject(SignupService);

  totalLoanCount = 0;

  ngOnInit(): void {
    this.getTotalLoans();

    // refresh loans
    this.signupService.loanCreated$.subscribe(() => {
      this.getTotalLoans();
    });
  }

  getTotalLoans(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
      this.totalLoanCount = 0;
      return;
    }

    this.signupService.getCustomers().subscribe({
      next: (customers) => {
        const userLoans = customers.filter(
          customer => customer.phone === currentUser.phone
        );
        this.totalLoanCount = userLoans.length;
        // console.log('Dashboard Total Loans:', this.totalLoanCount);
      },
      error: (error) => {
        console.error('Failed to get total loans:', error);
        this.totalLoanCount = 0;
      }
    });
  }

  addCustomer(): void {
    const dialogRef = this.dialog.open(AddCustomer, {
      width: '500px'
    });

    // Refresh after dialog closes
    dialogRef.afterClosed().subscribe(() => {
      this.getTotalLoans();
    });
  }

  viewDetails(): void {
    this.router.navigate(['/viewDetails']);
  }

  totalLoans(): void {
    this.router.navigate(['/totalLoans']);
  }
}