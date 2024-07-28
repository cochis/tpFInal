import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { StatusComprasService } from 'src/app/core/services/statusCompra.service';
import { StatusCompra } from 'src/app/core/models/statusCompra.model';
import { CargarStatusCompras } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-vista-status-compra',
  templateUrl: './vista-status-compra.component.html',
  styleUrls: ['./vista-status-compra.component.css']
})
export class VistaStatusCompraComponent {
  data!: any
  statusCompras: StatusCompra[]
  statusComprasTemp: StatusCompra[]
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

    private statusComprasService: StatusComprasService
  ) {
    this.getStatusCompras()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.statusCompras = this.statusComprasTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.statusComprasTemp)
      this.statusCompras = this.functionsService.filterBy(termino, this.statusComprasTemp)
    }, 500);
  }




  setStatusCompras() {
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
  getStatusCompras() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.statusComprasService.cargarStatusComprasAll().subscribe((resp: CargarStatusCompras) => {

        this.statusCompras = resp.statusCompras
        this.statusComprasTemp = resp.statusCompras
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'StatusCompras')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.statusComprasService.cargarStatusComprasByEmail(usr).subscribe((resp: CargarStatusCompras) => {

        this.statusCompras = resp.statusCompras
        this.statusComprasTemp = resp.statusCompras
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editStatusCompra(id: string) {

    this.functionsService.navigateTo(`/core/status-compra/editar-status-compra/true/${id}`)

  }
  isActived(statusCompra: StatusCompra) {

    this.statusComprasService.isActivedStatusCompra(statusCompra).subscribe((resp: any) => {
      this.getStatusCompras()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Estatus deCompras')

      })
  }
  viewStatusCompra(id: string) {
    this.functionsService.navigateTo(`/core/status-compra/editar-status-compra/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newStatusCompra() {

    this.functionsService.navigateTo('core/status-compra/crear-status-compra')
  }

}
