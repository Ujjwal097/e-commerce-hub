import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAdmin()) {
    return true;
  }

  toastService.warning('Access denied: You must be signed in as a Store Administrator.', 'Admin Restricted');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url, role: 'admin' } });
  return false;
};
