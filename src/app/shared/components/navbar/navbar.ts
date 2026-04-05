import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { Observable } from 'rxjs';

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
  
  // Categories for dropdowns
  accessoryCategories: any[] = [];
  menCategories: any[] = [];
  womenCategories: any[] = [];

  constructor(
    public authService: AuthService, 
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.cartCount$ = this.cartService.getCartCount();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      // Find Accessories parent
      const accParent = cats.find(c => c.slug === 'phu-kien');
      if (accParent) {
        this.accessoryCategories = cats.filter(c => c.parent_id === accParent.id);
      }
      
      // Basic grouping for others
      this.menCategories = cats.filter(c => c.slug.includes('nam') && !c.parent_id);
      this.womenCategories = cats.filter(c => c.slug.includes('nu') && !c.parent_id);
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
}
