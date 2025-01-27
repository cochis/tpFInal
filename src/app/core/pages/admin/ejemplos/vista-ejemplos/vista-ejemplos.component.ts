import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { EjemplosService } from 'src/app/core/services/ejemplo.service';
import { Ejemplo } from 'src/app/core/models/ejemplo.model';
import { CargarEjemplos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-vista-ejemplos',
  templateUrl: './vista-ejemplos.component.html',
  styleUrls: ['./vista-ejemplos.component.css']
})
export class VistaEjemplosComponent {
  data!: any
  ejemplos: Ejemplo[] = []
  ejemplosTemp: Ejemplo[] = []
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

    private ejemplosService: EjemplosService
  ) {
    this.getEjemplos()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.ejemplos = this.ejemplosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.ejemplosTemp)
      this.ejemplos = this.functionsService.filterBy(termino, this.ejemplosTemp)
    }, 500);
  }




  setEjemplos() {
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
  getEjemplos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.ejemplosService.cargarEjemplosAll().subscribe((resp: CargarEjemplos) => {

        this.ejemplos = resp.ejemplos
        this.ejemplosTemp = resp.ejemplos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Ejemplos')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.ejemplosService.cargarEjemplosByEmail(usr).subscribe((resp: CargarEjemplos) => {

        this.ejemplos = resp.ejemplos
        this.ejemplosTemp = resp.ejemplos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editEjemplo(id: string) {

    this.functionsService.navigateTo(`/core/ejemplos/editar-ejemplo/true/${id}`)

  }
  isActived(ejemplo: Ejemplo) {

    this.ejemplosService.isActivedEjemplo(ejemplo).subscribe((resp: any) => {
      this.getEjemplos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Ejemplos')

      })
  }
  viewEjemplo(id: string) {
    this.functionsService.navigateTo(`/core/ejemplos/editar-ejemplo/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newEjemplo() {

    this.functionsService.navigateTo('core/ejemplos/crear-ejemplo')
  }

}
