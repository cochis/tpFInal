import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Parametro } from 'src/app/core/models/parametro.model';
import { CargarParametro, CargarParametros } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

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

  cargarParametrosAll() {
    const url = `${base_url}/parametros/all`
    return this.http.get<CargarParametros>(url, this.headers).pipe(
      map((resp) => {
        const parametros = resp.parametros.map(
          (par) =>
            new Parametro(
              par.nombre,
              par.type,
              par.value,
              par.clave,
              par.usuarioCreated,
              par.activated,
              par.dateCreated,
              par.lastEdited,
              par.uid,

            ),
        )
        return {
          total: parametros.length,
          parametros,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/parametros?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarParametros>(url, this.headers).pipe(
      map((resp) => {
        const parametros = resp.parametros.map(
          (par) =>
            new Parametro(
              par.nombre,
              par.type,
              par.value,
              par.clave,
              par.usuarioCreated,
              par.activated,
              par.dateCreated,
              par.lastEdited,
              par.uid,
            ),
        )
        return {
          total: parametros.length,
          parametros,
        }
      }),
    )
  }
  crearParametro(formData: Parametro) {
    return this.http.post(`${base_url}/parametros`, formData, this.headers)
  }


  isActivedParametro(parametro: Parametro) {
    const url = `${base_url}/parametros/isActive/${parametro.uid}`
    const data = {
      ...parametro,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarParametro(parametro: Parametro) {
    const url = `${base_url}/parametros/${parametro.uid}`
    const data = {
      ...parametro,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarParametroById(id: string) {
    const url = `${base_url}/parametros/${id}`
    return this.http.get<CargarParametro>(url, this.headers)
  }
  cargarParametrosByEmail(email: string) {
    const url = `${base_url}/parametros/email/${email}`
    return this.http.get<CargarParametros>(url, this.headers)
  }
}
