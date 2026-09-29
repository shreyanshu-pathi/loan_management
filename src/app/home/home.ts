import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  imports: [MatButtonModule],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  router = inject(Router);

  // signup
  signup(): void{
    this.router.navigate(['/signup']);
  }

  // login
  login(): void{
    this.router.navigate(['/login']);
  }
}
