import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin-user.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class AdminUserListComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  
  users = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading.set(true);
    this.adminUserService.getAllUsers().subscribe({
      next: (res) => {
        this.users.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Lỗi khi tải danh sách người dùng: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  updateRole(userId: number, role: string) {
    if (confirm(`Bạn có chắc chắn muốn chuyển người dùng này sang vai trò: ${role}?`)) {
      this.adminUserService.updateUserRole(userId, role).subscribe({
        next: () => this.fetchUsers(),
        error: (err) => alert('Lỗi khi cập nhật vai trò: ' + err.message)
      });
    }
  }

  toggleStatus(userId: number) {
    this.adminUserService.toggleUserStatus(userId).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => alert('Lỗi khi cập nhật trạng thái: ' + err.message)
    });
  }

  getRoleBadgeClass(role: string) {
    switch (role) {
      case 'ADMIN': return 'bg-primary/10 text-primary border-primary/20';
      case 'STAFF': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-text-muted/10 text-text-muted border-text-muted/20';
    }
  }
}
