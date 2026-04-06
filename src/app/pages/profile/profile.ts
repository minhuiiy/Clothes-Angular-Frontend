import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  activeTab = signal('info');
  user = signal<any>(null);
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  profileForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
  });

  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.http.get('http://localhost:8080/api/profile').subscribe({
      next: (data: any) => {
        this.user.set(data);
        this.profileForm.patchValue({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.loading.set(false);
      }
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    this.loading.set(true);
    this.http.put('http://localhost:8080/api/profile', this.profileForm.value).subscribe({
      next: (data: any) => {
        this.user.set(data);
        this.showSuccess('Cập nhật thông tin thành công!');
        this.loading.set(false);
      },
      error: (err) => {
        this.showError('Có lỗi xảy ra khi cập nhật.');
        this.loading.set(false);
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    this.loading.set(true);
    this.http.put('http://localhost:8080/api/profile/password', this.passwordForm.value).subscribe({
      next: () => {
        this.showSuccess('Đổi mật khẩu thành công!');
        this.passwordForm.reset();
        this.loading.set(false);
      },
      error: (err) => {
        this.showError(err.error || 'Mật khẩu cũ không chính xác.');
        this.loading.set(false);
      }
    });
  }

  passwordMatchValidator(g: any) {
    return g.get('newPassword').value === g.get('confirmPassword').value ? null : { mismatch: true };
  }

  showSuccess(msg: string) {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  showError(msg: string) {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(''), 3000);
  }
}
