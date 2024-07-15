import { Component } from '@angular/core';
import { CargarRoles } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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



@Component({
  selector: 'app-vista-roles',
  templateUrl: './vista-roles.component.html',
  styleUrls: ['./vista-roles.component.css']
})
export class VistaRolesComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  roles: Role[]
  rolesTemp: Role[]
  salones: Salon[]
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private rolesService: RolesService
  ) {
    this.getRoles()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.roles = this.rolesTemp
        return
      }
      this.busquedasService.buscar('roles', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.roles = resp

        this.setRoles()
      })

    }, 500);
  }




  setRoles() {
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
  getRoles() {
    this.loading = true
    this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
      this.roles = resp.roles

      this.rolesTemp = resp.roles
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editRol(id: string) {

    this.functionsService.navigateTo(`/core/roles/editar-rol/true/${id}`)

  }
  isActived(rol: Role) {

    this.rolesService.isActivedRole(rol).subscribe((resp: any) => {
      this.getRoles()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Roles')

      })
  }
  viewRol(id: string) {
    this.functionsService.navigateTo(`/core/roles/editar-rol/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/roles/crear-rol')
  }

}
