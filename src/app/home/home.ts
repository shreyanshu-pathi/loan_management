import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddCustomer } from '../add-customer/add-customer';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  router = inject(Router);
  dialog = inject(MatDialog);

  // Add customer button
  addCustomer(): void {
    this.dialog.open(AddCustomer, {
      width: '500px'
    });
  }

  // View details button
  viewDetails(): void {
    this.router.navigate(['/viewDetails']);
  }

  // Total loans
  totalLoans(): void {
    this.router.navigate(['/totalLoans']);
  }
}
