import { Injectable, inject } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { FunctionsService } from '../shared/services/functions.service'


@Injectable()
export class UnauthorizedInterceptorService implements HttpInterceptor {
  constructor(private functionService: FunctionsService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const funtionsService = inject(FunctionsService)
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.error.msg === 'Token no válido') {
          funtionsService.alert('Token', 'Se ha cerrado la sesión', 'error')
          this.functionService.logout()
        }
        const error = err.error?.message || err.statusText
        return next.handle(request)
      }),
    )
  }
}
