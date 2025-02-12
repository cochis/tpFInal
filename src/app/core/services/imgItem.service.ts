import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { ImgItem } from 'src/app/core/models/imgItem.model';
import { CargarImgItem, CargarImgItems } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ImgItemsService {

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

  cargarImgItemsAll() {
    const url = `${base_url}/img-items/all`

    return this.http.get<CargarImgItems>(url, this.headers).pipe(
      map((resp) => {


        const imgItems = resp.imgItems.map(
          (tc) =>
            new ImgItem(
              tc.nombre,
              tc.isPrincipal,
              tc.tipoMedio,
              tc.item,
              tc.img,
              tc.descripcion,
              tc.idx,
              tc.type,
              tc.usuarioCreated,
              tc.activated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,
            ),
        )

        return {
          total: imgItems.length,
          imgItems,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/img-items?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarImgItems>(url, this.headers).pipe(
      map((resp) => {
        const imgItems = resp.imgItems.map(
          (tc) =>
            new ImgItem(
              tc.nombre,
              tc.isPrincipal,
              tc.tipoMedio,
              tc.item,
              tc.img,
              tc.descripcion,
              tc.idx,
              tc.type,
              tc.usuarioCreated,
              tc.activated,
              tc.dateCreated,
              tc.lastEdited,
              tc.uid,




            ),
        )
        return {
          total: imgItems.length,
          imgItems,
        }
      }),
    )
  }
  crearImgItem(formData: any) {
    return this.http.post(`${base_url}/img-items`, formData, this.headers)
  }

  existByName(name: string) {
    const url = `${base_url}/img-items/by-name/${name}`
    return this.http.get(url, this.headers)
  }
  existByItem(item: string) {
    const url = `${base_url}/img-items/by-item/${item}`

    return this.http.get(url, this.headers)
  }
  existByImg(img: string) {
    const url = `${base_url}/img-items/by-img/${img}`
    return this.http.get(url, this.headers)
  }

  isActivedImgItem(imgItem: ImgItem) {
    const url = `${base_url}/img-items/isActive/${imgItem.uid}`
    const data = {
      ...imgItem,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarImgItem(imgItem: ImgItem) {
    const url = `${base_url}/img-items/${imgItem.uid}`

    const data = {
      ...imgItem,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarImgItemById(id: string) {
    const url = `${base_url}/img-items/${id}`
    return this.http.get<CargarImgItem>(url, this.headers)
  }
  cargarImgItemsByEmail(email: string) {
    const url = `${base_url}/img-items/email/${email}`
    return this.http.get<CargarImgItems>(url, this.headers)
  }
}
