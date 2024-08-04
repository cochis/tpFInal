import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTipoCentros, CargarTipoCentro } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { TipoCentro } from 'src/app/core/models/tipoCentro.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoCentrosService {

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

  cargarTipoCentrosInit() {
    const url = `${base_url}/tipo-centros/all`
    return this.http.get<CargarTipoCentros>(url, this.headers).pipe(
      map((resp) => {
        const tipoCentros = resp.tipoCentros.map(
          (tipoCentro) =>
            new TipoCentro(
              tipoCentro.nombre,
              tipoCentro.clave,
              tipoCentro.descripcion,
              tipoCentro.activated,
              tipoCentro.usuarioCreated,
              tipoCentro.dateCreated,
              tipoCentro.lastEdited,
              tipoCentro.uid,

            ),
        )
        return {
          total: tipoCentros.length,
          tipoCentros,
        }
      }),
    )
  }
  cargarTipoCentrosAll() {
    const url = `${base_url}/tipo-centros/all`
    return this.http.get<CargarTipoCentros>(url, this.headers).pipe(
      map((resp) => {
        const tipoCentros = resp.tipoCentros.map(
          (tipoCentro) =>
            new TipoCentro(
              tipoCentro.nombre,
              tipoCentro.clave,
              tipoCentro.descripcion,
              tipoCentro.activated,
              tipoCentro.usuarioCreated,
              tipoCentro.dateCreated,
              tipoCentro.lastEdited,
              tipoCentro.uid,

            ),
        )
        return {
          total: tipoCentros.length,
          tipoCentros,
        }
      }),
    )
  }
  cargarTipoCentrosSalon() {
    const url = `${base_url}/tipo-centros/all/salon`
    return this.http.get<CargarTipoCentros>(url, this.headers).pipe(
      map((resp) => {
        const tipoCentros = resp.tipoCentros.map(
          (tipoCentro) =>
            new TipoCentro(
              tipoCentro.nombre,
              tipoCentro.clave,
              tipoCentro.descripcion,
              tipoCentro.activated,
              tipoCentro.usuarioCreated,
              tipoCentro.dateCreated,
              tipoCentro.lastEdited,
              tipoCentro.uid,

            ),
        )
        return {
          total: tipoCentros.length,
          tipoCentros,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoCentros>(url, this.headers).pipe(
      map((resp) => {
        const tipoCentros = resp.tipoCentros.map(
          (tipoCentro) =>
            new TipoCentro(
              tipoCentro.nombre,
              tipoCentro.clave,
              tipoCentro.descripcion,
              tipoCentro.usuarioCreated,
              tipoCentro.activated,
              tipoCentro.dateCreated,
              tipoCentro.lastEdited,
              tipoCentro.uid,
            ),
        )
        return {
          total: tipoCentros.length,
          tipoCentros,
        }
      }),
    )
  }
  crearTipoCentro(formData: TipoCentro) {
    return this.http.post(`${base_url}/tipo-centros`, formData, this.headers)
  }


  isActivedTipoCentro(tipoCentro: TipoCentro) {
    const url = `${base_url}/tipo-centros/isActive/${tipoCentro.uid}`
    const data = {
      ...tipoCentro,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoCentro(tipoCentro: TipoCentro) {
    const url = `${base_url}/tipo-centros/${tipoCentro.uid}`
    const data = {
      ...tipoCentro,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTipoCentroById(id: string) {
    const url = `${base_url}/tipo-centros/${id}`
    return this.http.get<CargarTipoCentro>(url, this.headers)
  }
  cargarTipoCentroByClave(clave: string) {
    const url = `${base_url}/tipo-centros/clave/${clave}`
    return this.http.get<CargarTipoCentro>(url, this.headers)
  }

}
