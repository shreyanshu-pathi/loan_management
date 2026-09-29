import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  selector: 'app-add-customer',
  styleUrl: './add-customer.scss',
  templateUrl: './add-customer.html',
})
export class AddCustomer {

  fb = inject(FormBuilder);

  customerForm: FormGroup;

  constructor() {
    this.customerForm = this.fb.group({
      name: [''],
      phone: [''],
      address: [''],
      notes: ['']
    });
  }

  save(): void {
    
  }
}