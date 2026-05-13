import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth-service';
import { PlatformService } from './services/platform-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const ps = inject(PlatformService);
  const router = inject(Router);

  if (!ps.isBrowser()) {
    return true;
  }

  if (authService.getToken()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
