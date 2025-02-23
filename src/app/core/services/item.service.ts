import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Item } from 'src/app/core/models/item.model';
import { CargarItem, CargarItems } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

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

  cargarItemsAll() {
    const url = `${base_url}/items/all`

    return this.http.get<CargarItems>(url, this.headers).pipe(
      map((resp) => {


        const items = resp.items.map(
          (tc) =>
            new Item(
              tc.nombre,
              tc.descripcion,
              tc.proveedor,
              tc.tipoItem,
              tc.categoriaItem,
              tc.isSelectedBy,
              tc.isBySize,
              tc.isByService,
              tc.isByColor,
              tc.isByCantidad,
              tc.sizes,
              tc.colores,
              tc.photos,
              tc.servicios,
              tc.cantidades,
              tc.idealTo,
              tc.calificacion,
              tc.timesCalificado,
              tc.promedioCalificacion,
              tc.usuarioCreated,
              tc.activated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,
            ),
        )

        return {
          total: items.length,
          items,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/items?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarItems>(url, this.headers).pipe(
      map((resp) => {
        const items = resp.items.map(
          (tc) =>
            new Item(
              tc.nombre,
              tc.descripcion,
              tc.proveedor,
              tc.tipoItem,
              tc.categoriaItem,
              tc.isSelectedBy,
              tc.isBySize,
              tc.isByService,
              tc.isByColor,
              tc.isByCantidad,
              tc.sizes,
              tc.colores,
              tc.photos,
              tc.servicios,
              tc.cantidades,
              tc.idealTo,
              tc.calificacion,
              tc.timesCalificado,
              tc.promedioCalificacion,
              tc.usuarioCreated,
              tc.activated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,
            ),
        )
        return {
          total: items.length,
          items,
        }
      }),
    )
  }
  crearItem(formData: Item) {
    return this.http.post(`${base_url}/items`, formData, this.headers)
  }

  isActivedItem(item: Item) {
    const url = `${base_url}/items/isActive/${item.uid}`
    const data = {
      ...item,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarItem(item: Item) {
    const url = `${base_url}/items/${item.uid}`
    const data = {
      ...item,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  calificarItem(item: string, calificacion) {
    const url = `${base_url}/items/calificar/${item}/${calificacion}`
    const data = {
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarItemById(id: string) {
    const url = `${base_url}/items/${id}`
    return this.http.get<CargarItem>(url, this.headers)
  }
  cargarItemsByEmail(email: string) {
    const url = `${base_url}/items/email/${email}`
    return this.http.get<CargarItems>(url, this.headers)
  }
  cargarItemsByProovedor(proveedor: string) {
    const url = `${base_url}/items/proveedor/${proveedor}`
    return this.http.get<CargarItems>(url, this.headers)
  }
}
