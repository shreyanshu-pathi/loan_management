import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddCustomer } from '../add-customer/add-customer';
import { SignupService } from '../signup-service';
import { Signup } from '../signup/signup';

@Component({
  imports: [MatIconModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  selector: 'app-user-profile-dialog',
  styleUrl: './user-profile-dialog.scss',
  templateUrl: './user-profile-dialog.html',
})
export class UserProfileDialog {
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  signupService = inject(SignupService);
  dialogRef = inject(MatDialogRef<UserProfileDialog>);

  data = inject(MAT_DIALOG_DATA, { optional: true });

  // Profile picture
  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Please select an image', 'Close', {
        duration: 3000
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.data.profileImage = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  // remove profile picture
  removeProfilePicture(): void {
    if (!this.data) {
      return;
    }
    this.data.profileImage = null;
  }

  // Edit user information
  editUserInformation(): void {
    const currentUser = JSON.parse( localStorage.getItem('currentUser') || 'null');

    if (!this.data) {
      this.snackBar.open('User information not found', 'Close', {
        duration: 3000
      });
    }

    const dialogRef = this.dialog.open(Signup, {
      width: '600px',
      data: currentUser
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      if(updatedUser){

        // update profile data
        this.data = {
          ...this.data,
          ...updatedUser
        }
        localStorage.setItem('currentUser', JSON.stringify(this.data))
      }
    });
  }

  // Edit loan application
  editLoanApplication(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Check if logged-in user exists 
    if (!currentUser) {
      this.snackBar.open('User information not found', 'Close', {
        duration: 3000
      });
      return;
    }

    //  Store logged-in user in current dialog 
    this.data = currentUser;

    this.signupService.getCustomers().subscribe({
      next: (customers) => {
        const customer = customers.find((customer) => customer.phone === this.data.phone);

        // no loan application found
        if (!customer) {
          this.snackBar.open('No loan application found', 'Close', {
            duration: 3000
          });
          return;
        }

        const dialogRef = this.dialog.open(AddCustomer, {
          width: '500px',
          data: customer
        });

        dialogRef.afterClosed().subscribe((updatedCustomer) => {
          if (updatedCustomer) {
            this.data = {
              ...this.data,
              ...updatedCustomer
            }
          }
        });
      },
      error: (error) => {
        console.error('Failed to load customer', error);
        this.snackBar.open('Unable to load loan application', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
