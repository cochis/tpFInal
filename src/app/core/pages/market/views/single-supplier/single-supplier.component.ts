import { Component, OnInit } from '@angular/core';
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
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { MetaService } from 'src/app/core/services/meta.service';
import { Red } from 'src/app/core/models/red.model';
import { RedesService } from 'src/app/core/services/red.service';
@Component({
  selector: 'app-single-supplier',
  templateUrl: './single-supplier.component.html',
  styleUrls: ['./single-supplier.component.scss']
})
export class SingleSupplierComponent implements OnInit {
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

    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private proveedorsService: ProveedorsService,
    private tipoContactosService: TipoContactosService,
    private functionsService: FunctionsService,
    private redesService: RedesService,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private titleService: Title,
    private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {

      this.id = params.id
      this.getCatalogos()
      this.getId(this.id)
    })
    this.CLPR.forEach(cl => {
      if (cl.clave == 'cPrincipalWP') {

        this.CP = cl.value

      } else {
        this.CS = cl.value

      }
    });


  }
  ngOnInit() {
    this.functionsService.removeTags()

    this.titleService.setTitle(`My Ticket Party | ${this.proveedor.nombre}`);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.proveedor.descripcion)}` },
      { name: 'keywords', content: 'MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: `My Ticket Party| ${this.proveedor.nombre}` },
      { property: 'og:description', content: `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.proveedor.descripcion)}` },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `My Ticket Party| ${this.proveedor.nombre}` },
      { name: 'twitter:description', content: `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.proveedor.descripcion)}` },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: '/' },
      { name: 'colorBar', content: '#13547a' },
    ]);







  }
  back(): void {
    this.router.navigate(['/core/market']);
  }

  getId(id) {
    this.loading = true
    this.proveedorsService.cargarProveedorById(id).subscribe(res => {

      this.proveedor = res.proveedor




      let t: string = `My Ticket Party | ${this.proveedor.nombre}`;
      this.title.setTitle(t);














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
