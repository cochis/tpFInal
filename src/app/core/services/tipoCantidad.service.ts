import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';
import { CargarTipoCantidad, CargarTipoCantidades } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TipoCantidadesService {

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

  cargarTipoCantidadesAll() {
    const url = `${base_url}/tipo-cantidades/all`
    return this.http.get<CargarTipoCantidades>(url, this.headers).pipe(
      map((resp) => {
        const tipoCantidades = resp.tipoCantidades.map(
          (tipoCantidad) =>
            new TipoCantidad(
              tipoCantidad.nombre,
              tipoCantidad.tipo,
              tipoCantidad.clave,
              tipoCantidad.value,
              tipoCantidad.costo,
              tipoCantidad.descripcion,
              tipoCantidad.usuarioCreated,
              tipoCantidad.activated,
              tipoCantidad.dateCreated,
              tipoCantidad.lastEdited,
              tipoCantidad.uid,

            ),
        )
        return {
          total: tipoCantidades.length,
          tipoCantidades,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/tipo-cantidades?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTipoCantidades>(url, this.headers).pipe(
      map((resp) => {
        const tipoCantidades = resp.tipoCantidades.map(
          (tipoCantidad) =>
            new TipoCantidad(
              tipoCantidad.nombre,
              tipoCantidad.tipo,
              tipoCantidad.clave,
              tipoCantidad.value,
              tipoCantidad.costo,
              tipoCantidad.descripcion,
              tipoCantidad.usuarioCreated,
              tipoCantidad.activated,
              tipoCantidad.dateCreated,
              tipoCantidad.lastEdited,
              tipoCantidad.uid,
            ),
        )
        return {
          total: tipoCantidades.length,
          tipoCantidades,
        }
      }),
    )
  }
  crearTipoCantidad(formData: TipoCantidad) {
    // console.log('formData::: ', formData);
    return this.http.post(`${base_url}/tipo-cantidades`, formData, this.headers)
  }


  isActivedTipoCantidad(tipoCantidad: TipoCantidad) {
    const url = `${base_url}/tipo-cantidades/isActive/${tipoCantidad.uid}`
    const data = {
      ...tipoCantidad,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTipoCantidad(tipoCantidad: TipoCantidad) {
    const url = `${base_url}/tipo-cantidades/${tipoCantidad.uid}`
    const data = {
      ...tipoCantidad,
      lastEdited: Date.now(),
    }
    // console.log('data::: ', data);
    return this.http.put(url, data, this.headers)
  }

  cargarTipoCantidadById(id: string) {
    const url = `${base_url}/tipo-cantidades/${id}`
    return this.http.get<CargarTipoCantidad>(url, this.headers)
  }
  cargarTipoCantidadByClave(clave: string) {
    const url = `${base_url}/tipo-cantidades/clave/${clave}`
    return this.http.get<CargarTipoCantidad>(url, this.headers)
  }
  cargarTipoCantidadesByEmail(email: string) {
    const url = `${base_url}/tipo-cantidades/email/${email}`
    return this.http.get<CargarTipoCantidades>(url, this.headers)
  }
}
