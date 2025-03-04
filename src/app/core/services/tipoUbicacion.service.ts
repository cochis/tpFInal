import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { TipoUbicacion } from 'src/app/core/models/tipoUbicacion.model';
import { CargarTipoUbicacion, CargarTipoUbicaciones } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoUbicacionesService {

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

  cargarTipoUbicacionesAll() {
    const url = `${base_url}/tipo-ubicaciones/all`
    return this.http.get<CargarTipoUbicaciones>(url, this.headers).pipe(
      map((resp) => {
        const tipoUbicaciones = resp.tipoUbicaciones.map(
          (tu) =>
            new TipoUbicacion(
              tu.nombre,
              tu.clave,
              tu.roles,
              tu.usuarioCreated,
              tu.activated,
              tu.dateCreated,
              tu.lastEdited,
              tu.uid,

            ),
        )
        return {
          total: tipoUbicaciones.length,
          tipoUbicaciones,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/tipo-ubicaciones?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoUbicaciones>(url, this.headers).pipe(
      map((resp) => {
        const tipoUbicaciones = resp.tipoUbicaciones.map(
          (tu) =>
            new TipoUbicacion(
              tu.nombre,
              tu.clave,
              tu.roles,
              tu.usuarioCreated,
              tu.activated,
              tu.dateCreated,
              tu.lastEdited,
              tu.uid,
            ),
        )
        return {
          total: tipoUbicaciones.length,
          tipoUbicaciones,
        }
      }),
    )
  }
  crearTipoUbicacion(formData: TipoUbicacion) {
    return this.http.post(`${base_url}/tipo-ubicaciones`, formData, this.headers)
  }


  isActivedTipoUbicacion(tipoUbicacion: TipoUbicacion) {
    const url = `${base_url}/tipo-ubicaciones/isActive/${tipoUbicacion.uid}`
    const data = {
      ...tipoUbicacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoUbicacion(tipoUbicacion: TipoUbicacion) {
    const url = `${base_url}/tipo-ubicaciones/${tipoUbicacion.uid}`
    const data = {
      ...tipoUbicacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoUbicacionById(id: string) {
    const url = `${base_url}/tipo-ubicaciones/${id}`
    return this.http.get<CargarTipoUbicacion>(url, this.headers)
  }
  cargarTipoUbicacionesByEmail(email: string) {
    const url = `${base_url}/tipo-ubicaciones/email/${email}`
    return this.http.get<CargarTipoUbicaciones>(url, this.headers)
  }
}
