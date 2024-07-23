import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTokenPushs, CargarTokenPush } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TokenPush } from 'src/app/core/models/tokenPush.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TokenPushsService {

  constructor(private http: HttpClient, private functionsService: FunctionsService,) { }
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

  cargarTokenPushsAll() {
    const url = `${base_url}/tokenPushs/all`
    return this.http.get<CargarTokenPushs>(url, this.headers).pipe(
      map((resp) => {
        const tokenPushs = resp.tokenPushs.map(
          (tokenPush) =>
            new TokenPush(
              tokenPush.tokenPush,
              tokenPush.fiesta,
              tokenPush.activated,
              tokenPush.dateCreated,
              tokenPush.lastEdited,
              tokenPush.usuarioCreated,
              tokenPush.uid,

            ),
        )
        return {
          total: tokenPushs.length,
          tokenPushs,
        }
      }),
    )
  }

  crearTokenPush(formData: TokenPush) {
    return this.http.post(`${base_url}/tokenPushs`, formData, this.headers)
  }


  isActivedTokenPush(tokenPush: TokenPush) {
    const url = `${base_url}/tokenPushs/isActive/${tokenPush.uid}`
    const data = {
      ...tokenPush,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTokenPush(tokenPush: TokenPush) {
    const url = `${base_url}/tokenPushs/${tokenPush.uid}`
    const data = {
      ...tokenPush,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTokenPushById(id: string) {
    const url = `${base_url}/tokenPushs/${id}`
    return this.http.get<CargarTokenPush>(url, this.headers)
  }

  cargarTokenPushsByEmail(email: string) {
    const url = `${base_url}/tokenPushs/email/${email}`
    return this.http.get<CargarTokenPushs>(url, this.headers)
  }
  cargarTokenPushsByanfitrion(uid: string) {
    const url = `${base_url}/tokenPushs/anfitrion/${uid}`
    return this.http.get<CargarTokenPushs>(url, this.headers)
  }
  cargarTokenPushsBySalon(uid: string) {
    const url = `${base_url}/tokenPushs/salon/${uid}`
    return this.http.get<CargarTokenPushs>(url, this.headers)
  }
  sendTokenPushsByBoleto(uid: string, data) {


    const url = `${base_url}/tokenPush/boleto/${uid}`
    return this.http.post<CargarTokenPushs>(url, data, this.headers)
  }
}
