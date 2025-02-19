import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Cp } from 'src/app/core/models/cp.model';
import { CargarCp, CargarCps } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CpsService {

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

  cargarCpsAll() {
    const url = `${base_url}/cps/all`
    return this.http.get<CargarCps>(url, this.headers).pipe(
      map((resp) => {
        const cps = resp.cps.map(
          (c) =>
            new Cp(
              c.d_codigo,
              c.d_asenta,
              c.d_tipo_asenta,
              c.D_mnpio,
              c.d_estado,
              c.d_ciudad,
              c.d_CP,
              c.c_estado,
              c.c_oficina,
              c.c_CP,
              c.c_tipo_asenta,
              c.c_mnpio,
              c.id_asenta_cpcons,
              c.d_zona,
              c.c_cve_ciudad,
              c.pais_clv,
              c.usuarioCreated,
              c.activated,
              c.dateCreated,
              c.lastEdited,
              c.uid,

            ),
        )
        return {
          total: cps.length,
          cps,
        }
      }),
    )
  }
  deleteCPS() {
    const url = `${base_url}/cps/delete`
    return this.http.get(url, this.headers)

  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/cps?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarCps>(url, this.headers).pipe(
      map((resp) => {
        const cps = resp.cps.map(
          (c) =>
            new Cp(
              c.d_codigo,
              c.d_asenta,
              c.d_tipo_asenta,
              c.D_mnpio,
              c.d_estado,
              c.d_ciudad,
              c.d_CP,
              c.c_estado,
              c.c_oficina,
              c.c_CP,
              c.c_tipo_asenta,
              c.c_mnpio,
              c.id_asenta_cpcons,
              c.d_zona,
              c.c_cve_ciudad,
              c.pais_clv,
              c.usuarioCreated,
              c.activated,
              c.dateCreated,
              c.lastEdited,
              c.uid,
            ),
        )
        return {
          total: cps.length,
          cps,
        }
      }),
    )
  }
  crearCp(formData: Cp) {

    let url = `${base_url}/cps`

    return this.http.post(url, formData, this.headers)
  }


  isActivedCp(cp: Cp) {
    const url = `${base_url}/cps/isActive/${cp.uid}`
    const data = {
      ...cp,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarCp(cp: Cp) {
    const url = `${base_url}/cps/${cp.uid}`
    const data = {
      ...cp,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarCpById(id: string) {
    const url = `${base_url}/cps/${id}`
    return this.http.get<CargarCp>(url, this.headers)
  }
  cargarCpByCP(cp: string) {
    const url = `${base_url}/cps/cp/${cp}`
    return this.http.get<CargarCps>(url, this.headers)
  }
  cargarCpByPaisCP(pais: string, cp: string) {
    const url = `${base_url}/cps/pais/${pais}/cp/${cp}`

    return this.http.get<CargarCps>(url, this.headers)
  }
  cargarCpsByEmail(email: string) {
    const url = `${base_url}/cps/email/${email}`
    return this.http.get<CargarCps>(url, this.headers)
  }
}
