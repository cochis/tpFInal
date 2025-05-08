import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { FondosService } from 'src/app/core/services/fondo.service';
import { Fondo } from 'src/app/core/models/fondo.model';
import { CargarFondos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-vista-fondos',
  templateUrl: './vista-fondos.component.html',
  styleUrls: ['./vista-fondos.component.scss']
})
export class VistaFondosComponent {
  data!: any
  fondos: Fondo[]
  fondosTemp: Fondo[]
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

    private fondosService: FondosService
  ) {
    this.getFondos()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.fondos = this.fondosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.fondosTemp)
      this.fondos = this.functionsService.filterBy(termino, this.fondosTemp)
    }, 500);
  }




  setFondos() {
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
  getFondos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.fondosService.cargarFondosAll().subscribe((resp: CargarFondos) => {

        this.fondos = resp.fondos
        this.fondosTemp = resp.fondos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Fondos')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.fondosService.cargarFondosByEmail(usr).subscribe((resp: CargarFondos) => {

        this.fondos = resp.fondos
        this.fondosTemp = resp.fondos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editFondo(id: string) {

    this.functionsService.navigateTo(`/core/fondos/editar-fondo/true/${id}`)

  }
  isActived(fondo: Fondo) {

    this.fondosService.isActivedFondo(fondo).subscribe((resp: any) => {
      this.getFondos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Fondos')

      })
  }
  viewFondo(id: string) {
    this.functionsService.navigateTo(`/core/fondos/editar-fondo/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newFondo() {

    this.functionsService.navigateTo('core/fondos/crear-fondo')
  }

}
