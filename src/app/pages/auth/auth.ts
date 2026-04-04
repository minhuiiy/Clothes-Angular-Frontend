import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  formData: any = {
    username: '',
    password: '',
    email: '',
    fullName: ''
  };
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Nếu URL là /auth/register thì chuyển mode
    if (this.router.url === '/auth/register') {
      this.isLoginMode = false;
    }
    
    // Nếu User đã login thì không cho vào đây
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
  }

  switchMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.authService.login({ username: this.formData.username, password: this.formData.password }).subscribe({
        next: (res) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = 'Sai tên đăng nhập hoặc mật khẩu!';
        }
      });
    } else {
      this.authService.register(this.formData).subscribe({
        next: (res) => {
          this.successMessage = 'Đăng ký thành công! Đang chuyển sang màn đăng nhập...';
          setTimeout(() => {
            this.switchMode(true);
            this.formData.password = '';
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.';
        }
      });
    }
  }
}
