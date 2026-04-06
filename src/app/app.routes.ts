import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetail } from './pages/products/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { WishlistPage } from './pages/wishlist/wishlist';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderHistoryComponent } from './pages/orders/order-history';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail';
import { ProfileComponent } from './pages/profile/profile';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { AdminProductListComponent } from './pages/admin/products/product-list';
import { AdminProductFormComponent } from './pages/admin/products/product-form';
import { AdminCategoryListComponent } from './pages/admin/categories/category-list';
import { AdminOrderListComponent } from './pages/admin/orders/order-list';
import { AdminUserListComponent } from './pages/admin/users/user-list';
import { BrandListComponent } from './pages/admin/brands/brand-list';

export const routes: Routes = [
    { path: '', component: Home, data: { breadcrumb: 'Trang chủ', animation: 'HomePage' } },
    { path: 'auth/login', component: AuthComponent, data: { breadcrumb: 'Đăng nhập tài khoản', animation: 'AuthPage' } },
    { path: 'auth/register', component: AuthComponent, data: { breadcrumb: 'Đăng ký tài khoản', animation: 'AuthPage' } },
    { path: 'products', component: ProductList, data: { breadcrumb: 'Tất cả sản phẩm', animation: 'ProductListPage' } },
    { path: 'products/:id', component: ProductDetail, data: { breadcrumb: 'Chi tiết sản phẩm', animation: 'ProductDetailPage' } },
    { path: 'category/:slug', component: ProductList, data: { breadcrumb: 'Danh mục', animation: 'CategoryPage' } },
    { path: 'brands', component: ProductList, data: { breadcrumb: 'Thương hiệu', animation: 'BrandPage' } },
    { path: 'cart', component: CartComponent, data: { breadcrumb: 'Giỏ hàng', animation: 'CartPage' }, canActivate: [authGuard] },
    { path: 'wishlist', component: WishlistPage, data: { breadcrumb: 'Sản phẩm yêu thích', animation: 'WishlistPage' }, canActivate: [authGuard] },
    { path: 'checkout', component: CheckoutComponent, data: { breadcrumb: 'Thanh toán', animation: 'CheckoutPage' }, canActivate: [authGuard] },
    { path: 'orders', component: OrderHistoryComponent, data: { breadcrumb: 'Lịch sử mua hàng', animation: 'OrdersPage' }, canActivate: [authGuard] },
    { path: 'orders/:id', component: OrderDetailComponent, data: { breadcrumb: 'Chi tiết đơn hàng', animation: 'OrderDetailPage' }, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Tài khoản', animation: 'ProfilePage' }, canActivate: [authGuard] },
    
    // Admin Routes
    {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivate: [adminGuard],
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard', animation: 'AdminDashboard' } },
        { path: 'products', component: AdminProductListComponent, data: { title: 'Quản lý sản phẩm', animation: 'AdminProducts' } },
        { path: 'products/new', component: AdminProductFormComponent, data: { title: 'Thêm sản phẩm', animation: 'AdminProductForm' } },
        { path: 'products/edit/:id', component: AdminProductFormComponent, data: { title: 'Sửa sản phẩm', animation: 'AdminProductForm' } },
        { path: 'categories', component: AdminCategoryListComponent, data: { title: 'Quản lý danh mục', animation: 'AdminCategories' } },
        { path: 'brands', component: BrandListComponent, data: { title: 'Quản lý thương hiệu', animation: 'AdminBrands' } },
        { path: 'orders', component: AdminOrderListComponent, data: { title: 'Quản lý đơn hàng', animation: 'AdminOrders' } },
        { path: 'users', component: AdminUserListComponent, data: { title: 'Quản lý thành viên', animation: 'AdminUsers' } }
      ]
    }
];
