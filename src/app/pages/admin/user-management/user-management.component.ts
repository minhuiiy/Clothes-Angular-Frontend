import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-admin-page p-8 bg-white min-h-screen">
      <div class="page-header mb-8">
        <h1 class="text-[26px] font-black text-black uppercase tracking-wide">QUẢN LÝ NGƯỜI DÙNG</h1>
      </div>

      <div class="controls-row flex flex-col md:flex-row gap-6 mb-6 items-center justify-start">
        <div class="search-box relative w-full md:w-80">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input 
            type="text" 
            [(ngModel)]="searchKeyword"
            placeholder="Tìm kiếm người dùng..." 
            class="block w-full pl-11 pr-4 py-2.5 bg-[#f1f3f5] rounded-full text-sm outline-none placeholder-gray-500 font-medium text-gray-800"
          >
        </div>

        <div class="filter-group flex items-center gap-3">
          <span class="text-sm font-bold text-black">Lọc theo</span>
          <div class="relative">
            <select [(ngModel)]="selectedRole" class="bg-[#f1f3f5] rounded-full px-5 py-2.5 text-sm font-bold text-gray-800 outline-none appearance-none cursor-pointer pr-10 min-w-[120px]">
              <option value="ALL">Vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">Khách hàng</option>
            </select>
            <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</span>
          </div>
        </div>
      </div>

      <div class="table-wrapper overflow-hidden rounded-t-lg">
        <table class="user-table w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#c2d4ff] text-black">
              <th class="px-6 py-3.5 font-bold text-sm">Họ và tên</th>
              <th class="px-6 py-3.5 font-bold text-sm">Email</th>
              <th class="px-6 py-3.5 font-bold text-sm">Vai trò</th>
              <th class="px-6 py-3.5 font-bold text-sm">Trạng thái</th>
              <th class="px-6 py-3.5 font-bold text-sm">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of getFilteredUsers()" class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{user.fullName}}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{user.email}}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{user.role === 'ADMIN' ? 'admin' : 'Khách hàng'}}</td>
              <td class="px-6 py-4 text-sm">
                <button class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full cursor-pointer transition-all font-bold text-xs text-white"
                      [ngClass]="user.active ? 'bg-[#22c55e] hover:bg-[#1fa951]' : 'bg-[#c81e1e] hover:bg-[#a51919]'"
                      (click)="toggleUserStatus(user)">
                  {{user.active ? 'Đang hoạt động' : 'Bị khóa'}}
                  <span class="text-[10px] mt-[1px]">v</span>
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="w-7 h-7 rounded-[4px] bg-[#facc15] text-white flex items-center justify-center hover:bg-yellow-500 transition-colors" 
                          (click)="changeRolePrompt(user)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button class="w-7 h-7 rounded-[4px] bg-[#ef4444] text-white flex items-center justify-center hover:bg-red-600 transition-colors" 
                          (click)="confirmDelete(user)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent implements OnInit {
  users: IUser[] = [];
  selectedRole: string = 'ALL';
  searchKeyword: string = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  getFilteredUsers(): IUser[] {
    return this.users.filter(u => {
      const matchRole = this.selectedRole === 'ALL' || u.role === this.selectedRole;
      const matchSearch = (u.fullName?.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.searchKeyword.toLowerCase()));
      return matchRole && matchSearch;
    });
  }

  toggleUserStatus(user: IUser): void {
    const newStatus = !user.active;
    this.userService.updateStatus(user.id, newStatus).subscribe({
      next: (updated) => {
        user.active = updated.active;
        this.cdr.markForCheck();
      },
      error: (err) => alert('Lỗi khi cập nhật trạng thái: ' + err.message)
    });
  }

  changeRolePrompt(user: IUser): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const roleText = newRole === 'ADMIN' ? 'ADMIN' : 'Khách hàng';
    if (confirm(`Xác nhận đổi vai trò của ${user.fullName} thành ${roleText}?`)) {
      this.userService.updateRole(user.id, newRole).subscribe({
        next: (updated) => {
          user.role = updated.role;
          this.cdr.markForCheck();
        },
        error: (err) => alert('Lỗi khi cập nhật vai trò: ' + err.message)
      });
    }
  }

  confirmDelete(user: IUser): void {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản của ${user.fullName}? Hành động này không thể hoàn tác.`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.cdr.markForCheck();
        },
        error: (err) => alert('Lỗi khi xóa người dùng: ' + err.message)
      });
    }
  }
}