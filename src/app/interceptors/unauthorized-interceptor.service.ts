import { Injectable, inject } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { FunctionsService } from '../shared/services/functions.service'
import { LogsService } from '../core/services/logs.service'
import { AuthService } from '../auth/services/auth.service'


@Injectable()
export class UnauthorizedInterceptorService implements HttpInterceptor {
  constructor(
    private functionService: FunctionsService,
    private logsService: LogsService,
    private authService: AuthService

  ) { }

  uid = this.functionService.getLocal('uid')
  intercept(
    request: any,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const funtionsService = inject(FunctionsService)
    return next.handle(request).pipe(
      tap((event: any) => {
        if (!request.url.includes('api/logs') && request.method != 'GET') {
          if (event.body && !request.url.includes('log')) {
            let log = {
              url: request.url,
              method: request.method,
              queryParams: request.urlWithParams,
              request: request.body,
              response: event.body,
              statusCode: event.status,
              usuarioCreated: this.uid ? this.uid : undefined,
              dateCreated: this.functionService.getToday(),
              lastEdited: this.functionService.getToday(),
            }


            this.logsService.crearLog(log).subscribe((resp) => {

            })
          }
        }
      }),
      catchError((err) => {

        if (err.status == 401) {
          setTimeout(() => {

            funtionsService.alert('Alerta', 'Se cerro la sesión por inactividad', 'warning')
            this.functionService.logout()
            return next.handle(request)
          }, 200);


        }


        if (err && err.error.msg !== 'Error inesperado...  revisar logs') {
          funtionsService.alert('Error', 'Sucedió algo extraño', 'error')
          this.functionService.logout()

        }
        const error = err.error?.message || err.statusText
        return next.handle(request)
      },
      ),
    )
  }
}
