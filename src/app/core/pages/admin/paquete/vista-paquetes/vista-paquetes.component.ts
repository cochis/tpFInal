import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';


import { CargarPaquetes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Paquete } from 'src/app/core/models/paquete.model';
import { PaquetesService } from 'src/app/core/services/paquete.service';
@Component({
  selector: 'app-vista-paquetes',
  templateUrl: './vista-paquetes.component.html',
  styleUrls: ['./vista-paquetes.component.scss']
})
export class VistaPaquetesComponent {
  data!: any
  paquetes: Paquete[]
  paquetesTemp: Paquete[]
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

    private paquetesService: PaquetesService
  ) {
    this.getPaquetes()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.paquetes = this.paquetesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.paquetesTemp)
      this.paquetes = this.functionsService.filterBy(termino, this.paquetesTemp)
    }, 500);
  }



  setPaquetes() {
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
  getPaquetes() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.paquetesService.cargarPaquetesAll().subscribe((resp: CargarPaquetes) => {


        this.paquetes = resp.paquetes
        this.paquetesTemp = resp.paquetes
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'Paquetes')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.paquetesService.cargarPaquetesByEmail(usr).subscribe((resp: CargarPaquetes) => {

        this.paquetes = resp.paquetes

        this.paquetesTemp = resp.paquetes
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editPaquete(id: string) {

    this.functionsService.navigateTo(`/core/paquete/editar-paquete/true/${id}`)

  }
  isActived(paquete: Paquete) {

    this.paquetesService.isActivedPaquete(paquete).subscribe((resp: any) => {
      this.getPaquetes()


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Paquetes')

      })
  }
  viewPaquete(id: string) {
    this.functionsService.navigateTo(`/core/paquete/editar-paquete/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newPaquete() {

    this.functionsService.navigateTo('core/paquete/crear-paquete')
  }

}
