import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarUsuarios, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

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

  cargarAlumnosAll() {
    const url = `${base_url}/usuarios/all`
    return this.http.get<CargarUsuarios>(url, this.headers).pipe(
      map((resp) => {

        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.nombre,
              user.apellidoPaterno,
              user.apellidoMaterno,
              user.email,
              user.password,
              user.img,
              user.role,
              user.salon,
              user.cantidadFiestas,
              user.paqueteActual,
              user.google,
              user.usuarioCreated,
              user.activated,
              user.dateCreated,
              user.lastEdited,
              user.uid,

            ),
        )
        return {
          total: usuarios.length,
          usuarios,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarUsuarios>(url, this.headers).pipe(
      map((resp) => {
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.nombre,
              user.apellidoPaterno,
              user.apellidoMaterno,
              user.email,
              user.password,
              user.img,
              user.role,
              user.salon,
              user.cantidadFiestas,
              user.paqueteActual,
              user.google,
              user.usuarioCreated,
              user.activated,
              user.dateCreated,
              user.lastEdited,
              user.uid,

            ),
        )
        return {
          total: usuarios.length,
          usuarios,
        }
      }),
    )
  }
  crearUsuarioSalon(formData: Usuario, uid: string) {
    return this.http.post(`${base_url}/usuarios/salon/${uid}`, formData, this.headers)
  }
  crearUsuario(formData: Usuario) {
    // console.log('formData::: ', formData);
    return this.http.post(`${base_url}/usuarios`, formData, this.headers)




  }


  isActivedUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/isActive/${usuario.uid}`

    const data = {
      ...usuario,
      lastEdited: Date.now(),
    }


    return this.http.put(url, data, this.headers)
  }
  actualizarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`
    const data = {
      ...usuario,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPass(usuario: Usuario) {
    const url = `${base_url}/usuarios/pass/${usuario.uid}`
    const data = {
      ...usuario,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarUsuarioById(id: string) {
    const url = `${base_url}/usuarios/${id}`
    return this.http.get<CargarUsuario>(url, this.headers)
  }
  cargarUsuarioByEmail(email: string) {

    const url = `${base_url}/usuarios/byemail/${email}`
    // console.log('url::: ', url);

    return this.http.get<CargarUsuarios>(url, this.headers)
  }
  cargarUsuarioByCreador(creador: string) {


    const url = `${base_url}/usuarios/bycreador/${creador}`
    // console.log('url::: ', url);

    return this.http.get<CargarUsuarios>(url, this.headers)
  }

}
