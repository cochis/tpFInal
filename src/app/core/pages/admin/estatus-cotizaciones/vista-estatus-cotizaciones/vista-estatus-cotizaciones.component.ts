import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';

import { EstatusCotizacion } from 'src/app/core/models/estatusCotizacion.model';
import { CargarEstatusCotizaciones } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EstatusCotizacionesService } from 'src/app/core/services/estatusCotizaciones.service';

@Component({
  selector: 'app-vista-estatus-cotizaciones',
  templateUrl: './vista-estatus-cotizaciones.component.html',
  styleUrls: ['./vista-estatus-cotizaciones.component.scss']
})
export class VistaEstatusCotizacionesComponent {
  data!: any
  estatusCotizaciones: EstatusCotizacion[]
  estatusCotizacionesTemp: EstatusCotizacion[]
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

    private estatusCotizacionesService: EstatusCotizacionesService
  ) {
    this.getEstatusCotizaciones()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.estatusCotizaciones = this.estatusCotizacionesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.estatusCotizacionesTemp)
      this.estatusCotizaciones = this.functionsService.filterBy(termino, this.estatusCotizacionesTemp)
    }, 500);
  }




  setEstatusCotizaciones() {
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
  getEstatusCotizaciones() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.estatusCotizacionesService.cargarEstatusCotizacionesAll().subscribe((resp: CargarEstatusCotizaciones) => {

        this.estatusCotizaciones = resp.estatusCotizaciones
        this.estatusCotizacionesTemp = resp.estatusCotizaciones
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'EstatusCotizacions')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.estatusCotizacionesService.cargarEstatusCotizacionesByEmail(usr).subscribe((resp: CargarEstatusCotizaciones) => {

        this.estatusCotizaciones = resp.estatusCotizaciones
        this.estatusCotizacionesTemp = resp.estatusCotizaciones
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editEstatusCotizacion(id: string) {

    this.functionsService.navigateTo(`/estatus-cotizaciones/editar-estatus-cotizacion/true/${id}`)

  }
  isActived(estatusCotizacion: EstatusCotizacion) {

    this.estatusCotizacionesService.isActivedEstatusCotizacion(estatusCotizacion).subscribe((resp: any) => {
      this.getEstatusCotizaciones()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'EstatusCotizacions')

      })
  }
  viewEstatusCotizacion(id: string) {
    this.functionsService.navigateTo(`/estatus-cotizaciones/editar-estatus-cotizacion/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newEstatusCotizacion() {

    this.functionsService.navigateTo('estatus-cotizaciones/crear-estatus-cotizacion')
  }

}

