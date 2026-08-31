import { EnvironmentInjector, inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = async (_route, state) => {
  const environmentInjector = inject(EnvironmentInjector);
  const router = inject(Router);
  const { AdminAuthService } = await import('./admin-auth.service');
  const auth = environmentInjector.get(AdminAuthService);

  if (await auth.currentAdmin()) return true;

  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: state.url }
  });
};
