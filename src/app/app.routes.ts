import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetail } from './pages/products/product-detail/product-detail';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'auth/login', component: AuthComponent },
    { path: 'auth/register', component: AuthComponent },
    { path: 'products', component: ProductList },
    { path: 'products/:id', component: ProductDetail }
];
