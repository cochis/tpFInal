import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoItemsService } from 'src/app/core/services/tipoItem.service';
import { TipoItem } from 'src/app/core/models/tipoItem.model';
import { CargarTipoItems } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-tipo-items',
  templateUrl: './vista-tipo-items.component.html',
  styleUrls: ['./vista-tipo-items.component.scss']
})
export class VistaTipoItemsComponent {
  data!: any
  tipoItems: TipoItem[] = []
  tipoItemsTemp: TipoItem[] = []
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

    private tipoItemsService: TipoItemsService
  ) {
    this.getTipoItems()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoItems = this.tipoItemsTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoItemsTemp)
      this.tipoItems = this.functionsService.filterBy(termino, this.tipoItemsTemp)
    }, 500);
  }

  getTipoItems() {
    this.loading = true

    this.tipoItemsService.cargarTipoItemsAll().subscribe((resp: CargarTipoItems) => {



      this.tipoItems = resp.tipoItems

      this.tipoItemsTemp = resp.tipoItems
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.alertError(error, 'Tipo de Items')
      });

  }

  editTipoItem(id: string) {

    this.functionsService.navigateTo(`tipo-items/editar-tipo-item/true/${id}`)

  }
  isActived(tipoItem: TipoItem) {

    this.tipoItemsService.isActivedTipoItem(tipoItem).subscribe((resp: any) => {
      this.getTipoItems()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo de Items')

      })
  }
  viewTipoItem(id: string) {
    this.functionsService.navigateTo(`tipo-items/editar-tipo-item/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoItem() {

    this.functionsService.navigateTo('tipo-items/crear-tipo-item')
  }

}

