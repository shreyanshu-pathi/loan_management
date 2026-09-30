import { Component, inject } from '@angular/core';
import { SignupService } from '../signup-service';

@Component({
  imports: [],
  selector: 'app-total-loans',
  styleUrl: './total-loans.scss',
  templateUrl: './total-loans.html',
})
export class TotalLoans {
  signupService = inject(SignupService);

  totalLoans: number = 0;
  currentUser: any = null;

  ngOnInit(): void{
    this.getTotalLoans();
  }

  getTotalLoans(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!this.currentUser) {
      this.totalLoans = 0;
      return;
    }

    this.signupService.getCustomers().subscribe({
      next: (customers) => {
        const userLoans = customers.filter((customer) =>
          customer.phone === this.currentUser.phone);
        this.totalLoans = userLoans.length;
      },
      error: (error) => {
        console.error('Failed to load total loans', error);
        this.totalLoans = 0;
      }
    })
  }

}
