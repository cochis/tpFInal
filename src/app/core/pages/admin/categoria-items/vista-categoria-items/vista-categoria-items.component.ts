import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { CategoriaItemsService } from 'src/app/core/services/categoriaItem.service';
import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';
import { CargarCategoriaItems } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-categoria-items',
  templateUrl: './vista-categoria-items.component.html',
  styleUrls: ['./vista-categoria-items.component.scss']
})
export class VistaCategoriaItemsComponent {
  data!: any
  categoriaItems: CategoriaItem[] = []
  categoriaItemsTemp: CategoriaItem[] = []
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

    private categoriaItemsService: CategoriaItemsService
  ) {
    this.getCategoriaItems()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.categoriaItems = this.categoriaItemsTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.categoriaItemsTemp)
      this.categoriaItems = this.functionsService.filterBy(termino, this.categoriaItemsTemp)
    }, 500);
  }

  getCategoriaItems() {
    this.loading = true

    this.categoriaItemsService.cargarCategoriaItemsAll().subscribe((resp: CargarCategoriaItems) => {



      this.categoriaItems = resp.categoriaItems
      this.categoriaItemsTemp = resp.categoriaItems
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        console.error('error::: ', error);
        this.loading = false
        this.functionsService.alertError(error, 'Categoría de Items')
      });

  }

  editCategoriaItem(id: string) {

    this.functionsService.navigateTo(`categoria-items/editar-categoria-item/true/${id}`)

  }
  isActived(categoriaItem: CategoriaItem) {

    this.categoriaItemsService.isActivedCategoriaItem(categoriaItem).subscribe((resp: any) => {
      this.getCategoriaItems()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Categoria de Items')

      })
  }
  viewCategoriaItem(id: string) {
    this.functionsService.navigateTo(`categoria-items/editar-categoria-item/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newCategoriaItem() {

    this.functionsService.navigateTo('categoria-items/crear-categoria-item')
  }

}

