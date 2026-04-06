import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { Observable } from 'rxjs';
import { CategoryService, CategoryMenuResponse, ICategory } from '../../../core/services/category.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isSearchActive = false;
  searchKeyword = '';
  currentUser: any = null;
  cartCount$: Observable<number>;
  menu: CategoryMenuResponse | null = null;
  openDropdown: 'nam' | 'nu' | 'phuKien' | null = null;

  constructor(
    public authService: AuthService, 
    private router: Router,
    private cartService: CartService,
    private categoryService: CategoryService
  ) {
    this.cartCount$ = this.cartService.getCartCount();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.categoryService.getMenu().subscribe({
      next: (data) => {
        this.menu = data;
      },
      error: () => {
        this.menu = { nam: [], nu: [], phuKien: [] };
      }
    });
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  doSearch(event: any) {
    if (event.key === 'Enter') {
      this.router.navigate(['/products'], { queryParams: { keyword: this.searchKeyword } });
      this.isSearchActive = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleDropdown(key: 'nam' | 'nu' | 'phuKien') {
    this.openDropdown = key;
  }

  closeDropdown() {
    this.openDropdown = null;
  }

  onSelectCategory(category: ICategory) {
    this.closeDropdown();
    this.router.navigate(['/products'], { queryParams: { categoryId: category.id } });
  }
}
