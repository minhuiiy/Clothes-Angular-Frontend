import { Component, inject, signal, computed, OnInit, HostListener, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ThemeService } from '../../../core/services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, of, tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private themeService = inject(ThemeService);

  // Theme State
  currentTheme = this.themeService.theme;

  // State using Signals
  isSearchActive = signal(false);
  searchKeyword = signal('');
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  activeMegaMenu = signal<string | null>(null);
  
  // Announcements
  announcements = [
    'Miễn phí vận chuyển cho đơn hàng trên 500.000đ',
    'Đổi trả trong 30 ngày - Hoàn tiền 100%',
    'Ưu đãi 10% khi đăng ký thành viên mới',
    'Bộ sưu tập Hè 2024 đã có mặt tại cửa hàng'
  ];
  currentAnnouncementIndex = signal(0);
  private announcementInterval: any;

  // Search Results
  quickSearchResults = signal<any[]>([]);
  isSearching = signal(false);

  // Convert Observables to Signals
  currentUser = toSignal(this.authService.currentUser$);
  cartCount = toSignal(this.cartService.getCartCount(), { initialValue: 0 });
  wishlistCount = this.wishlistService.wishlistCount;
  categories = toSignal(this.categoryService.getAllCategories(), { initialValue: [] });

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  ngOnInit() {
    this.startAnnouncementCarousel();
    this.setupQuickSearch();
  }

  ngOnDestroy() {
    if (this.announcementInterval) {
      clearInterval(this.announcementInterval);
    }
  }

  private startAnnouncementCarousel() {
    this.announcementInterval = setInterval(() => {
      this.currentAnnouncementIndex.update(i => (i + 1) % this.announcements.length);
    }, 4000);
  }

  private setupQuickSearch() {
    // This could be more sophisticated with an effect or manual subscription
    // For now, we'll keep it simple and just use the searchKeyword signal
  }

  onSearchInput(event: any) {
    const keyword = event.target.value;
    this.searchKeyword.set(keyword);
    
    if (keyword.length > 2) {
      this.isSearching.set(true);
      this.productService.getProducts(keyword, 0, 5).subscribe({
        next: (res: any) => {
          this.quickSearchResults.set(res.content || []);
          this.isSearching.set(false);
        },
        error: () => {
          this.isSearching.set(false);
        }
      });
    } else {
      this.quickSearchResults.set([]);
    }
  }

  toggleSearch() {
    this.isSearchActive.update(v => !v);
    if (this.isSearchActive()) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('#searchInput')?.focus();
      }, 100);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  doSearch(event: any) {
    const keyword = this.searchKeyword();
    if (keyword.trim()) {
      this.router.navigate(['/products'], { queryParams: { keyword: keyword } });
      this.isSearchActive.set(false);
      this.isMobileMenuOpen.set(false);
      this.quickSearchResults.set([]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  setActiveMegaMenu(menu: string | null) {
    this.activeMegaMenu.set(menu);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
