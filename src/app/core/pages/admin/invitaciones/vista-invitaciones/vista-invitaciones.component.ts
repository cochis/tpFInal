import { Component } from '@angular/core';
import { CargarInvitacions } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';

import { Invitacion } from 'src/app/core/models/invitacion.model';
import { Salon } from 'src/app/core/models/salon.model';

import { environment } from 'src/environments/environment';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';


@Component({
  selector: 'app-vista-invitaciones',
  templateUrl: './vista-invitaciones.component.html',
  styleUrls: ['./vista-invitaciones.component.css']
})
export class VistaInvitacionesComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  invitacions: Invitacion[]
  invitacionsTemp: Invitacion[]
  salones: Salon[]
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,

    private invitacionsService: InvitacionsService
  ) {
    this.getInvitacions()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.invitacions = this.invitacionsTemp
        return
      }
      this.busquedasService.buscar('invitacions', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.invitacions = resp

        this.setInvitacions()
      })

    }, 500);
  }




  setInvitacions() {
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
  getInvitacions() {
    this.loading = true
    this.invitacionsService.cargarInvitacionsAll().subscribe((resp: CargarInvitacions) => {
      //console.log('resp::: ', resp);
      this.invitacions = resp.invitacions

      this.invitacionsTemp = resp.invitacions
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editInvitacion(id: string) {

    this.functionsService.navigateTo(`/core/invitaciones/editar-invitacion/true/${id}`)

  }
  isActived(rol: Invitacion) {

    this.invitacionsService.isActivedInvitacion(rol).subscribe((resp: any) => {
      this.getInvitacions()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Invitaciones')

      })
  }
  viewInvitacion(id: string) {
    this.functionsService.navigateTo(`/core/invitaciones/editar-invitacion/false/${id}`)

  }

  newInvitacion() {

    this.functionsService.navigateTo('core/invitaciones/crear-invitacion')
  }

}

