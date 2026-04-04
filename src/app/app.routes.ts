import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetail } from './pages/products/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home, data: { breadcrumb: 'Trang chủ' } },
    { path: 'auth/login', component: AuthComponent, data: { breadcrumb: 'Đăng nhập tài khoản' } },
    { path: 'auth/register', component: AuthComponent, data: { breadcrumb: 'Đăng ký tài khoản' } },
    { path: 'products', component: ProductList, data: { breadcrumb: 'Tất cả sản phẩm' } },
    { path: 'products/:id', component: ProductDetail, data: { breadcrumb: 'Chi tiết sản phẩm' } },
    { path: 'cart', component: CartComponent, data: { breadcrumb: 'Giỏ hàng' }, canActivate: [authGuard] }
];
