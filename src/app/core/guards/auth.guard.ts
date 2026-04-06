import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lấy user hiện tại từ AuthService
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return true;
  }

  // Nếu chưa đăng nhập, chuyển hướng sang Login
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
