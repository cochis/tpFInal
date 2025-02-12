import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { CargarTipoContacto, CargarTipoContactos } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoContactosService {

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

  cargarTipoContactosAll() {
    const url = `${base_url}/tipo-contacto/all`

    return this.http.get<CargarTipoContactos>(url, this.headers).pipe(
      map((resp) => {


        const tipoContactos = resp.tipoContactos.map(
          (tc) =>
            new TipoContacto(
              tc.nombre,
              tc.icon,
              tc.value,
              tc.descripcion,
              tc.activated,
              tc.usuarioCreated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,

            ),
        )

        return {
          total: tipoContactos.length,
          tipoContactos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/tipo-contacto?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoContactos>(url, this.headers).pipe(
      map((resp) => {
        const tipoContactos = resp.tipoContactos.map(
          (tc) =>
            new TipoContacto(
              tc.nombre,
              tc.icon,
              tc.value,
              tc.descripcion,
              tc.activated,
              tc.usuarioCreated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,
            ),
        )
        return {
          total: tipoContactos.length,
          tipoContactos,
        }
      }),
    )
  }
  crearTipoContacto(formData: TipoContacto) {
    return this.http.post(`${base_url}/tipo-contacto`, formData, this.headers)
  }


  isActivedTipoContacto(tipoContacto: TipoContacto) {
    const url = `${base_url}/tipo-contacto/isActive/${tipoContacto.uid}`
    const data = {
      ...tipoContacto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoContacto(tipoContacto: TipoContacto) {
    const url = `${base_url}/tipo-contacto/${tipoContacto.uid}`
    const data = {
      ...tipoContacto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoContactoById(id: string) {
    const url = `${base_url}/tipo-contacto/${id}`
    return this.http.get<CargarTipoContacto>(url, this.headers)
  }
  cargarTipoContactosByEmail(email: string) {
    const url = `${base_url}/tipo-contacto/email/${email}`
    return this.http.get<CargarTipoContactos>(url, this.headers)
  }
}
