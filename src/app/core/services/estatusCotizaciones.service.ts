import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { EstatusCotizacion } from 'src/app/core/models/estatusCotizacion.model';
import { CargarEstatusCotizacion, CargarEstatusCotizaciones } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EstatusCotizacionesService {

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

  cargarEstatusCotizacionesAll() {
    const url = `${base_url}/estatus-cotizaciones/all`
    return this.http.get<CargarEstatusCotizaciones>(url, this.headers).pipe(
      map((resp) => {
        const estatusCotizaciones = resp.estatusCotizaciones.map(
          (ct) =>
            new EstatusCotizacion(
              ct.nombre,
              ct.clave,
              ct.step,
              ct.usuarioCreated,
              ct.activated,
              ct.dateCreated,
              ct.lastEdited,
              ct.uid,

            ),
        )
        return {
          total: estatusCotizaciones.length,
          estatusCotizaciones,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/estatus-cotizaciones?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarEstatusCotizaciones>(url, this.headers).pipe(
      map((resp) => {
        const estatusCotizaciones = resp.estatusCotizaciones.map(
          (ct) =>
            new EstatusCotizacion(
              ct.nombre,
              ct.clave,
              ct.step,
              ct.usuarioCreated,
              ct.activated,
              ct.dateCreated,
              ct.lastEdited,
              ct.uid,
            ),
        )
        return {
          total: estatusCotizaciones.length,
          estatusCotizaciones,
        }
      }),
    )
  }
  crearEstatusCotizacion(formData: EstatusCotizacion) {
    return this.http.post(`${base_url}/estatus-cotizaciones`, formData, this.headers)
  }


  isActivedEstatusCotizacion(estatusCotizacion: EstatusCotizacion) {
    const url = `${base_url}/estatus-cotizaciones/isActive/${estatusCotizacion.uid}`
    const data = {
      ...estatusCotizacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarEstatusCotizacion(estatusCotizacion: EstatusCotizacion) {
    const url = `${base_url}/estatus-cotizaciones/${estatusCotizacion.uid}`
    const data = {
      ...estatusCotizacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarEstatusCotizacionById(id: string) {
    const url = `${base_url}/estatus-cotizaciones/${id}`
    return this.http.get<CargarEstatusCotizacion>(url, this.headers)
  }
  cargarEstatusCotizacionesByEmail(email: string) {
    const url = `${base_url}/estatus-cotizaciones/email/${email}`
    return this.http.get<CargarEstatusCotizaciones>(url, this.headers)
  }
  cargarEstatusCotizacionesByStep(step: string) {
    const url = `${base_url}/estatus-cotizaciones/step/${step}`
    return this.http.get<CargarEstatusCotizaciones>(url, this.headers)
  }
}
