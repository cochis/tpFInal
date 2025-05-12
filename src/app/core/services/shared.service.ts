import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Shared } from 'src/app/core/models/shared.model';
import { CargarShared, CargarShareds } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class SharedsService {

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

  cargarSharedsAll() {
    const url = `${base_url}/shareds/all`
    return this.http.get<CargarShareds>(url, this.headers).pipe(
      map((resp) => {
        const shareds = resp.shareds.map(
          (shared) =>
            new Shared(
              shared.type,
              shared.boleto,
              shared.fiesta,
              shared.data,
              shared.compartidas,
              shared.vistas,
              shared.usuarioCreated,
              shared.activated,
              shared.dateCreated,
              shared.lastEdited,
              shared.uid,

            ),
        )
        return {
          total: shareds.length,
          shareds,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/shareds?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarShareds>(url, this.headers).pipe(
      map((resp) => {
        const shareds = resp.shareds.map(
          (shared) =>
            new Shared(
              shared.type,
              shared.boleto,
              shared.fiesta,
              shared.data,
              shared.compartidas,
              shared.vistas,
              shared.usuarioCreated,
              shared.activated,
              shared.dateCreated,
              shared.lastEdited,
              shared.uid,
            ),
        )
        return {
          total: shareds.length,
          shareds,
        }
      }),
    )
  }
  crearShared(formData: any) {
    return this.http.post(`${base_url}/shareds`, formData, this.headers)
  }


  isActivedShared(shared: Shared) {
    const url = `${base_url}/shareds/isActive/${shared.uid}`
    const data = {
      ...shared,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarShared(shared: Shared) {
    const url = `${base_url}/shareds/${shared.uid}`
    const data = {
      ...shared,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarSharedById(id: string) {
    const url = `${base_url}/shareds/${id}`
    return this.http.get<CargarShared>(url, this.headers)
  }
  cargarSharedsByEmail(email: string) {
    const url = `${base_url}/shareds/email/${email}`
    return this.http.get<CargarShareds>(url, this.headers)
  }
  cargarSharedsFiestaBoleto(fiesta: string, boleto: string) {
    const url = `${base_url}/shareds/fiesta-boleto/${fiesta}/${boleto}`

    return this.http.get<CargarShareds>(url, this.headers)
  }
}
