import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Calificacion } from 'src/app/core/models/calificacion.model';
import { CargarCalificacion, CargarCalificaciones } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {

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

  cargarCalificacionesAll() {
    const url = `${base_url}/calificaciones/all`
    return this.http.get<CargarCalificaciones>(url, this.headers).pipe(
      map((resp) => {
        const calificaciones = resp.calificaciones.map(
          (cal) =>
            new Calificacion(
              cal.cotizacion,
              cal.calificacionPlat,
              cal.comentarios,
              cal.productos,
              cal.usuarioCreated,
              cal.activated,
              cal.dateCreated,
              cal.lastEdited,
              cal.uid,

            ),
        )
        return {
          total: calificaciones.length,
          calificaciones,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/calificaciones?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCalificaciones>(url, this.headers).pipe(
      map((resp) => {
        const calificaciones = resp.calificaciones.map(
          (cal) =>
            new Calificacion(
              cal.cotizacion,
              cal.calificacionPlat,
              cal.comentarios,
              cal.productos,
              cal.usuarioCreated,
              cal.activated,
              cal.dateCreated,
              cal.lastEdited,
              cal.uid,
            ),
        )
        return {
          total: calificaciones.length,
          calificaciones,
        }
      }),
    )
  }
  crearCalificacion(formData: Calificacion) {
    return this.http.post(`${base_url}/calificaciones`, formData, this.headers)
  }


  isActivedCalificacion(calificacion: Calificacion) {
    const url = `${base_url}/calificaciones/isActive/${calificacion.uid}`
    const data = {
      ...calificacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCalificacion(calificacion: Calificacion) {
    const url = `${base_url}/calificaciones/${calificacion.uid}`
    const data = {
      ...calificacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCalificacionById(id: string) {
    const url = `${base_url}/calificaciones/${id}`
    return this.http.get<CargarCalificacion>(url, this.headers)
  }
  cargarCalificacionesByEmail(email: string) {
    const url = `${base_url}/calificaciones/email/${email}`
    return this.http.get<CargarCalificaciones>(url, this.headers)
  }
  cargarCalificacionesByCotizacion(id: string) {
    const url = `${base_url}/calificaciones/cotizacion/${id}`
    return this.http.get<CargarCalificaciones>(url, this.headers)
  }
}
