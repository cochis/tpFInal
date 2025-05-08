import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';

import { Pais } from 'src/app/core/models/pais.model';
import { CargarPaises } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { PaisesService } from 'src/app/core/services/pais.service';

@Component({
  selector: 'app-vista-paises',
  templateUrl: './vista-paises.component.html',
  styleUrls: ['./vista-paises.component.scss']
})
export class VistaPaisesComponent {
  data!: any
  paises: Pais[]
  paisesTemp: Pais[]
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

    private paisesService: PaisesService
  ) {


    this.getPaises()


  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.paises = this.paisesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.paisesTemp)
      this.paises = this.functionsService.filterBy(termino, this.paisesTemp)
    }, 500);
  }




  setPaises() {
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
  getPaises() {
    this.loading = true
    this.paisesService.cargarPaisesAll().subscribe((resp: CargarPaises) => {


      this.paises = resp.paises
      this.paisesTemp = resp.paises
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.alertError(error, 'Paises')
      });
  }

  editPais(id: string) {

    this.functionsService.navigateTo(`/core/paises/editar-pais/true/${id}`)

  }
  isActived(pais: Pais) {

    this.paisesService.isActivedPais(pais).subscribe((resp: any) => {
      this.getPaises()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Paises')

      })
  }
  viewPais(id: string) {
    this.functionsService.navigateTo(`/core/paises/editar-pais/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newPais() {

    this.functionsService.navigateTo('core/paises/crear-pais')
  }

}
