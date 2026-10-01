import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignupService {
    http = inject(HttpClient);

    apiUrl = 'http://localhost:3000/users';
    customerApiUrl = 'http://localhost:3000/customers';

    loanCreated$ = new BehaviorSubject<void>(undefined);

    signupUser(user: any) {
        return this.http.post(this.apiUrl, user);
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    updateUser(id: any, user: any) {
        return this.http.patch(`${this.apiUrl}/${id}`, user);
    }

    getCustomers(): Observable<any[]> {
        return this.http.get<any[]>(this.customerApiUrl);
    }

    addCustomer(customer: any) {
        return this.http.post(this.customerApiUrl, customer);
    }

    updateCustomer(id: any, customer: any) {
        return this.http.patch(`${this.customerApiUrl}/${id}`, customer);
    }

    deleteCustomer(id: any){
        return this.http.delete(`${this.customerApiUrl}/${id}`);
    }
}
