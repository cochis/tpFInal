import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Fondo } from 'src/app/core/models/fondo.model';
import { CargarFondo, CargarFondos } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FondosService {

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

  cargarFondosAll() {
    const url = `${base_url}/fondos/all`
    return this.http.get<CargarFondos>(url, this.headers).pipe(
      map((resp) => {
        const fondos = resp.fondos.map(
          (eve) =>
            new Fondo(
              eve.nombre,
              eve.tipo,
              eve.value,
              eve.img,
              eve.usuarioCreated,
              eve.activated,
              eve.dateCreated,
              eve.lastEdited,
              eve.uid,

            ),
        )
        return {
          total: fondos.length,
          fondos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/fondos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarFondos>(url, this.headers).pipe(
      map((resp) => {
        const fondos = resp.fondos.map(
          (rol) =>
            new Fondo(
              rol.nombre,
              rol.tipo,
              rol.value,
              rol.img,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: fondos.length,
          fondos,
        }
      }),
    )
  }
  crearFondo(formData: Fondo) {
    return this.http.post(`${base_url}/fondos`, formData, this.headers)
  }


  isActivedFondo(fondo: Fondo) {
    const url = `${base_url}/fondos/isActive/${fondo.uid}`
    const data = {
      ...fondo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarFondo(fondo: Fondo) {
    const url = `${base_url}/fondos/${fondo.uid}`
    const data = {
      ...fondo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarFondoById(id: string) {
    const url = `${base_url}/fondos/${id}`
    return this.http.get<CargarFondo>(url, this.headers)
  }
  cargarFondosByEmail(email: string) {
    const url = `${base_url}/fondos/email/${email}`
    return this.http.get<CargarFondos>(url, this.headers)
  }
}
