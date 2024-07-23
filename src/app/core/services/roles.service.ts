import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarRoles, CargarRole } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class RolesService {

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

  cargarRolesInit() {
    const url = `${base_url}/roles/all`
    return this.http.get<CargarRoles>(url, this.headers).pipe(
      map((resp) => {
        const roles = resp.roles.map(
          (rol) =>
            new Role(
              rol.nombre,
              rol.clave,
              rol.activated,
              rol.usuarioCreated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: roles.length,
          roles,
        }
      }),
    )
  }
  cargarRolesAll() {
    const url = `${base_url}/roles/all`
    return this.http.get<CargarRoles>(url, this.headers).pipe(
      map((resp) => {
        const roles = resp.roles.map(
          (rol) =>
            new Role(
              rol.nombre,
              rol.clave,
              rol.activated,
              rol.usuarioCreated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: roles.length,
          roles,
        }
      }),
    )
  }
  cargarRolesSalon() {
    const url = `${base_url}/roles/all/salon`
    return this.http.get<CargarRoles>(url, this.headers).pipe(
      map((resp) => {
        const roles = resp.roles.map(
          (rol) =>
            new Role(
              rol.nombre,
              rol.clave,
              rol.activated,
              rol.usuarioCreated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,

            ),
        )
        return {
          total: roles.length,
          roles,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarRoles>(url, this.headers).pipe(
      map((resp) => {
        const roles = resp.roles.map(
          (rol) =>
            new Role(
              rol.nombre,
              rol.clave,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: roles.length,
          roles,
        }
      }),
    )
  }
  crearRole(formData: Role) {
    return this.http.post(`${base_url}/roles`, formData, this.headers)
  }


  isActivedRole(role: Role) {
    const url = `${base_url}/roles/isActive/${role.uid}`
    const data = {
      ...role,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarRole(role: Role) {
    const url = `${base_url}/roles/${role.uid}`
    const data = {
      ...role,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarRoleById(id: string) {
    const url = `${base_url}/roles/${id}`
    return this.http.get<CargarRole>(url, this.headers)
  }
  cargarRoleByClave(clave: string) {
    const url = `${base_url}/roles/clave/${clave}`
    return this.http.get<CargarRole>(url, this.headers)
  }

}
