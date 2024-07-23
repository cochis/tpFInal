import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Compra } from 'src/app/core/models/compra.model';
import { CargarCompra, CargarCompras } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ComprasService {

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

  cargarComprasAll() {
    const url = `${base_url}/compras/all`
    return this.http.get<CargarCompras>(url, this.headers).pipe(
      map((resp) => {
        const compras = resp.compras.map(
          (compra) =>
            new Compra(
              compra.usuario,
              compra.status,
              compra.paquete,
              compra.cantidadFiestas,
              compra.costo,
              compra.iva,
              compra.paypalData,
              compra.usuarioCreated,
              compra.activated,
              compra.dateCreated,
              compra.lastEdited,
              compra.uid,

            ),
        )
        return {
          total: compras.length,
          compras,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/compras?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCompras>(url, this.headers).pipe(
      map((resp) => {
        const compras = resp.compras.map(
          (compra) =>
            new Compra(
              compra.usuario,
              compra.status,
              compra.paquete,
              compra.cantidadFiestas,
              compra.costo,
              compra.iva,
              compra.paypalData,
              compra.usuarioCreated,
              compra.activated,
              compra.dateCreated,
              compra.lastEdited,
              compra.uid,
            ),
        )
        return {
          total: compras.length,
          compras,
        }
      }),
    )
  }
  crearCompra(formData: Compra) {

    return this.http.post(`${base_url}/compras`, formData, this.headers)
  }


  isActivedCompra(compra: Compra) {
    const url = `${base_url}/compras/isActive/${compra.uid}`
    const data = {
      ...compra,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCompra(compra: Compra) {
    const url = `${base_url}/compras/${compra.uid}`
    const data = {
      ...compra,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCompraById(id: string) {
    const url = `${base_url}/compras/${id}`
    return this.http.get<CargarCompra>(url, this.headers)
  }
  cargarComprasByEmail(email: string) {
    const url = `${base_url}/compras/email/${email}`
    return this.http.get<CargarCompras>(url, this.headers)
  }
}
