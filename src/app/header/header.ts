import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [MatButtonModule, RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  router = inject(Router);

  // signup
  signup(): void {
    this.router.navigate(['/signup']);
  }

  // login
  login(): void {
    this.router.navigate(['/login']);
  }
}
