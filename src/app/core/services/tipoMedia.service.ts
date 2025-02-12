import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { CargarTipoMedia, CargarTipoMedias } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoMediasService {

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

  cargarTipoMediasAll() {
    const url = `${base_url}/tipo-media/all`

    return this.http.get<CargarTipoMedias>(url, this.headers).pipe(
      map((resp) => {


        const tipoMedias = resp.tipoMedias.map(
          (tc) =>
            new TipoMedia(
              tc.nombre,
              tc.clave,
              tc.usuarioCreated,
              tc.activated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,

            ),
        )

        return {
          total: tipoMedias.length,
          tipoMedias,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/tipo-media?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoMedias>(url, this.headers).pipe(
      map((resp) => {
        const tipoMedias = resp.tipoMedias.map(
          (tc) =>
            new TipoMedia(
              tc.nombre,
              tc.clave,
              tc.usuarioCreated,
              tc.activated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,
            ),
        )
        return {
          total: tipoMedias.length,
          tipoMedias,
        }
      }),
    )
  }
  crearTipoMedia(formData: TipoMedia) {
    return this.http.post(`${base_url}/tipo-media`, formData, this.headers)
  }


  isActivedTipoMedia(tipoMedia: TipoMedia) {
    const url = `${base_url}/tipo-media/isActive/${tipoMedia.uid}`
    const data = {
      ...tipoMedia,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoMedia(tipoMedia: TipoMedia) {
    const url = `${base_url}/tipo-media/${tipoMedia.uid}`
    const data = {
      ...tipoMedia,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoMediaById(id: string) {
    const url = `${base_url}/tipo-media/${id}`
    return this.http.get<CargarTipoMedia>(url, this.headers)
  }
  cargarTipoMediasByEmail(email: string) {
    const url = `${base_url}/tipo-media/email/${email}`
    return this.http.get<CargarTipoMedias>(url, this.headers)
  }
}
