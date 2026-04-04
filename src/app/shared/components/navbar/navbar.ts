import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart.service';
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

  constructor(
    public authService: AuthService, 
    private router: Router,
    private cartService: CartService
  ) {
    this.cartCount$ = this.cartService.getCartCount();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
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
