import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Cotizacion } from 'src/app/core/models/cotizacion.model';
import { CargarCotizacion, CargarCotizaciones } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

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

  cargarCotizacionesAll() {
    const url = `${base_url}/cotizaciones/all`
    return this.http.get<CargarCotizaciones>(url, this.headers).pipe(
      map((resp) => {
        const cotizaciones = resp.cotizaciones.map(
          (ct) =>
            new Cotizacion(
              ct.nombreEvento,
              ct.nombreAnf,
              ct.apellidoPatAnf,
              ct.apellidoMatAnf,
              ct.emailAnf,
              ct.telfonoAnf,
              ct.direccion,
              ct.ubicacion,
              ct.fechaEvento,
              ct.lat,
              ct.lng,
              ct.isAnfitironFestejado,
              ct.nombreFes,
              ct.apellidoMatFes,
              ct.apellidoPatFes,
              ct.proveedor,
              ct.productos,
              ct.estatusCotizacion,
              ct.usuarioCreated,
              ct.activated,
              ct.dateCreated,
              ct.lastEdited,
              ct.uid,
            ),
        )
        return {
          total: cotizaciones.length,
          cotizaciones,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/cotizaciones?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCotizaciones>(url, this.headers).pipe(
      map((resp) => {
        const cotizaciones = resp.cotizaciones.map(
          (ct) =>
            new Cotizacion(
              ct.nombreEvento,
              ct.nombreAnf,
              ct.apellidoPatAnf,
              ct.apellidoMatAnf,
              ct.emailAnf,
              ct.telfonoAnf,
              ct.direccion,
              ct.ubicacion,
              ct.fechaEvento,
              ct.lat,
              ct.lng,
              ct.isAnfitironFestejado,
              ct.nombreFes,
              ct.apellidoMatFes,
              ct.apellidoPatFes,
              ct.proveedor,
              ct.productos,
              ct.estatusCotizacion,
              ct.usuarioCreated,
              ct.activated,
              ct.dateCreated,
              ct.lastEdited,
              ct.uid,


            ),
        )
        return {
          total: cotizaciones.length,
          cotizaciones,
        }
      }),
    )
  }
  crearCotizacion(formData: Cotizacion) {


    return this.http.post(`${base_url}/cotizaciones`, formData, this.headers)
  }


  isActivedCotizacion(cotizacion: Cotizacion) {
    const url = `${base_url}/cotizaciones/isActive/${cotizacion.uid}`
    const data = {
      ...cotizacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCotizacion(cotizacion: Cotizacion) {
    const url = `${base_url}/cotizaciones/${cotizacion.uid}`
    const data = {
      ...cotizacion,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCotizacionById(id: string) {
    const url = `${base_url}/cotizaciones/${id}`
    return this.http.get<CargarCotizacion>(url, this.headers)
  }
  cargarCotizacionesByEmail(email: string) {
    const url = `${base_url}/cotizaciones/email/${email}`
    return this.http.get<CargarCotizaciones>(url, this.headers)
  }
  cargarCotizacionesByProveedor(id: string) {
    const url = `${base_url}/cotizaciones/proveedor/${id}`
    return this.http.get<CargarCotizaciones>(url, this.headers)
  }
  cargarCotizacionesByCreador(id: string) {
    const url = `${base_url}/cotizaciones/creador/${id}`
    return this.http.get<CargarCotizaciones>(url, this.headers)
  }
}
