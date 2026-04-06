import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  if (user && user.token && user.roles && user.roles.includes('ROLE_ADMIN')) {
    return true;
  }

  // Nếu không phải Admin, chuyển hướng về Home hoặc báo lỗi
  router.navigate(['/']);
  return false;
};
