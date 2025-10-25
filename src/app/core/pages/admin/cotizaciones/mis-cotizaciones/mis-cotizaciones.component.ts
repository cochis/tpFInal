import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { CotizacionesService } from 'src/app/core/services/cotizacion.service';
import { Cotizacion } from 'src/app/core/models/cotizacion.model';
import { CargarCotizaciones, CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';


@Component({
  selector: 'app-mis-cotizaciones',
  templateUrl: './mis-cotizaciones.component.html',
  styleUrls: ['./mis-cotizaciones.component.scss']
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
  tipoMedias: TipoMedia[]
  constructor(
    private functionsService: FunctionsService,
    private tipoMediasService: TipoMediasService,

    private busquedasService: BusquedasService,
    private cotizacionesService: CotizacionesService,

  ) {
    this.getCatalogos()
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
        }, 500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Cotizaciones')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF || this.rol == this.URS) {
      let usr = this.functionsService.getLocal('uid')
      this.cotizacionesService.cargarCotizacionesByEmail(usr).subscribe((resp: CargarCotizaciones) => {

        this.cotizaciones = resp.cotizaciones

        this.cotizacionesTemp = resp.cotizaciones
        setTimeout(() => {

          this.loading = false
        }, 500);
      });
    } else if (this.rol == this.PRV) {
      let usr = this.functionsService.getLocal('uid')


      if (this.empresas.length > 0) {

        this.empresas.forEach(emp => {



          this.cotizacionesService.cargarCotizacionesByProveedor(emp.uid).subscribe((resp: any) => {

            let cots = this.functionsService.getActives(resp.cotizaciones)

            cots.forEach(c => {

              this.cotizaciones.push(c)
            });



          });
          this.cotizacionesService.cargarCotizacionesByCreador(this.uid).subscribe(res => {
            let cots = this.functionsService.getActives(res.cotizaciones)

            cots.forEach(c => {

              this.cotizaciones.push(c)
            });
          })
          setTimeout(() => {

            this.loading = false
          }, 3500);
        });
      } else {
        this.cotizacionesService.cargarCotizacionesByCreador(this.uid).subscribe(res => {
          let cots = this.functionsService.getActives(res.cotizaciones)

          cots.forEach(c => {

            this.cotizaciones.push(c)
          });
        })
        this.loading = false
      }
    }
  }

  editCotizacion(id: string) {

    this.functionsService.navigateTo(`/cotizaciones/editar-cotizacion/true/${id}`)

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
    this.functionsService.navigateTo(`/cotizaciones/mi-cotizacion/${id}`)

  }

  newCotizacion() {

    this.functionsService.navigateTo('cotizaciones/crear-cotizacion')
  }
  getImagen(photos, i) {
    var img = ''
    photos.forEach(im => {

      this.tipoMedias.forEach(tm => {

        if (im.isPrincipal) {

          if (tm.uid === im.tipoMedia && tm.clave == 'image/*') {

            img = this.url + '/upload/items/' + im.img
          }
          /*  else {
 
             img = this.url + '/upload/proveedores/' + this.carrito[i].item.proveedor.img
           } */

        }

      });
    });


    return img
  }
  getCatalogos() {
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {

      this.tipoMedias = resp.tipoMedias


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Contactos')
        this.loading = false
      })

  }
}
