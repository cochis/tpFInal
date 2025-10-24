import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { ParametrosService } from 'src/app/core/services/parametro.service';
import { Parametro } from 'src/app/core/models/parametro.model';
import { CargarParametros } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-parametros',
  templateUrl: './vista-parametros.component.html',
  styleUrls: ['./vista-parametros.component.scss']
})
export class VistaParametrosComponent {
  data!: any
  parametros: Parametro[]
  parametrosTemp: Parametro[]
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

    private parametrosService: ParametrosService
  ) {
    this.getParametros()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.parametros = this.parametrosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.parametrosTemp)
      this.parametros = this.functionsService.filterBy(termino, this.parametrosTemp)
    }, 500);
  }




  setParametros() {
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
  getParametros() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.parametrosService.cargarParametrosAll().subscribe((resp: CargarParametros) => {

        this.parametros = resp.parametros
        this.parametrosTemp = resp.parametros
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Parametros')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.parametrosService.cargarParametrosByEmail(usr).subscribe((resp: CargarParametros) => {

        this.parametros = resp.parametros
        this.parametrosTemp = resp.parametros
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editParametro(id: string) {

    this.functionsService.navigateTo(`/core/parametros/editar-parametro/true/${id}`)

  }
  isActived(parametro: Parametro) {

    this.parametrosService.isActivedParametro(parametro).subscribe((resp: any) => {
      this.getParametros()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Parametros')

      })
  }
  viewParametro(id: string) {
    this.functionsService.navigateTo(`/core/parametros/editar-parametro/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newParametro() {

    this.functionsService.navigateTo('parametros/crear-parametro')
  }

}
