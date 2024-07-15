import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarGrupos, CargarGrupo } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Grupo } from 'src/app/core/models/grupo.model';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class GruposService {

  constructor(private http: HttpClient,) { }
  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  cargarGruposAll() {
    const url = `${base_url}/grupos/all`
    return this.http.get<CargarGrupos>(url, this.headers).pipe(
      map((resp) => {

        const grupos = resp.grupos.map(
          (gpo) =>
            new Grupo(
              gpo.nombre,
              gpo.clave,
              gpo.activated,
              gpo.usuarioCreated,
              gpo.dateCreated,
              gpo.lastEdited,
              gpo.uid,

            ),
        )
        return {
          total: grupos.length,
          grupos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/grupos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarGrupos>(url, this.headers).pipe(
      map((resp) => {
        const grupos = resp.grupos.map(
          (gpo) =>
            new Grupo(
              gpo.nombre,
              gpo.clave,
              gpo.activated,
              gpo.usuarioCreated,
              gpo.dateCreated,
              gpo.lastEdited,
              gpo.uid,
            ),
        )
        return {
          total: grupos.length,
          grupos,
        }
      }),
    )
  }
  crearGrupo(formData: Grupo) {
    return this.http.post(`${base_url}/grupos`, formData, this.headers)
  }


  isActivedGrupo(grupo: Grupo) {
    const url = `${base_url}/grupos/isActive/${grupo.uid}`
    const data = {
      ...grupo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarGrupo(grupo: Grupo) {
    const url = `${base_url}/grupos/${grupo.uid}`
    const data = {
      ...grupo,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarGrupoById(id: string) {
    const url = `${base_url}/grupos/${id}`
    return this.http.get<CargarGrupo>(url, this.headers)
  }
  cargarGruposByEmail(email: string) {
    const url = `${base_url}/grupos/email/${email}`
    return this.http.get<CargarGrupos>(url, this.headers)
  }

}
