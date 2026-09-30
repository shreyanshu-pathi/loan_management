import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { UserProfileDialog } from '../user-profile-dialog/user-profile-dialog';

@Component({
  imports: [MatButtonModule, RouterLink, MatDialogModule],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  router = inject(Router);
  dialog = inject(MatDialog);

  isLoggedIn = signal(!!localStorage.getItem('currentUser'));

  // signup
  signup(): void {
    this.router.navigate(['/signup']);
  }

  // login
  login(): void {
    this.router.navigate(['/login']);
  }

  // user profile 
  userProfile(): void {
    this.dialog.open(UserProfileDialog, {
      width: '500px'
    });
  }

  // logout
  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
