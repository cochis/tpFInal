import { Component, OnDestroy, OnInit } from '@angular/core';
import { CargarGrupos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { Grupo } from 'src/app/core/models/grupo.model';
import { GruposService } from 'src/app/core/services/grupo.service';



@Component({
  selector: 'app-vista-grupos',
  templateUrl: './vista-grupos.component.html',
  styleUrls: ['./vista-grupos.component.scss']
})
export class VistaGruposComponent {
  data!: any

  grupos: Grupo[]
  gruposTemp: Grupo[]
  loading = false
  url = environment.base_url

  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')

  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private gruposService: GruposService
  ) {
    this.getGrupos()
  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.grupos = this.gruposTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.gruposTemp)
      this.grupos = this.functionsService.filterBy(termino, this.gruposTemp)
    }, 500);
  }




  setGrupos() {
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
  getGrupos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.gruposService.cargarGruposAll().subscribe((resp: CargarGrupos) => {

        this.grupos = resp.grupos
        this.gruposTemp = resp.grupos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Grupos')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.gruposService.cargarGruposByEmail(usr).subscribe((resp: CargarGrupos) => {

        this.grupos = resp.grupos
        this.gruposTemp = resp.grupos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editGrupo(id: string) {

    this.functionsService.navigateTo(`/grupos/editar-grupo/true/${id}`)

  }
  isActived(grupo: Grupo) {

    this.gruposService.isActivedGrupo(grupo).subscribe((resp: any) => {
      this.getGrupos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Grupos')

      })
  }
  viewGrupo(id: string) {
    this.functionsService.navigateTo(`/grupos/editar-grupo/false/${id}`)

  }

  newGrupo() {

    this.functionsService.navigateTo('grupos/crear-grupo')
  }

}
