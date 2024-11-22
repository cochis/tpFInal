import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'jquery';
import { pipe, tap } from 'rxjs';
import { CargarRole } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { RolesService } from 'src/app/core/services/roles.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private functionsService: FunctionsService,
    private roleService: RolesService,

  ) { }
  get token(): string {
    return this.functionsService.getLocal('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  login(loginForm: any) {

    const url = `${base_url}/login`
    return this.http.post(url, loginForm).pipe(
      tap((resp: any) => {

        this.functionsService.setLocal('token', resp.token)
        this.functionsService.setLocal('uid', resp.uid)
        this.functionsService.setLocal('email', resp.email)

        this.roleService.cargarRoleById(resp.role).subscribe((res: CargarRole) => {

          this.functionsService.setLocal('role', res.role.clave)

        })
        // localStorage.setItem('token', resp.token)
      }),
    )
  }
  verificationEmail(email: string) {
    const url = `${base_url}/login/activated/${email}`
    return this.http.get(url).pipe(
      tap((resp: any) => {


      }),
    )
  }
  existEmail(email: string) {
    const url = `${base_url}/login/exist/${email}`
    return this.http.get(url).pipe(
      tap((resp: any) => {


      }),
    )
  }
  renewToken() {
    const uid = this.functionsService.getLocal('uid')
    const url = `${base_url}/login/renew/${uid}`
  

    return this.http.get(url)
  }


}
