
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CargarRoles, CargarSalons, CargarPaquetes, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';

import { environment } from 'src/environments/environment';

import { PaquetesService } from 'src/app/core/services/paquete.service';
import { Paquete } from 'src/app/core/models/paquete.model';



@Component({
  selector: 'app-vista-usuarios',
  templateUrl: './vista-usuarios.component.html',
  styleUrls: ['./vista-usuarios.component.css']
})
export class VistaUsuariosComponent {
  uid = this.functionsService.getLocal('uid')
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  data!: any
  usuarios: Usuario[] = [];
  usuariosShow: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  roles: Role[]
  salones: Salon[]
  loading = false
  url = environment.base_url
  paquetes: Paquete[] = []



  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private http: HttpClient,
    private busquedasService: BusquedasService,
    private salonesService: SalonsService,
    private paquetesService: PaquetesService,
    private rolesService: RolesService
  ) {
    this.getUsuarios()
    this.getCatalogos()
  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.usuarios = this.functionsService.filterBy(termino, this.usuariosTemp)
    }, 500);
  }
  buscarCatalogo(tipo: string, value) {
    if (value == '') {
      this.usuarios = this.usuariosTemp
      this.setUsuarios()
    }
    switch (tipo) {
      case 'rol':
        this.busquedasService.buscarCatalogo('usuarios', value).subscribe((resp) => {
          this.usuarios = resp
          this.setUsuarios()
        })
        break;
      case 'salon':
        break;
    }
  }
  getCatalogos() {
    this.loading = true
    this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
      console.log('resp::: ', resp);
      this.salones = resp.salons
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
        this.loading = false
      })
    this.paquetesService.cargarPaquetesAll().subscribe((resp: CargarPaquetes) => {
      console.log('resp::: ', resp);
      this.paquetes = resp.paquetes
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Paquetes')
        this.loading = false
      })
    this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
      console.log('resp::: ', resp);
      this.roles = resp.roles
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
        this.loading = false
      })
  }
  setUsuarios() {
    this.loading = true
    setTimeout(() => {
      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false
    }, 500);
  }
  getUsuarios() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {

        this.usuariosShow = resp.usuarios.filter(usuario => usuario.uid !== this.uid)
        this.usuarios = resp.usuarios


        this.usuariosTemp = resp.usuarios

        this.loading = false
      });
    } else if (this.rol === this.SLN) {
      let usr = this.functionsService.getLocal('uid')
      this.usuariosService.cargarUsuarioByCreador(usr).subscribe((resp: CargarUsuarios) => {
        setTimeout(() => {
          this.usuariosShow = resp.usuarios.filter(usuario => usuario.uid !== this.uid)
          this.usuarios = resp.usuarios

          this.usuariosTemp = resp.usuarios

          this.loading = false
        }, 1500);
      });
    } else if (this.rol === this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.usuariosService.cargarUsuarioByCreador(usr).subscribe((resp: CargarUsuarios) => {
        setTimeout(() => {
          this.usuariosShow = resp.usuarios.filter(usuario => usuario.uid !== this.uid)
          this.usuarios = resp.usuarios

          this.usuariosTemp = resp.usuarios

          this.loading = false
        }, 1500);
      });
    }
  }
  getCatalog(tipo: string, id: string) {


    if (id) {
      switch (tipo) {
        case 'rol':
          if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.roles)
          break;
        case 'salon':

          if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.salones)
          break;
        case 'usuario':
          if (id !== undefined) return this.functionsService.getValueCatalog(id, 'email', this.usuarios)
          break;
        case 'paquete':
          if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.paquetes)
          break;
      }
    } else {
      return ''
    }
  }
  editUsuario(id: string) {
    this.functionsService.navigateTo(`/core/usuarios/editar-usuario/true/${id}`)
  }
  isActived(usuario: Usuario) {
    this.usuariosService.isActivedUsuario(usuario).subscribe((resp: any) => {
      this.getUsuarios()
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
      })
  }
  viewUsuario(id: string) {
    this.functionsService.navigateTo(`/core/usuarios/editar-usuario/false/${id}`)
  }
  newUser() {
    this.functionsService.navigateTo('core/usuarios/crear-usuario')
  }

  cargarCreador(id: string) {
    this.usuariosService.cargarUsuarioById(id).subscribe((resp: CargarUsuario) => {
      return resp.usuario.email
    })
  }
  getItems(items, usr, type) {
    usr
    var cantidadFiestas = usr.cantidadFiestas
    var cantidadGalerias = usr.cantidadGalerias
    items.forEach((compra, i) => {

      compra.uso.forEach(us => {
        this.paquetes.forEach(paq => {

          if (paq.uid == us.infoPaq._id) {

            if (paq.tipo == 'eventos') {
              cantidadFiestas += (Number(us.cantidad))
              cantidadFiestas -= Number(us.cantidadUsada)
            } else {
              cantidadGalerias += (Number(us.cantidad))
              cantidadGalerias -= Number(us.cantidadUsada)
            }
          }
        });
      });
    });
    if (type == 'eventos') {

      return cantidadFiestas
    } else if (type == 'galerias') {

      return cantidadGalerias
    }
  }
}
