import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Pais } from 'src/app/core/models/pais.model';
import { CargarPais, CargarPaises } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PaisesService {

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

  cargarPaisesAll() {
    const url = `${base_url}/paises/all`

    return this.http.get<CargarPaises>(url, this.headers).pipe(
      map((resp) => {
        const paises = resp.paises.map(
          (eve) =>
            new Pais(
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
          total: paises.length,
          paises,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/paises?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarPaises>(url, this.headers).pipe(
      map((resp) => {
        const paises = resp.paises.map(
          (rol) =>
            new Pais(
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
          total: paises.length,
          paises,
        }
      }),
    )
  }
  crearPais(formData: Pais) {
    return this.http.post(`${base_url}/paises`, formData, this.headers)
  }


  isActivedPais(pais: Pais) {
    const url = `${base_url}/paises/isActive/${pais.uid}`
    const data = {
      ...pais,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPais(pais: Pais) {
    const url = `${base_url}/paises/${pais.uid}`
    const data = {
      ...pais,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarPaisById(id: string) {
    const url = `${base_url}/paises/${id}`
    return this.http.get<CargarPais>(url, this.headers)
  }
  cargarPaisesByEmail(email: string) {
    const url = `${base_url}/paises/email/${email}`
    return this.http.get<CargarPaises>(url, this.headers)
  }
}
