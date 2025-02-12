import { AfterViewInit, Component } from '@angular/core';
import { ItemsService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { FunctionsService } from '../../../shared/services/functions.service';
import { CategoriaItemsService } from '../../services/categoriaItem.service';
import { CategoriaItem } from '../../models/categoriaItem.model';
import { CargarCategoriaItems } from '../../interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements AfterViewInit {


  items: Item[] = []
  /*  [
   {
     uid: '1',
     tipo: 'P',
     typeSell: 'Cantidad',
     name: 'Ramo de rosas',
     proveedor: { name: "Floreria madeira" },
     categoria: 'Flores',
     isBySize: true,
     isByService: false,
     sizes: [
       {
         name: 'Chico',
         precio: '150',
         moneda: 'MXN'
       },
       {
         name: 'Mediano',
         precio: '250',
         moneda: 'MXN'
       },
       {
         name: 'Grande',
         precio: '350',
         moneda: 'MXN'
       },
     ],
     isByColor: true,
     colores: [
       'B5828C',
       'B82132',
       '3B6790',
       'A31D1D',

     ],
     photos: [
       {
         isPrincipal: true,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores1.jpeg"
       },

       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores4.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores5.jpeg"
       }

     ],
     idealTo: ['XV años', 'Bautizo', '14 de Febrero'],
     calificacion: 1,

   },
   {
     uid: '2',
     tipo: 'P',
     typeSell: 'Cantidad',
     name: 'Eventos',
     proveedor: { name: "Salon de fiestas" },
     categoria: 'Flores',
     isBySize: true,
     isByService: false,
     sizes: [
       {
         name: 'Chico',
         precio: '150',
         moneda: 'MXN'
       },
       {
         name: 'Mediano',
         precio: '250',
         moneda: 'MXN'
       },
       {
         name: 'Grande',
         precio: '350',
         moneda: 'MXN'
       },
     ],
     isByColor: true,
     colores: [
       'B5828C',

     ],
     photos: [
       {
         isPrincipal: true,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores2.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores1.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores3.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         url: "assets/icons/flores4.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores5.jpeg"
       }

     ],
     idealTo: ['XV años', 'Bautizo', '14 de Febrero'],
     calificacion: 5
   },
   {
     uid: '3',
     tipo: 'P',
     typeSell: 'Cantidad',
     proveedor: { name: "Peluches" },
     name: 'Peluche',
     categoria: 'Peluche',
     isBySize: true,
     sizes: [
       {
         name: 'Chico',
         precio: '150',
         moneda: 'MXN'
       },
       {
         name: 'Mediano',
         precio: '250',
         moneda: 'MXN'
       },
       {
         name: 'Grande',
         precio: '350',
         moneda: 'MXN'
       },
     ],
     isByColor: false,
     colores: [],
     photos: [
       {
         isPrincipal: true,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores3.jpeg"
       },

       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores2.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores4.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores5.jpeg"
       }

     ],
     idealTo: ['XV años', 'Bautizo', '14 de Febrero'],
     calificacion: 3
   },
   {

     uid: '4',
     tipo: 'P',
     name: 'Dulces',
     typeSell: 'Cantidad',
     proveedor: { name: "Dulces" },
     categoria: 'Dulces',
     isBySize: true,
     isByService: false,
     sizes: [
       {
         name: 'Chico',
         precio: '150',
         moneda: 'MXN'
       },
       {
         name: 'Mediano',
         precio: '250',
         moneda: 'MXN'
       },
       {
         name: 'Grande',
         precio: '350',
         moneda: 'MXN'
       },
     ],
     isByColor: true,
     colores: [
       'B5828C',
       'B82132',

       '809D3C',
     ],
     photos: [
       {
         isPrincipal: true,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores4.jpeg"
       },


     ],
     idealTo: ['XV años', 'Bautizo', '14 de Febrero'],
     calificacion: 2
   },
   {
     uid: '5',
     tipo: 'P',
     typeSell: 'Cantidad',
     name: 'Fotos',
     proveedor: { name: "Fotos" },

     categoria: 'Fotos',
     isBySize: true,
     isByService: false,
     sizes: [
       {
         name: 'Chico',
         precio: '150',
         moneda: 'MXN'
       },
       {
         name: 'Mediano',
         precio: '250',
         moneda: 'MXN'
       },
       {
         name: 'Grande',
         precio: '350',
         moneda: 'MXN'
       },
     ],
     isByColor: true,
     colores: [
       'B5828C',
       'B82132',
       '3B6790',
       'A31D1D',
       'E16A54',
       '809D3C',
     ],
     photos: [
       {
         isPrincipal: true,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores5.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores1.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores2.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores3.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores4.jpeg"
       }

     ],
     idealTo: ['XV años', 'Bautizo', '14 de Febrero'],
     calificacion: 0
   },
   {
     uid: '6',
     tipo: 'S',
     typeSell: 'Servicios',
     name: 'Peinados',
     proveedor: { name: "Estetica Fantasy" },

     categoria: 'Astethic',
     isBySize: false,
     isByService: true,
     sizes: [],
     isByColor: false,
     colores: [],
     photos: [
       {
         isPrincipal: true,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores5.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores1.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores2.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores3.jpeg"
       },
       {
         isPrincipal: false,
         color: 'B5828C',
         size: 'Mediano',
         type: 'img',
         url: "assets/icons/flores4.jpeg"
       }

     ],
     idealTo: ['XV años', 'Bautizo', '14 de Febrero'],
     calificacion: 0
   },

 ] */
  categoriaItems: CategoriaItem[]
  loading: boolean = false
  constructor(
    private itemsService: ItemsService,
    private categoriaItemsService: CategoriaItemsService,
    private functionsService: FunctionsService
  ) {
    this.getItems()
  }
  ngAfterViewInit() {

  }


  getItems() {
    this.itemsService.cargarItemsAll().subscribe(res => {
      this.items = this.functionsService.getActivos(res.items)


    })
  }

  getCatalogos() {
    this.loading = true

    this.categoriaItemsService.cargarCategoriaItemsAll().subscribe((resp: CargarCategoriaItems) => {
      this.categoriaItems = resp.categoriaItems

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Perfil')
        this.loading = false
      })


  }
  orderBy(value) {

    switch (value.target.value) {
      case 'categoria':



      default:
        break;
    }

  }
}
