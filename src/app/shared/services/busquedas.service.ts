import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { environment } from 'src/environments/environment';
import { FunctionsService } from './functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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
  constructor(private http: HttpClient,
    private functionsService: FunctionsService,) { }
  private transformaUsuario(resultado: any): Usuario[] {
    return resultado.map(
      (user) =>
        new Usuario(
          user.tipoCentro,
          user.nombre,
          user.apellidoPaterno,
          user.apellidoMaterno,
          user.email,
          user.password,
          user.img,
          user.role,
          user.salon,
          user.cantidadFiestas,
          user.cantidadGalerias,
          user.paqueteActual,
          user.google,
          user.compras,
          user.pushNotification,
          user.aceptoPolitica,
          user.aceptoTerminos,
          user.usuarioCreated,
          user.activated,
          user.dateCreated,
          user.lastEdited,
          user.uid,



        ),
    )
  }
  private transformaFiesta(resultado: any): Fiesta[] {
    return resultado.map(
      (fie) =>
        new Fiesta(
          fie.nombre,
              fie.evento,
              fie.cantidad,
              fie.fecha,
              fie.calle,
              fie.numeroExt,
              fie.numeroInt,
              fie.municipioDelegacion,
              fie.coloniaBarrio,
              fie.cp,
              fie.estado,
              fie.pais,
              fie.comoLlegar,
              fie.salon,
              fie.usuarioFiesta,
              fie.img,
              fie.invitacion,
              fie.realizada,
              fie.galeria,
              fie.checking,
              fie.mesaOk,
              fie.example,
              fie.croquis,
              fie.usuarioCreated,
              fie.activated,
              fie.dateCreated,
              fie.lastEdited,
              fie.uid,

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
    tipo: 'usuarios' | 'grupos' | 'salones' | 'fiestas' | 'boletos' | 'eventos' | 'roles' | 'invitacions' | 'tipoCantidades' | 'statusCompras' | 'tipoModulos' | 'moduloTemplates' | 'templates' | 'tipoCentros',
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
