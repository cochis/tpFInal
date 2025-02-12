import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Moneda } from 'src/app/core/models/moneda.model';
import { CargarMoneda, CargarMonedas } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class MonedasService {

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

  cargarMonedasAll() {
    const url = `${base_url}/monedas/all`
    return this.http.get<CargarMonedas>(url, this.headers).pipe(
      map((resp) => {
        const monedas = resp.monedas.map(
          (eve) =>
            new Moneda(
              eve.nombre,
              eve.clave,
              eve.usuarioCreated,
              eve.activated,
              eve.dateCreated,
              eve.lastEdited,
              eve.uid,

            ),
        )
        return {
          total: monedas.length,
          monedas,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/monedas?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarMonedas>(url, this.headers).pipe(
      map((resp) => {
        const monedas = resp.monedas.map(
          (rol) =>
            new Moneda(
              rol.nombre,
              rol.clave,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: monedas.length,
          monedas,
        }
      }),
    )
  }
  crearMoneda(formData: Moneda) {
    return this.http.post(`${base_url}/monedas`, formData, this.headers)
  }


  isActivedMoneda(moneda: Moneda) {
    const url = `${base_url}/monedas/isActive/${moneda.uid}`
    const data = {
      ...moneda,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarMoneda(moneda: Moneda) {
    const url = `${base_url}/monedas/${moneda.uid}`
    const data = {
      ...moneda,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarMonedaById(id: string) {
    const url = `${base_url}/monedas/${id}`
    return this.http.get<CargarMoneda>(url, this.headers)
  }
  cargarMonedasByEmail(email: string) {
    const url = `${base_url}/monedas/email/${email}`
    return this.http.get<CargarMonedas>(url, this.headers)
  }
}
