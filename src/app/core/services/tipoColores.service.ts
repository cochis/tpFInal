import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { CargarTipoColor, CargarTipoColors } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoColorsService {

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

  cargarTipoColorsAll() {
    const url = `${base_url}/tipo-color/all`
    return this.http.get<CargarTipoColors>(url, this.headers).pipe(
      map((resp) => {

        const tipoColors = resp.tipoColors.map(
          (tc) =>
            new TipoColor(
              tc.nombre,
              tc.clave,
              tc.value,
              tc.activated,
              tc.usuarioCreated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,

            ),
        )
        return {
          total: tipoColors.length,
          tipoColors,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/tipo-color?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoColors>(url, this.headers).pipe(
      map((resp) => {
        const tipoColors = resp.tipoColors.map(
          (tc) =>
            new TipoColor(
              tc.nombre,
              tc.clave,
              tc.value,
              tc.activated,
              tc.usuarioCreated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,
            ),
        )
        return {
          total: tipoColors.length,
          tipoColors,
        }
      }),
    )
  }
  crearTipoColor(formData: TipoColor) {
    return this.http.post(`${base_url}/tipo-color`, formData, this.headers)
  }


  isActivedTipoColor(tipoColor: TipoColor) {
    const url = `${base_url}/tipo-color/isActive/${tipoColor.uid}`
    const data = {
      ...tipoColor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoColor(tipoColor: TipoColor) {
    const url = `${base_url}/tipo-color/${tipoColor.uid}`
    const data = {
      ...tipoColor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoColorById(id: string) {
    const url = `${base_url}/tipo-color/${id}`
    return this.http.get<CargarTipoColor>(url, this.headers)
  }
  cargarTipoColorsByEmail(email: string) {
    const url = `${base_url}/tipo-color/email/${email}`
    return this.http.get<CargarTipoColors>(url, this.headers)
  }
}
