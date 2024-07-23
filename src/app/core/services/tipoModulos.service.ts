import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoModulos, CargarTipoModulo } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoModulosService {

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

  cargarTipoModulosInit() {
    const url = `${base_url}/tipoModulos/all`
    return this.http.get<CargarTipoModulos>(url, this.headers).pipe(
      map((resp) => {
        const tipoModulos = resp.tipoModulos.map(
          (tipoModulo) =>
            new TipoModulo(
              tipoModulo.nombre,
              tipoModulo.clave,
              tipoModulo.values,
              tipoModulo.usuarioCreated,
              tipoModulo.activated,
              tipoModulo.dateCreated,
              tipoModulo.lastEdited,
              tipoModulo.uid
            ),
        )
        return {
          total: tipoModulos.length,
          tipoModulos,
        }
      }),
    )
  }
  cargarTipoModulosAll() {
    const url = `${base_url}/tipoModulos/all`
    return this.http.get<CargarTipoModulos>(url, this.headers).pipe(
      map((resp) => {
        const tipoModulos = resp.tipoModulos.map(
          (tipoModulo) =>
            new TipoModulo(

              tipoModulo.nombre,
              tipoModulo.clave,
              tipoModulo.values,
              tipoModulo.usuarioCreated,
              tipoModulo.activated,
              tipoModulo.dateCreated,
              tipoModulo.lastEdited,
              tipoModulo.uid

            ),
        )
        return {
          total: tipoModulos.length,
          tipoModulos,
        }
      }),
    )
  }
  cargarTipoModulosSalon() {
    const url = `${base_url}/tipoModulos/all/salon`
    return this.http.get<CargarTipoModulos>(url, this.headers).pipe(
      map((resp) => {
        const tipoModulos = resp.tipoModulos.map(
          (tipoModulo) =>
            new TipoModulo(

              tipoModulo.nombre,
              tipoModulo.clave,
              tipoModulo.values,
              tipoModulo.usuarioCreated,
              tipoModulo.activated,
              tipoModulo.dateCreated,
              tipoModulo.lastEdited,
              tipoModulo.uid
            ),
        )
        return {
          total: tipoModulos.length,
          tipoModulos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoModulos>(url, this.headers).pipe(
      map((resp) => {
        const tipoModulos = resp.tipoModulos.map(
          (tipoModulo) =>
            new TipoModulo(

              tipoModulo.nombre,
              tipoModulo.clave,
              tipoModulo.values,
              tipoModulo.usuarioCreated,
              tipoModulo.activated,
              tipoModulo.dateCreated,
              tipoModulo.lastEdited,
              tipoModulo.uid
            ),
        )
        return {
          total: tipoModulos.length,
          tipoModulos,
        }
      }),
    )
  }
  crearTipoModulo(formData: TipoModulo) {
    return this.http.post(`${base_url}/tipoModulos`, formData, this.headers)
  }


  isActivedTipoModulo(tipoModulo: TipoModulo) {
    const url = `${base_url}/tipoModulos/isActive/${tipoModulo.uid}`
    const data = {
      ...tipoModulo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoModulo(tipoModulo: TipoModulo) {
    const url = `${base_url}/tipoModulos/${tipoModulo.uid}`
    const data = {
      ...tipoModulo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoModuloById(id: string) {
    const url = `${base_url}/tipoModulos/${id}`
    return this.http.get<CargarTipoModulo>(url, this.headers)
  }
  cargarTipoModuloByClave(clave: string) {
    const url = `${base_url}/tipoModulos/clave/${clave}`
    return this.http.get<CargarTipoModulo>(url, this.headers)
  }

}
