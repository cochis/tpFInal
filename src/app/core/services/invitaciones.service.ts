import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarInvitacions, CargarInvitacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Invitacion } from 'src/app/core/models/invitacion.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class InvitacionsService {

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

  cargarInvitacionsInit() {
    const url = `${base_url}/invitacions/all`
    return this.http.get<CargarInvitacions>(url, this.headers).pipe(
      map((resp) => {
        const invitacions = resp.invitacions.map(
          (invitacion) =>
            new Invitacion(

              invitacion.fiesta,
              invitacion.data,
              invitacion.tipoTemplate,
              invitacion.usuarioFiesta,
              invitacion.templateActivate,
              invitacion.usuarioCreated,
              invitacion.activated,
              invitacion.dateCreated,
              invitacion.lastEdited,
              invitacion.uid,

            ),
        )
        return {
          total: invitacions.length,
          invitacions,
        }
      }),
    )
  }
  cargarInvitacionsAll() {
    const url = `${base_url}/invitacions/all`
    return this.http.get<CargarInvitacions>(url, this.headers).pipe(
      map((resp) => {
        const invitacions = resp.invitacions.map(
          (invitacion) =>
            new Invitacion(
              invitacion.fiesta,
              invitacion.data,
              invitacion.tipoTemplate,
              invitacion.usuarioFiesta,
              invitacion.templateActivate,
              invitacion.usuarioCreated,
              invitacion.activated,
              invitacion.dateCreated,
              invitacion.lastEdited,
              invitacion.uid,
            ),
        )
        return {
          total: invitacions.length,
          invitacions,
        }
      }),
    )
  }
  cargarInvitacionsSalon() {
    const url = `${base_url}/invitacions/all/salon`
    return this.http.get<CargarInvitacions>(url, this.headers).pipe(
      map((resp) => {
        const invitacions = resp.invitacions.map(
          (invitacion) =>
            new Invitacion(
              invitacion.fiesta,
              invitacion.data,
              invitacion.tipoTemplate,
              invitacion.usuarioFiesta,
              invitacion.templateActivate,
              invitacion.usuarioCreated,
              invitacion.activated,
              invitacion.dateCreated,
              invitacion.lastEdited,
              invitacion.uid,
            ),
        )
        return {
          total: invitacions.length,
          invitacions,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarInvitacions>(url, this.headers).pipe(
      map((resp) => {
        const invitacions = resp.invitacions.map(
          (invitacion) =>
            new Invitacion(
              invitacion.fiesta,
              invitacion.data,
              invitacion.tipoTemplate,
              invitacion.usuarioFiesta,
              invitacion.templateActivate,
              invitacion.usuarioCreated,
              invitacion.activated,
              invitacion.dateCreated,
              invitacion.lastEdited,
              invitacion.uid,
            ),
        )
        return {
          total: invitacions.length,
          invitacions,
        }
      }),
    )
  }
  crearInvitacion(formData: any) {
    return this.http.post(`${base_url}/invitacions`, formData, this.headers)
  }


  isActivedInvitacion(invitacion: Invitacion) {
    const url = `${base_url}/invitacions/isActive/${invitacion.uid}`
    const data = {
      ...invitacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarInvitacion(invitacion: Invitacion) {

    const url = `${base_url}/invitacions/${invitacion.uid}`
    const data = {
      ...invitacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarInvitacionById(id: string) {
    const url = `${base_url}/invitacions/${id}`
    return this.http.get<CargarInvitacion>(url, this.headers)
  }
  cargarInvitacionByFiesta(id: string) {
    const url = `${base_url}/invitacions/fiesta/${id}`
    return this.http.get<CargarInvitacion>(url, this.headers)
  }
  cargarInvitacionBySalon(id: string) {
    const url = `${base_url}/invitacions/salon/${id}`
    return this.http.get<CargarInvitacion>(url, this.headers)
  }
  cargarInvitacionByClave(clave: string) {
    const url = `${base_url}/invitacions/clave/${clave}`
    return this.http.get<CargarInvitacion>(url, this.headers)
  }

}
