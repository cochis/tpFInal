import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Red } from 'src/app/core/models/red.model';
import { CargarRed, CargarRedes } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class RedesService {

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

  cargarRedesAll() {
    const url = `${base_url}/redes/all`
    return this.http.get<CargarRedes>(url, this.headers).pipe(
      map((resp) => {
        const redes = resp.redes.map(
          (eve) =>
            new Red(
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
          total: redes.length,
          redes,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/redes?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarRedes>(url, this.headers).pipe(
      map((resp) => {
        const redes = resp.redes.map(
          (rol) =>
            new Red(
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
          total: redes.length,
          redes,
        }
      }),
    )
  }
  crearRed(formData: Red) {
    return this.http.post(`${base_url}/redes`, formData, this.headers)
  }


  isActivedRed(red: Red) {
    const url = `${base_url}/redes/isActive/${red.uid}`
    const data = {
      ...red,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarRed(red: Red) {
    const url = `${base_url}/redes/${red.uid}`
    const data = {
      ...red,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarRedById(id: string) {
    const url = `${base_url}/redes/${id}`
    return this.http.get<CargarRed>(url, this.headers)
  }
  cargarRedesByEmail(email: string) {
    const url = `${base_url}/redes/email/${email}`
    return this.http.get<CargarRedes>(url, this.headers)
  }
}
