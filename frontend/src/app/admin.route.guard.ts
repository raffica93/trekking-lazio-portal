import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  if (await auth.currentAdmin()) return true;

  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: state.url }
  });
};
