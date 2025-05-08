import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';

import { CargarTipoCantidades } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';

@Component({
  selector: 'app-vista-tipo-cantidad',
  templateUrl: './vista-tipo-cantidad.component.html',
  styleUrls: ['./vista-tipo-cantidad.component.scss']
})
export class VistaTipoCantidadComponent {
  data!: any
  tipoCantidades: TipoCantidad[]
  tipoCantidadesTemp: TipoCantidad[]
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

    private tipoCantidadesService: TipoCantidadesService
  ) {
    this.getTipoCantidades()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoCantidades = this.tipoCantidadesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoCantidadesTemp)
      this.tipoCantidades = this.functionsService.filterBy(termino, this.tipoCantidadesTemp)
    }, 500);
  }



  setTipoCantidades() {
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
  getTipoCantidades() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.tipoCantidadesService.cargarTipoCantidadesAll().subscribe((resp: CargarTipoCantidades) => {


        this.tipoCantidades = resp.tipoCantidades
        this.tipoCantidadesTemp = resp.tipoCantidades
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'TipoCantidades')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.tipoCantidadesService.cargarTipoCantidadesByEmail(usr).subscribe((resp: CargarTipoCantidades) => {

        this.tipoCantidades = resp.tipoCantidades
        this.tipoCantidadesTemp = resp.tipoCantidades
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editTipoCantidad(id: string) {

    this.functionsService.navigateTo(`/core/tipo-cantidad/editar-tipo-cantidad/true/${id}`)

  }
  isActived(tipoCantidad: TipoCantidad) {

    this.tipoCantidadesService.isActivedTipoCantidad(tipoCantidad).subscribe((resp: any) => {
      this.getTipoCantidades()


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'TipoCantidades')

      })
  }
  viewTipoCantidad(id: string) {
    this.functionsService.navigateTo(`/core/tipo-cantidad/editar-tipo-cantidad/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoCantidad() {

    this.functionsService.navigateTo('core/tipo-cantidad/crear-tipo-cantidad')
  }

}
