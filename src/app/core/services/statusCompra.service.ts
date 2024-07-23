import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { StatusCompra } from 'src/app/core/models/statusCompra.model';
import { CargarStatusCompra, CargarStatusCompras } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class StatusComprasService {

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

  cargarStatusComprasAll() {
    const url = `${base_url}/status-compras/all`
    return this.http.get<CargarStatusCompras>(url, this.headers).pipe(
      map((resp) => {
        const statusCompras = resp.statusCompras.map(
          (eve) =>
            new StatusCompra(
              eve.nombre,
              eve.clave,
              eve.step,
              eve.usuarioCreated,
              eve.activated,
              eve.dateCreated,
              eve.lastEdited,
              eve.uid,

            ),
        )
        return {
          total: statusCompras.length,
          statusCompras,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/status-compras?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarStatusCompras>(url, this.headers).pipe(
      map((resp) => {
        const statusCompras = resp.statusCompras.map(
          (rol) =>
            new StatusCompra(
              rol.nombre,
              rol.clave,
              rol.step,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: statusCompras.length,
          statusCompras,
        }
      }),
    )
  }
  crearStatusCompra(formData: StatusCompra) {
    return this.http.post(`${base_url}/status-compras`, formData, this.headers)
  }


  isActivedStatusCompra(statusCompra: StatusCompra) {
    const url = `${base_url}/status-compras/isActive/${statusCompra.uid}`
    const data = {
      ...statusCompra,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarStatusCompra(statusCompra: StatusCompra) {
    const url = `${base_url}/status-compras/${statusCompra.uid}`
    const data = {
      ...statusCompra,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarStatusCompraById(id: string) {
    const url = `${base_url}/status-compras/${id}`
    return this.http.get<CargarStatusCompra>(url, this.headers)
  }
  cargarStatusCompraByClave(clave: string) {
    const url = `${base_url}/status-compras/clave/${clave}`
    return this.http.get<CargarStatusCompra>(url, this.headers)
  }
  cargarStatusCompraByStep(step: number) {
    const url = `${base_url}/status-compras/step/${step}`
    return this.http.get<CargarStatusCompra>(url, this.headers)
  }
  cargarStatusComprasByEmail(email: string) {
    const url = `${base_url}/status-compras/email/${email}`
    return this.http.get<CargarStatusCompras>(url, this.headers)
  }
}
