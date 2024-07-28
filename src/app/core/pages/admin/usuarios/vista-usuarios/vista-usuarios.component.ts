
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CargarRoles, CargarSalons, CargarTipoCantidades, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';



@Component({
  selector: 'app-vista-usuarios',
  templateUrl: './vista-usuarios.component.html',
  styleUrls: ['./vista-usuarios.component.css']
})
export class VistaUsuariosComponent {
  uid = this.functionsService.getLocal('uid')
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  roles: Role[]
  salones: Salon[]
  loading = false
  url = environment.base_url
  tipoCantidades: TipoCantidad[] = []



  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private http: HttpClient,
    private busquedasService: BusquedasService,
    private salonesService: SalonsService,
    private tipoCantidadesService: TipoCantidadesService,
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
      this.salones = resp.salons
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
        this.loading = false
      })
    this.tipoCantidadesService.cargarTipoCantidadesAll().subscribe((resp: CargarTipoCantidades) => {
      this.tipoCantidades = resp.tipoCantidades
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Paquetes')
        this.loading = false
      })
    this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
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
        this.usuarios = resp.usuarios
        this.usuariosTemp = resp.usuarios
        this.loading = false
      });
    } else if (this.rol === this.SLN) {
      let usr = this.functionsService.getLocal('uid')
      this.usuariosService.cargarUsuarioByCreador(usr).subscribe((resp: CargarUsuarios) => {
        setTimeout(() => {
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
          if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.tipoCantidades)
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
}
