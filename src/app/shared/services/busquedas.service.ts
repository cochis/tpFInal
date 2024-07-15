import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {
  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }
  constructor(private http: HttpClient) { }
  private transformaUsuario(resultado: any): Usuario[] {
    return resultado.map(
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
          user.google,
          user.usuarioCreated,
          user.activated,
          user.cantidadFiestas,
          user.paqueteActual,
          user.dateCreated,
          user.lastEdited,
          user.uid,

        ),
    )
  }
  private transformaFiesta(resultado: any): Fiesta[] {
    return resultado.map(
      (fiesta) =>
        new Fiesta(
          fiesta.nombre,
          fiesta.evento,
          fiesta.cantidad,
          fiesta.fecha,
          fiesta.calle,
          fiesta.numeroExt,
          fiesta.numeroInt,
          fiesta.municipioDelegacion,
          fiesta.coloniaBarrio,
          fiesta.cp,
          fiesta.estado,
          fiesta.pais,
          fiesta.comoLlegar,
          fiesta.salon,
          fiesta.usuarioFiesta,
          fiesta.img,
          fiesta.invitacion,
          fiesta.realizada,
          fiesta.usuarioCreated,
          fiesta.activated,
          fiesta.dateCreated,
          fiesta.lastEdited,
          fiesta.uid,

        ),
    )
  }
  private transformaRole(resultado: any): Role[] {
    return resultado.map(
      (role) =>
        new Role(
          role.nombre,
          role.clave,
          role.activated,
          role.usuarioCreated,
          role.dateCreated,
          role.lastEdited,
          role.uid
        ),
    )
  }
  private transformaGrupo(resultado: any): Role[] {
    return resultado.map(
      (gpo) =>
        new Role(
          gpo.nombre,
          gpo.clave,
          gpo.activated,
          gpo.usuarioCreated,
          gpo.dateCreated,
          gpo.lastEdited,
          gpo.uid
        ),
    )
  }
  private transformaEvento(resultado: any): Role[] {
    return resultado.map(
      (evt) =>
        new Role(
          evt.nombre,
          evt.clave,
          evt.activated,
          evt.usuarioCreated,
          evt.dateCreated,
          evt.lastEdited,
          evt.uid
        ),
    )
  }
  private transformaSalon(resultado: any): Role[] {
    return resultado.map(
      (sln) =>
        new Salon(
          sln.nombre,
          sln.direccion,
          sln.calle,
          sln.numeroExt,
          sln.numeroInt,
          sln.municipioDelegacion,
          sln.coloniaBarrio,
          sln.cp,
          sln.estado,
          sln.pais,
          sln.comoLlegar,
          sln.lat,
          sln.long,
          sln.telefono,
          sln.email,
          sln.ubicacionGoogle,
          sln.img,
          sln.usuarioCreated,
          sln.activated,
          sln.dateCreated,
          sln.lastEdited,
          sln.uid,
        ),
    )
  }
  buscar(
    tipo: 'usuarios' | 'grupos' | 'salones' | 'fiestas' | 'boletos' | 'eventos' | 'roles' | 'invitacions' | 'tipoCantidades' | 'statusCompras' | 'tipoModulos' | 'moduloTemplates' | 'templates',
    termino: string = '',
    admin: true | false,
  ): any {

    const url = `${base_url}/search/coleccion/${tipo}/${termino}/${admin}`

    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformaUsuario(resp.resultados)
            break
          case 'roles':
            return this.transformaRole(resp.resultados)
            break
          case 'grupos':
            return this.transformaGrupo(resp.resultados)
            break
          case 'eventos':
            return this.transformaEvento(resp.resultados)
            break
          case 'salones':
            return this.transformaSalon(resp.resultados)
            break
          case 'fiestas':
            return this.transformaFiesta(resp.resultados)
            break

          default:
            return false
            break
        }
      }),
    )
  }
  buscarCatalogo(
    tipo: 'usuarios' | 'fiestas',
    termino: string = '',
  ): any {
    const url = `${base_url}/search/coleccion-catalogo/${tipo}/${termino}`
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformaUsuario(resp.resultados)
            break

          default:
            return false
            break
        }
      }),
    )
  }
}
