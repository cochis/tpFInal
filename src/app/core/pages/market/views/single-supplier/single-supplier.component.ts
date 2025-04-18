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
import { CargarRedes, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { MetaService } from 'src/app/core/services/meta.service';
import { Red } from 'src/app/core/models/red.model';
import { RedesService } from 'src/app/core/services/red.service';
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
  calificacionProveedor = 0
  descripcionHTML: SafeHtml;
  redesAll: Red[]
  constructor(
    private metaService: MetaService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private proveedorsService: ProveedorsService,
    private tipoContactosService: TipoContactosService,
    private functionsService: FunctionsService,
    private redesService: RedesService,
    private sanitizer: DomSanitizer,

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
  back(): void {
    this.router.navigate(['/core/market']);
  }

  getId(id) {
    this.loading = true
    this.proveedorsService.cargarProveedorById(id).subscribe(res => {
      console.log('res::: ', res);
      this.proveedor = res.proveedor
      console.log('this.proveedor::: ', this.proveedor);



      let t: string = `My Ticket Party | ${this.proveedor.nombre}`;
      this.title.setTitle(t);

      this.metaService.generateTags({
        title: `My Ticket Party| ${this.proveedor.nombre}`,
        description:
          `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.proveedor.descripcion)}`,
        keywords:
          'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
        slug: 'core/faqs',
        colorBar: '#13547a',
        image: this.url + '/upload/proveedores/' + this.proveedor.img,
      });













      this.itemsService.cargarItemsByProovedor(this.proveedor.uid).subscribe(res => {
        this.items = this.functionsService.getActivos(res.items)


        var cals = 0
        this.items.forEach((it) => {
          if (it.promedioCalificacion && (Number(it.promedioCalificacion) > 0)) {
            cals = cals + 1
            this.calificacionProveedor = this.calificacionProveedor + Number(it.promedioCalificacion)
          }

        });
        this.calificacionProveedor = this.calificacionProveedor / cals

        setTimeout(() => {
          this.loading = false
        }, 800);

      })


    })
  }

  getRed(red) {


    let rd = this.redesAll.filter(res => {

      return res.uid == red.red
    })
    return rd[0]
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
    this.redesService.cargarRedesAll().subscribe((resp: CargarRedes) => {
      this.redesAll = this.functionsService.getActivos(resp.redes)





    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Contactos')
        this.loading = false
      })


  }

  convertDes(des: string) {
    return this.sanitizer.bypassSecurityTrustHtml(des);




  }

}
