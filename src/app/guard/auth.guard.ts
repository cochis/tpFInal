import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FunctionsService } from '../shared/services/functions.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const funtionsService = inject(FunctionsService)
  if (localStorage.getItem('token')) {
    return true;
  } else {
    funtionsService.alert('Ingresa', 'Favor de ingresar con tus credenciales', 'info')
    router.navigateByUrl('/auth/login')
    return false
  }
};
