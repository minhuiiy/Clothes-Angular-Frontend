import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <aside class="admin-sidebar">
        <div class="brand">
          <h1>TrendyBox</h1>
        </div>
        <nav class="admin-nav">
          <div class="nav-group">
            <a routerLink="/admin/products" routerLinkActive="active" class="nav-item has-chevron">
              QUẢN LÝ SẢN PHẨM
              <span class="chevron">⌵</span>
            </a>
          </div>
          
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item has-chevron">
            QUẢN LÝ DANH MỤC
            <span class="chevron">⌵</span>
          </a>
          
          <a routerLink="/admin/user-management" routerLinkActive="active" class="nav-item has-chevron">
            QUẢN LÝ NGƯỜI DÙNG
            <span class="chevron">⌵</span>
          </a>
        </nav>
      </aside>
      
      <main class="admin-main">
        <header class="admin-header">
           <div class="breadcrumb"></div>
           <div class="admin-profile">
              <span></span>
              <div class="avatar"></div>
           </div>
        </header>
        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: #f8fafc;
      font-family: 'Inter', sans-serif;
    }

    .admin-sidebar {
      width: 280px;
      background-color: #1e293b;
      color: white;
      display: flex;
      flex-direction: column;
      border-radius: 0 24px 0 0;
    }

    .brand {
      padding: 30px 24px;
    }

    .brand h1 {
      font-size: 24px;
      font-weight: 800;
      margin: 0;
    }

    .admin-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      padding: 12px 24px;
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 20px;
      margin: 4px 12px;
    }

    .nav-item:hover {
      background-color: rgba(226, 232, 240, 0.1);
    }

    .nav-item.active {
      background-color: #e2e8f0;
      color: #1e293b !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .chevron {
       font-size: 12px;
       font-weight: 400;
       opacity: 0.7;
    }

    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      height: 70px;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      border-bottom: 1px solid #f1f5f9;
    }

    .breadcrumb {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 700;
      text-transform: uppercase;
      min-width: 10px;
    }

    .admin-profile {
       display: flex;
       align-items: center;
       gap: 12px;
       font-weight: 700;
       font-size: 14px;
    }

    .avatar {
       width: 32px;
       height: 32px;
       background-color: #cbd5e1;
       border-radius: 50%;
    }

    .admin-content {
      padding: 40px;
      flex: 1;
      overflow-y: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent { }