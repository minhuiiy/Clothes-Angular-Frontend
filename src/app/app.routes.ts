import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'auth/login', component: AuthComponent },
    { path: 'auth/register', component: AuthComponent }
];
