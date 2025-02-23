import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { CotizacionesService } from 'src/app/core/services/cotizacion.service';
import { Cotizacion } from 'src/app/core/models/cotizacion.model';
import { CargarCotizaciones } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-mis-cotizaciones',
  templateUrl: './mis-cotizaciones.component.html',
  styleUrls: ['./mis-cotizaciones.component.css']
})
export class MisCotizacionesComponent {
  data!: any
  cotizaciones: Cotizacion[] = []
  cotizacionesTemp: Cotizacion[] = []
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  PRV = environment.prv_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  empresas = this.functionsService.getLocal('proveedor')


  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,
    private cotizacionesService: CotizacionesService,

  ) {
    this.getCotizaciones()


  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.cotizaciones = this.cotizacionesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.cotizacionesTemp)
      this.cotizaciones = this.functionsService.filterBy(termino, this.cotizacionesTemp)
    }, 500);
  }




  setCotizaciones() {
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
  getCotizaciones() {
    this.loading = true




    if (this.rol === this.ADM) {
      this.cotizacionesService.cargarCotizacionesAll().subscribe((resp: CargarCotizaciones) => {

        this.cotizaciones = resp.cotizaciones

        this.cotizacionesTemp = resp.cotizaciones
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Cotizaciones')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.cotizacionesService.cargarCotizacionesByEmail(usr).subscribe((resp: CargarCotizaciones) => {

        this.cotizaciones = resp.cotizaciones
        this.cotizacionesTemp = resp.cotizaciones
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    } else if (this.rol == this.PRV) {
      let usr = this.functionsService.getLocal('uid')

      this.empresas.forEach(emp => {


        this.cotizacionesService.cargarCotizacionesByProveedor(emp.uid).subscribe((resp: any) => {

          let cots = this.functionsService.getActives(resp.cotizaciones)

          cots.forEach(c => {

            this.cotizaciones.push(c)
          });



        });
        setTimeout(() => {

          this.loading = false
        }, 3500);
      });
    }
  }

  editCotizacion(id: string) {

    this.functionsService.navigateTo(`/core/cotizaciones/editar-cotizacion/true/${id}`)

  }
  isActived(cotizacion: Cotizacion) {

    this.cotizacionesService.isActivedCotizacion(cotizacion).subscribe((resp: any) => {
      this.getCotizaciones()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Cotizaciones')

      })
  }
  viewCotizacion(id: string) {
    this.functionsService.navigateTo(`/core/cotizaciones/mi-cotizacion/${id}`)

  }

  newCotizacion() {

    this.functionsService.navigateTo('core/cotizaciones/crear-cotizacion')
  }

}
