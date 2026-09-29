import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Header } from './header/header';
import { AddCustomer } from './add-customer/add-customer';
import { ViewDetails } from './view-details/view-details';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'signup', component: Signup },
    { path: 'login', component: Login },
    { path: 'header', component: Header },
    { path: 'addCustomer', component: AddCustomer },
    { path: 'viewDetails', component: ViewDetails }
];
