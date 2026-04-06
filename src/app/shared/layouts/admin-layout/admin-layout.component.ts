import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="bg-surface text-on-surface antialiased flex min-h-screen font-body shadow-none m-0 p-0">
      
      <!-- SideNavBar -->
      <aside class="fixed left-0 top-0 h-full flex flex-col py-8 bg-stone-50 h-screen w-64 border-r-0 z-50">
        <div class="px-8 mb-12">
          <h1 class="text-xl font-bold font-headline tracking-tighter text-neutral-900 uppercase">The Muse Admin</h1>
          <p class="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mt-1">Quản trị viên</p>
        </div>
        <nav class="flex-1 space-y-1">
          <a href="#" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">dashboard</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Tổng quan</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-stone-100 text-neutral-900 font-bold border-l-2 border-neutral-900 pl-8 translate-x-1" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">inventory_2</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Sản phẩm</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-stone-100 text-neutral-900 font-bold border-l-2 border-neutral-900 pl-8 translate-x-1" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">category</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Danh mục</span>
          </a>
          <a href="#" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">shopping_bag</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Đơn hàng</span>
          </a>
          <a routerLink="/admin/user-management" routerLinkActive="bg-stone-100 text-neutral-900 font-bold border-l-2 border-neutral-900 pl-8 translate-x-1" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">group</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Người dùng</span>
          </a>
          <a href="#" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">sell</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Khuyến mãi</span>
          </a>
          <a href="#" class="flex items-center px-8 py-3 text-neutral-500 hover:text-neutral-800 hover:bg-stone-100 transition-colors duration-300 group">
            <span class="material-symbols-outlined mr-4">settings</span>
            <span class="uppercase tracking-widest text-[11px] font-medium">Cài đặt</span>
          </a>
        </nav>
        <div class="px-6 mt-auto">
          <button class="w-full py-4 bg-primary text-on-primary text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-primary-dim transition-all duration-300 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">add</span>
            Thêm sản phẩm
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="ml-64 flex-1 flex flex-col min-h-screen relative">
        <!-- TopAppBar -->
        <header class="flex justify-between items-center w-full px-12 py-4 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm border-b border-outline-variant/10">
          <div class="flex items-center gap-8">
            <h2 class="text-xl font-medium font-headline text-neutral-800">{{ getPageTitle() }}</h2>
            <nav class="hidden md:flex gap-6">
              <a class="text-neutral-500 hover:text-neutral-900 text-[11px] uppercase tracking-widest transition-colors font-medium" href="#">Báo cáo</a>
              <a class="text-neutral-500 hover:text-neutral-900 text-[11px] uppercase tracking-widest transition-colors font-medium" href="#">Hỗ trợ</a>
            </nav>
          </div>
          <div class="flex items-center gap-6">
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3 text-outline text-lg">search</span>
              <input class="pl-10 pr-4 py-2 bg-transparent border-b border-outline focus:border-primary outline-none text-[12px] w-64 transition-all duration-300 focus:w-80" placeholder="Tìm kiếm hệ thống..." type="text"/>
            </div>
            <div class="flex items-center gap-4 border-l border-outline-variant/20 pl-6">
              <div class="relative group">
                <span class="material-symbols-outlined text-neutral-800 cursor-pointer">notifications</span>
                <span class="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                  <p class="text-[11px] font-bold uppercase tracking-wider text-neutral-900">Admin Muse</p>
                  <p class="text-[9px] text-neutral-500 uppercase">Quản trị viên</p>
                </div>
                <img alt="Admin Profile" class="w-8 h-8 object-cover grayscale brightness-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC51eaBMIihJz5vV3xht90Ofv2G0f9mejNttH4WXeevyEpvNLUo4safjrDkbQ6dts3q6YAPx_7ebDHrWWI_FjYbW6fGfqSmyi8WYfaU4IWvrJsDEYKqn3LCbdo2m_4RFQiSVc8nb1I76bK8Egv34rgX87uXjduNY27cCynZ1DEqSDo0c7le08G127Jg3sIjwcQU7SlyeJjtVw9WkHlrccUTdjANlkSOq4jVxxDzt86rDDShmjCjbvB8kPs1KeRYX2pRVeOjjIDLbqA"/>
              </div>
            </div>
          </div>
        </header>

        <section class="flex-1">
          <router-outlet></router-outlet>
        </section>

      </main>
    </div>
  `,
  styleUrls: []
})
export class AdminLayoutComponent implements OnInit {
  currentPageTitle = 'Bảng Điều Khiển';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Force update of title when navigation finishes
    });
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('products')) return 'Quản lý Sản phẩm';
    if (url.includes('categories')) return 'Quản lý Danh mục';
    if (url.includes('user')) return 'Quản lý Người dùng';
    if (url.includes('orders')) return 'Quản lý Đơn hàng';
    return 'Bảng Điều Khiển';
  }
}