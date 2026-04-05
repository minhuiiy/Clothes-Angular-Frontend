import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
    return true;
  }
  
  router.navigate(['/']); // Redirect to home if not admin
  return false;
};
