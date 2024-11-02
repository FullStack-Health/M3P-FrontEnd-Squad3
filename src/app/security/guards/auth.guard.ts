import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  const isAuthenticated = authService.isLoggedIn(); 

  if (!isAuthenticated) {
    router.navigate(['']); 
    return false;
  }

  const userRole = authService.getUserRole();
  const currentRoute = route.routeConfig?.path;

  if (userRole === 'SCOPE_PACIENTE') {
    if (currentRoute !== 'prontuario/:id') {
      router.navigate(['/prontuario', authService.getPatientId()]);
      return false;
    }
  }

  if (userRole === 'SCOPE_MEDICO') {
    if (currentRoute === 'lista-usuarios' || currentRoute?.startsWith('editar-usuario')) {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true; 
};