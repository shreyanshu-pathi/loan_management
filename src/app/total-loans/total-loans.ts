import { Component, inject } from '@angular/core';
import { SignupService } from '../signup-service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomer } from '../add-customer/add-customer';
import { DeleteLoanDialog } from '../delete-loan-dialog/delete-loan-dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-total-loans',
  imports: [MatButtonModule, FormsModule],
  templateUrl: './total-loans.html',
  styleUrl: './total-loans.scss'
})
export class TotalLoans {

  signupService = inject(SignupService);
  dialog = inject(MatDialog);

  totalLoans: number = 0;
  currentUser: any = null;

  loans: any[] = [];
  filteredLoans: any[] = [];
  searchText: string = '';

  ngOnInit(): void {

    // loads initially
    this.getTotalLoans();

    // Refresh whenever a new loan is created
    this.signupService.loanCreated$.subscribe(() => {
      this.getTotalLoans();
    });
  }

  // gets total loans
  getTotalLoans(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!this.currentUser) {
      this.totalLoans = 0;
      this.loans = [];
      this.filteredLoans = [];
      return;
    }

    this.signupService.getCustomers().subscribe({
      next: (customers) => {
        const userLoans = customers.filter(
          customer => customer.phone === this.currentUser.phone
        );
        this.loans = userLoans;
        this.filteredLoans = userLoans;
        this.totalLoans = userLoans.length;
        // console.log('TOTAL LOANS:', this.totalLoans);
      },
      error: (error) => {
        console.error('Failed to load total loans', error);
        this.loans = [];
        this.filteredLoans = [];
        this.totalLoans = 0;
      }
    });
  }

  // search loans
  searchLoans(): void {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      this.filteredLoans = this.loans;
      return;
    }

    this.filteredLoans = this.loans.filter(loan =>
      loan.loanType?.toLowerCase().includes(search));
  }

  // edit loan
  editLoan(loan: any): void {
    const dialogRef = this.dialog.open(AddCustomer, {
      width: '500px',
      data: loan
    });

    dialogRef.afterClosed().subscribe((updatedLoan) => {
      if (updatedLoan) {
        this.getTotalLoans();
      }
    });
  }

  // delete loan
  deleteLoan(id: string): void {
    const dialogRef = this.dialog.open(DeleteLoanDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.signupService.deleteCustomer(id).subscribe({
        next: () => {
          this.loans = this.loans.filter(loan => loan.id !== id);
          this.totalLoans = this.loans.length;
        },
        error: (error) => {
          console.error('Failed to delete loan', error);
        }
      });
    });
  }
}