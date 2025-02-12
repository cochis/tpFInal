import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { TipoItem } from 'src/app/core/models/tipoItem.model';
import { CargarTipoItem, CargarTipoItems } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoItemsService {

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

  cargarTipoItemsAll() {
    const url = `${base_url}/tipo-item/all`

    return this.http.get<CargarTipoItems>(url, this.headers).pipe(
      map((resp) => {


        const tipoItems = resp.tipoItems.map(
          (tc) =>
            new TipoItem(
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
          total: tipoItems.length,
          tipoItems,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/tipo-item?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoItems>(url, this.headers).pipe(
      map((resp) => {
        const tipoItems = resp.tipoItems.map(
          (tc) =>
            new TipoItem(
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
          total: tipoItems.length,
          tipoItems,
        }
      }),
    )
  }
  crearTipoItem(formData: TipoItem) {
    return this.http.post(`${base_url}/tipo-item`, formData, this.headers)
  }


  isActivedTipoItem(tipoItem: TipoItem) {
    const url = `${base_url}/tipo-item/isActive/${tipoItem.uid}`
    const data = {
      ...tipoItem,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoItem(tipoItem: TipoItem) {
    const url = `${base_url}/tipo-item/${tipoItem.uid}`
    const data = {
      ...tipoItem,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoItemById(id: string) {
    const url = `${base_url}/tipo-item/${id}`
    return this.http.get<CargarTipoItem>(url, this.headers)
  }
  cargarTipoItemsByEmail(email: string) {
    const url = `${base_url}/tipo-item/email/${email}`
    return this.http.get<CargarTipoItems>(url, this.headers)
  }
}
