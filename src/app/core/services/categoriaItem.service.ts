import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';
import { CargarCategoriaItem, CargarCategoriaItems } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CategoriaItemsService {

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

  cargarCategoriaItemsAll() {
    const url = `${base_url}/categoria-item/all`

    return this.http.get<CargarCategoriaItems>(url, this.headers).pipe(
      map((resp) => {


        const categoriaItems = resp.categoriaItems.map(
          (tc) =>
            new CategoriaItem(
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
          total: categoriaItems.length,
          categoriaItems,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/categoria-item?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCategoriaItems>(url, this.headers).pipe(
      map((resp) => {
        const categoriaItems = resp.categoriaItems.map(
          (tc) =>
            new CategoriaItem(
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
          total: categoriaItems.length,
          categoriaItems,
        }
      }),
    )
  }
  crearCategoriaItem(formData: CategoriaItem) {
    return this.http.post(`${base_url}/categoria-item`, formData, this.headers)
  }


  isActivedCategoriaItem(categoriaItem: CategoriaItem) {
    const url = `${base_url}/categoria-item/isActive/${categoriaItem.uid}`
    const data = {
      ...categoriaItem,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCategoriaItem(categoriaItem: CategoriaItem) {
    const url = `${base_url}/categoria-item/${categoriaItem.uid}`
    const data = {
      ...categoriaItem,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCategoriaItemById(id: string) {
    const url = `${base_url}/categoria-item/${id}`
    return this.http.get<CargarCategoriaItem>(url, this.headers)
  }
  cargarCategoriaItemsByEmail(email: string) {
    const url = `${base_url}/categoria-item/email/${email}`
    return this.http.get<CargarCategoriaItems>(url, this.headers)
  }
}
