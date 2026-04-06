import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
})
export class AuthComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State using Signals
  isLoginMode = signal(true);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  
  formData = {
    username: '',
    password: '',
    email: '',
    fullName: ''
  };

  ngOnInit(): void {
    if (this.router.url.includes('/auth/register')) {
      this.isLoginMode.set(false);
    }
    
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
  }

  switchMode(isLogin: boolean) {
    this.isLoginMode.set(isLogin);
    this.errorMessage.set('');
    this.successMessage.set('');
    const targetUrl = isLogin ? '/auth/login' : '/auth/register';
    this.router.navigate([targetUrl]);
  }

  onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loading.set(true);

    if (this.isLoginMode()) {
      this.authService.login({ username: this.formData.username, password: this.formData.password }).subscribe({
        next: (response: any) => {
          const roles = response.roles || [];
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          }
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Sai tên đăng nhập hoặc mật khẩu!');
          this.loading.set(false);
        }
      });
    } else {
      this.authService.register(this.formData).subscribe({
        next: () => {
          this.successMessage.set('Đăng ký thành công! Đang chuyển sang màn đăng nhập...');
          this.loading.set(false);
          setTimeout(() => {
            this.switchMode(true);
            this.formData.password = '';
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.');
          this.loading.set(false);
        }
      });
    }
  }
}
