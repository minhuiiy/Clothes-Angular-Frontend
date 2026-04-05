import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetail } from './pages/products/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { authGuard } from './core/guards/auth.guard';
import { ClientLayoutComponent } from './shared/layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { CategoryManagementComponent } from './pages/admin/category-management/category-management.component';
import { ProductManagementComponent } from './pages/admin/product-management/product-management';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    // Client Routes
    {
        path: '',
        component: ClientLayoutComponent,
        children: [
            { path: '', component: Home, data: { breadcrumb: 'Trang chủ' } },
            { path: 'auth/login', component: AuthComponent, data: { breadcrumb: 'Đăng nhập tài khoản' } },
            { path: 'auth/register', component: AuthComponent, data: { breadcrumb: 'Đăng ký tài khoản' } },
            { path: 'products', component: ProductList, data: { breadcrumb: 'Tất cả sản phẩm' } },
            { path: 'products/:id', component: ProductDetail, data: { breadcrumb: 'Chi tiết sản phẩm' } },
            { path: 'cart', component: CartComponent, data: { breadcrumb: 'Giỏ hàng' }, canActivate: [authGuard] }
        ]
    },
    // Admin Routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'products', pathMatch: 'full' },
            { path: 'products', component: ProductManagementComponent },
            { path: 'categories', component: CategoryManagementComponent },
            { path: 'user-management', component: UserManagementComponent },
        ]
    }
];
