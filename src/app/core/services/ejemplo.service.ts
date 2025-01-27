import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Ejemplo } from 'src/app/core/models/ejemplo.model';
import { CargarEjemplo, CargarEjemplos } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EjemplosService {

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

  cargarEjemplosAll() {
    const url = `${base_url}/ejemplos/all`
    return this.http.get<CargarEjemplos>(url, this.headers).pipe(
      map((resp) => {
        const ejemplos = resp.ejemplos.map(
          (eje) =>
            new Ejemplo(
              eje.nombre,
              eje.urlFiestaBoleto,
              eje.fiesta,
              eje.tipo,
              eje.recomendacion,
              eje.usuarioCreated,
              eje.activated,
              eje.dateCreated,
              eje.lastEdited,
              eje.uid,

            ),
        )
        return {
          total: ejemplos.length,
          ejemplos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/ejemplos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarEjemplos>(url, this.headers).pipe(
      map((resp) => {
        const ejemplos = resp.ejemplos.map(
          (eje) =>
            new Ejemplo(
              eje.nombre,
              eje.urlFiestaBoleto,
              eje.fiesta,
              eje.tipo,
              eje.recomendacion,
              eje.usuarioCreated,
              eje.activated,
              eje.dateCreated,
              eje.lastEdited,
              eje.uid,
            ),
        )
        return {
          total: ejemplos.length,
          ejemplos,
        }
      }),
    )
  }
  crearEjemplo(formData: Ejemplo) {
    return this.http.post(`${base_url}/ejemplos`, formData, this.headers)
  }


  isActivedEjemplo(ejemplo: Ejemplo) {
    const url = `${base_url}/ejemplos/isActive/${ejemplo.uid}`
    const data = {
      ...ejemplo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarEjemplo(ejemplo: Ejemplo) {
    const url = `${base_url}/ejemplos/${ejemplo.uid}`
    const data = {
      ...ejemplo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  cargarEjemploById(id: string) {
    const url = `${base_url}/ejemplos/${id}`
    return this.http.get<CargarEjemplo>(url, this.headers)
  }
  cargarEjemplosByEmail(email: string) {
    const url = `${base_url}/ejemplos/email/${email}`
    return this.http.get<CargarEjemplos>(url, this.headers)
  }
}
