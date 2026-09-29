import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  router = inject(Router);

  addCustomer(): void {
    this.router.navigate(['/addCustomer']);
  }

  viewDetails():void{
    this.router.navigate(['/viewDetails']);
  }
}
