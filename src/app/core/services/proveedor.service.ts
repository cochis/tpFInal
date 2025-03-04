import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { CargarProveedor, CargarProveedors } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProveedorsService {

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

  cargarProveedorsAll() {
    const url = `${base_url}/proveedors/all`
    return this.http.get<CargarProveedors>(url, this.headers).pipe(
      map((resp) => {
        const proveedors = resp.proveedors.map(
          (pro) =>
            new Proveedor(
              pro.nombre,
              pro.clave,
              pro.bannerImg,
              pro.img,
              pro.calificacion,
              pro.descripcion,
              pro.contactos,
              pro.colores,
              pro.ubicacion,
              pro.lng,
              pro.lat,
              pro.envios,
              pro.descripcionEnvios,
              pro.ubicaciones,
              pro.usuarioCreated,
              pro.activated,
              pro.dateCreated,
              pro.lastEdited,
              pro.uid

            ),
        )
        return {
          total: proveedors.length,
          proveedors,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/proveedors?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarProveedors>(url, this.headers).pipe(
      map((resp) => {
        const proveedors = resp.proveedors.map(
          (pro) =>
            new Proveedor(
              pro.nombre,
              pro.clave,
              pro.bannerImg,
              pro.img,
              pro.calificacion,
              pro.descripcion,
              pro.contactos,
              pro.colores,
              pro.ubicacion,
              pro.lng,
              pro.lat,
              pro.envios,
              pro.descripcionEnvios,
              pro.ubicaciones,
              pro.usuarioCreated,
              pro.activated,
              pro.dateCreated,
              pro.lastEdited,
              pro.uid

            ),
        )
        return {
          total: proveedors.length,
          proveedors,
        }
      }),
    )
  }
  crearProveedor(formData: Proveedor) {
    return this.http.post(`${base_url}/proveedors`, formData, this.headers)
  }


  isActivedProveedor(proveedor: Proveedor) {
    const url = `${base_url}/proveedors/isActive/${proveedor.uid}`
    const data = {
      ...proveedor,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarProveedor(proveedor: Proveedor) {
    const url = `${base_url}/proveedors/${proveedor.uid}`
    const data = {
      ...proveedor,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }

  cargarProveedorById(id: string) {
    const url = `${base_url}/proveedors/${id}`
    return this.http.get<CargarProveedor>(url, this.headers)
  }
  cargarProveedorsByEmail(email: string) {
    const url = `${base_url}/proveedors/email/${email}`
    return this.http.get<CargarProveedors>(url, this.headers)
  }
  cargarProveedorsByCreador(id: string) {
    const url = `${base_url}/proveedors/creador/${id}`
    return this.http.get<CargarProveedors>(url, this.headers)
  }
}
