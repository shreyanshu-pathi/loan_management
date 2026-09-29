import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SignupService } from '../signup-service';

@Component({
  imports: [MatTableModule],
  selector: 'app-view-details',
  styleUrl: './view-details.scss',
  templateUrl: './view-details.html',
})
export class ViewDetails {
  router = inject(Router);
  signupService = inject(SignupService)

  displayedColumns: string[] = [
    'name', 'phone', 'email', 'gender', 'loanStatus', 'actions'
  ]

  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.signupService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
      },
      error: (error) => {
        console.error('Failed to load users', error);
      }
    })
  }
}
