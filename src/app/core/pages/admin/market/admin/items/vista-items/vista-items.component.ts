import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/core/models/item.model';
import { CargarItems, CargarTipoColors, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { ItemsService } from 'src/app/core/services/item.service';
@Component({
  selector: 'app-vista-items',
  templateUrl: './vista-items.component.html',
  styleUrls: ['./vista-items.component.css']
})
export class VistaItemsComponent {
  data!: any
  items: Item[]
  itemsTemp: Item[]
  loading = false
  tipoContactos: TipoContacto[]
  tipoColores: TipoColor[]
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  PRV = environment.prv_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private itemsService: ItemsService,
    private tipoColoresService: TipoColorsService,
    private tipoContactosService: TipoContactosService,
  ) {
    this.getCatalogos()
    this.getItems()
  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.items = this.itemsTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.itemsTemp)
      this.items = this.functionsService.filterBy(termino, this.itemsTemp)
    }, 500);
  }




  setItems() {
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
  getItems() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.itemsService.cargarItemsAll().subscribe((resp: CargarItems) => {

        this.items = resp.items


        this.itemsTemp = resp.items
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Productos o Servicios')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF || this.rol == this.PRV) {
      let usr = this.functionsService.getLocal('uid')
      this.itemsService.cargarItemsByEmail(usr).subscribe((resp: CargarItems) => {

        this.items = this.functionsService.getActivos(resp.items)
        this.itemsTemp = resp.items

        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }
  getPrecio(item) {
    if (item.isByCantidad) {
      return 'Precio por cantidad'
    } else if (item.isByColor) {
      return 'Precio por color'

    } else if (item.isBySize) {
      return 'Precio por tamaño'

    } else if (item.isByService) {
      return 'Precio por  servicio'

    } else {
      return 'Sin eleccion'

    }
  }

  cantidadProductos(item) {
    if (item.isByCantidad) {
      return item.cantidades.length


    } else if (item.isByColor) {
      return item.colores.length
    } else if (item.isBySize) {
      return item.sizes.length
    } else if (item.isByService) {
      return item.servicios.length

    } else {
      return 'Sin servicios'

    }

  }
  editItem(id: string) {

    this.functionsService.navigateTo(`/core/items/editar-item/true/${id}`)

  }
  isActived(item: Item) {

    this.itemsService.isActivedItem(item).subscribe((resp: any) => {
      this.getItems()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Productos o Servicios')

      })
  }
  viewItem(id: string) {
    this.functionsService.navigateTo(`/core/items/editar-item/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newItem() {

    this.functionsService.navigateTo('core/items/crear-item')
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

  getPrincipal(item) {

    if (item.photos.length > 0) {

      let r = item.photos.filter(ph => {

        return ph.isPrincipal == true
      })

      return r[0].img
    } else {
      return ''
    }

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
