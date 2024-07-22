import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarPushs, CargarPush } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Push } from 'src/app/core/models/push.model';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PushsService {

  constructor(private http: HttpClient,) { }
  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  cargarPushsAll() {
    const url = `${base_url}/pushes/all`
    return this.http.get<CargarPushs>(url, this.headers).pipe(
      map((resp) => {
        const pushs = resp.pushs.map(
          (ps) =>
            new Push(
              ps.endpoint,
              ps.expirationTime,
              ps.keys,
              ps.activated,
              ps.dateCreated,
              ps.lastEdited,
              ps.uid 

            ),
        )
        return {
          total: pushs.length,
          pushs,
        }
      }),
    )
  }

  crearPush(formData: any) {

    return this.http.post(`${base_url}/pushes`, formData, this.headers)
  }


  isActivedPush(push: Push) {
    const url = `${base_url}/pushes/isActive/${push.uid}`
    const data = {
      ...push,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPush(push: Push) {

    const url = `${base_url}/pushes/${push.uid}`

    const data = {
      ...push,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }

  cargarPushById(id: string) {
    const url = `${base_url}/pushes/${id}`
    return this.http.get<CargarPush>(url, this.headers)
  }
  cargarPushByMail(mail: string) {
    const url = `${base_url}/pushes/email/${mail}`
    return this.http.get<CargarPushs>(url, this.headers)
  }
  cargarPushByCreador(uid: string) {
    const url = `${base_url}/pushes/creador/${uid}`
    return this.http.get<CargarPushs>(url, this.headers)
  }

}
