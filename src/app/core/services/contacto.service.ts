import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarContactos, CargarContacto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Contacto } from 'src/app/core/models/contacto.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ContactosService {

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

  cargarContactosInit() {
    const url = `${base_url}/contactos/all`
    return this.http.get<CargarContactos>(url, this.headers).pipe(
      map((resp) => {
        const contactos = resp.contactos.map(
          (rol) =>
            new Contacto(
              rol.nombre,
              rol.email,
              rol.subject,
              rol.message,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: contactos.length,
          contactos,
        }
      }),
    )
  }
  cargarContactosAll() {
    const url = `${base_url}/contactos/all`
    return this.http.get<CargarContactos>(url, this.headers).pipe(
      map((resp) => {
        const contactos = resp.contactos.map(
          (rol) =>
            new Contacto(
              rol.nombre,
              rol.email,
              rol.subject,
              rol.message,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: contactos.length,
          contactos,
        }
      }),
    )
  }
  cargarContactosSalon() {
    const url = `${base_url}/contactos/all/salon`
    return this.http.get<CargarContactos>(url, this.headers).pipe(
      map((resp) => {
        const contactos = resp.contactos.map(
          (rol) =>
            new Contacto(
              rol.nombre,
              rol.email,
              rol.subject,
              rol.message,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: contactos.length,
          contactos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarContactos>(url, this.headers).pipe(
      map((resp) => {
        const contactos = resp.contactos.map(
          (rol) =>
            new Contacto(
              rol.nombre,
              rol.email,
              rol.subject,
              rol.message,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: contactos.length,
          contactos,
        }
      }),
    )
  }
  crearContacto(formData: Contacto) {
    return this.http.post(`${base_url}/contactos`, formData, this.headers)
  }
  sendContacto(form: any) {
    return this.http.post(`${base_url}/contactos/sendContacto`, form, this.headers)

  }


  isActivedContacto(contacto: Contacto) {
    const url = `${base_url}/contactos/isActive/${contacto.uid}`
    const data = {
      ...contacto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarContacto(contacto: Contacto) {
    const url = `${base_url}/contactos/${contacto.uid}`
    const data = {
      ...contacto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarContactoById(id: string) {
    const url = `${base_url}/contactos/${id}`
    return this.http.get<CargarContacto>(url, this.headers)
  }
  cargarContactoByClave(clave: string) {
    const url = `${base_url}/contactos/clave/${clave}`
    return this.http.get<CargarContacto>(url, this.headers)
  }

}
