import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from '../../../../models/proveedor.model';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';
import { ItemsService } from 'src/app/core/services/item.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Item } from 'src/app/core/models/item.model';
import { TipoContactosService } from '../../../../services/tipoContacto.service';
import { CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';

@Component({
  selector: 'app-single-supplier',
  templateUrl: './single-supplier.component.html',
  styleUrls: ['./single-supplier.component.css']
})
export class SingleSupplierComponent {
  id!: string
  proveedor: Proveedor
  CTPR: any = environment.contactosProveedor
  tipoContactos: TipoContacto[]
  PRODUCTO = environment.tiProducto
  SERVICIO = environment.tiServicio
  url = environment.base_url
  today: Number = this.functionsService.getToday()
  loading: boolean = false
  items: Item[] = []
  CLPR = environment.cProvedores
  CP: string;
  CS: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private proveedorsService: ProveedorsService,
    private tipoContactosService: TipoContactosService,
    private functionsService: FunctionsService,
    private fb: FormBuilder) {
    this.CLPR.forEach(cl => {
      if (cl.clave == 'cPrincipalWP') {

        this.CP = cl.value

      } else {
        this.CS = cl.value

      }
    });
    this.id = this.route.snapshot.params['id']
    this.getCatalogos()
    this.getId(this.id)

  }
  /*  items = [
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
  back(): void {


    this.router.navigate(['/core/market']);
  }

  getId(id) {
    this.loading = true
    this.proveedorsService.cargarProveedorById(id).subscribe(res => {

      this.proveedor = res.proveedor

      this.itemsService.cargarItemsByProovedor(this.proveedor.uid).subscribe(res => {

        this.items = this.functionsService.getActivos(res.items)

        this.proveedor.colores.forEach(pv => {

          this.CLPR.forEach(cl => {


          });
        });
      })
      setTimeout(() => {

        this.loading = false
      }, 1000);

    })
  }


  getColor(type, colors) {


    var color = ''
    if (type === 'P') {
      colors.forEach(cl => {

        if (cl.tipoColor == this.CP) {
          color = cl.value
        }
      });
    } else {
      colors.forEach(cl => {

        if (cl.tipoColor == this.CS) {
          color = cl.value
        }
      });
    }

    return color

  }

  getContact(contacto: any) {


    var res: any = {}
    if (this.tipoContactos) {

      this.tipoContactos.forEach(ct => {

        if (ct.uid === contacto.tipoContacto) {

          res = ct

        }
      });

      return res
    }


  }
  getCatalogos() {
    this.loading = true

    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = this.functionsService.getActivos(resp.tipoContactos)





    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Contactos')
        this.loading = false
      })


  }

}
