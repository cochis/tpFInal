import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { CargarProveedors, CargarTipoColors, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';


@Component({
  selector: 'app-vista-provedors',
  templateUrl: './vista-provedors.component.html',
  styleUrls: ['./vista-provedors.component.scss']
})
export class VistaProvedorsComponent {
  data!: any
  proveedors: Proveedor[]
  proveedorsTemp: Proveedor[]
  loading = false
  tipoContactos: TipoContacto[]
  tipoColores: TipoColor[]
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')


  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,

    private proveedorsService: ProveedorsService,
    private tipoColoresService: TipoColorsService,
    private tipoContactosService: TipoContactosService,
  ) {
    this.getCatalogos()
    this.getProveedors()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.proveedors = this.proveedorsTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.proveedorsTemp)
      this.proveedors = this.functionsService.filterBy(termino, this.proveedorsTemp)
    }, 500);
  }




  setProveedors() {
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
  getProveedors() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.proveedorsService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {

        this.proveedors = resp.proveedors

        this.proveedorsTemp = resp.proveedors
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Proveedores')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.proveedorsService.cargarProveedorsByEmail(usr).subscribe((resp: CargarProveedors) => {

        this.proveedors = resp.proveedors
        this.proveedorsTemp = resp.proveedors
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editProveedor(id: string) {

    this.functionsService.navigateTo(`/core/proveedores/editar-proveedor/true/${id}`)

  }
  isActived(proveedor: Proveedor) {

    this.proveedorsService.isActivedProveedor(proveedor).subscribe((resp: any) => {
      this.getProveedors()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Proveedores')

      })
  }
  viewProveedor(id: string) {
    this.functionsService.navigateTo(`/core/proveedores/editar-proveedor/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newProveedor() {

    this.functionsService.navigateTo('proveedores/crear-proveedor')
  }


  getContacto(id) {
    let tc = this.tipoContactos.filter((tc: any) => {
      if (tc.uid === id) {
        return tc
      }
    })
    return tc[0].icon
  }
  getColor(id) {
    return id
  }
  getCatalogos() {
    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = resp.tipoContactos

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de contactos')
      })
    this.tipoColoresService.cargarTipoColorsAll().subscribe((resp: CargarTipoColors) => {
      this.tipoColores = resp.tipoColors

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de colores')
      })
  }
}
