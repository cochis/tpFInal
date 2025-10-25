import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoUbicacionesService } from 'src/app/core/services/tipoUbicacion.service';
import { TipoUbicacion } from 'src/app/core/models/tipoUbicacion.model';
import { CargarTipoUbicaciones } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-tipo-ubicaciones',
  templateUrl: './vista-tipo-ubicaciones.component.html',
  styleUrls: ['./vista-tipo-ubicaciones.component.scss']
})
export class VistaTipoUbicacionesComponent {
  data!: any
  tipoUbicaciones: TipoUbicacion[]
  tipoUbicacionesTemp: TipoUbicacion[]
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

    private tipoUbicacionesService: TipoUbicacionesService
  ) {
    this.getTipoUbicaciones()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoUbicaciones = this.tipoUbicacionesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoUbicacionesTemp)
      this.tipoUbicaciones = this.functionsService.filterBy(termino, this.tipoUbicacionesTemp)
    }, 500);
  }




  setTipoUbicaciones() {
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
  getTipoUbicaciones() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.tipoUbicacionesService.cargarTipoUbicacionesAll().subscribe((resp: CargarTipoUbicaciones) => {

        this.tipoUbicaciones = resp.tipoUbicaciones
        this.tipoUbicacionesTemp = resp.tipoUbicaciones
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'TipoUbicaciones')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.tipoUbicacionesService.cargarTipoUbicacionesByEmail(usr).subscribe((resp: CargarTipoUbicaciones) => {

        this.tipoUbicaciones = resp.tipoUbicaciones
        this.tipoUbicacionesTemp = resp.tipoUbicaciones
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editTipoUbicacion(id: string) {

    this.functionsService.navigateTo(`/tipo-ubicaciones/editar-tipo-ubicacion/true/${id}`)

  }
  isActived(tipoUbicacion: TipoUbicacion) {

    this.tipoUbicacionesService.isActivedTipoUbicacion(tipoUbicacion).subscribe((resp: any) => {
      this.getTipoUbicaciones()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'TipoUbicaciones')

      })
  }
  viewTipoUbicacion(id: string) {
    this.functionsService.navigateTo(`/tipo-ubicaciones/editar-tipo-ubicacion/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoUbicacion() {

    this.functionsService.navigateTo('tipo-ubicaciones/crear-tipo-ubicacion')
  }

}
