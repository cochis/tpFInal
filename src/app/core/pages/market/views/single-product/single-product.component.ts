import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item.model';
import { ItemsService } from 'src/app/core/services/item.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { SalonsService } from 'src/app/core/services/salon.service';
import { Salon } from 'src/app/core/models/salon.model';
import { MetaService } from 'src/app/core/services/meta.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent {
  uid = this.functionsService.getLocal('uid');
  id!: string;
  item: any;
  CP = environment.cPrimary;
  CS = environment.cSecond;
  CW = '#ffffff';
  cP: any = this.CP;
  cS: any = this.CS;
  PRODUCTO = environment.tiProducto;
  SERVICIO = environment.tiServicio;
  CLPR = environment.cProvedores;
  url = environment.base_url;
  mayor: any = 0;
  menor: any = 0;
  cantidadSelected = 0;
  opcSelected: any = null;
  public form!: FormGroup;
  today: number = this.functionsService.getToday();
  loading: boolean = false;
  viewImgOk = false;
  imgToView = '';
  tipoMediaView: string = '';
  titleToView: string = '';
  textToView: string = '';
  indexToView: number = 0;
  descripcionHTML: SafeHtml;
  descripcionPhotoHTML: SafeHtml;
  provLocation: any;
  tipoMedias: TipoMedia[];
  ContactoP = environment.contactosProveedor;
  isMap = false;
  tpFile = '';
  salon: Salon;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoMediasService: TipoMediasService,
    private sanitizer: DomSanitizer,
    private salonsService: SalonsService,

    private meta: Meta,
    private titleService: Title
  ) {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.getId(this.id);
      this.getCatalogos();
    });
  }


  ngOnInit(): void {
    const titulo = ` ${this.item.nombre} | My Ticket Party `
    const descripcion = `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.item.descripcion)}`

    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: this.url + '/upload/items/' + this.getImgPrincipal() },
      { property: 'og:url', content: 'https://www.myticketparty.com/home' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: this.url + '/upload/items/' + this.getImgPrincipal() },
      { name: 'slug', content: 'inicio' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }
  getCatalogos() {
    this.tipoMediasService.cargarTipoMediasAll().subscribe(
      (resp: CargarTipoMedias) => {
        this.tipoMedias = this.functionsService.getActivos(resp.tipoMedias);
      },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de medios');
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      item: [this.item],
      opcion: [''],
      cantidad: ['0'],
      usuario: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    });
  }

  onSubmit() { }

  opcSeleccion(itm, items) {
    const r = items.filter(res => res.nombre == itm.target.value);
    this.opcSelected = r[0];
    this.convertDes(this.opcSelected.descripcion);
  }

  viewPhoto(item, index) {
    this.indexToView = index;
    this.item.photos.forEach((pic: any) => {
      pic.isPrincipal = pic.img === item.img;
      if (pic.isPrincipal) {
        this.titleToView = pic.nombre;
        this.textToView = pic.descripcion;
        this.tipoMediaView = pic.tipoMedia;
        this.convertPhotoDes(pic.descripcion);
      }
    });
  }

  getUbicacion(id) {
    this.salonsService.cargarSalonById(id).subscribe(res => {
      if (res.salon.long && res.salon.lat) {
        this.provLocation = [res.salon.long, res.salon.lat];
      }
    });
  }

  convertDes(des: string, type?) {
    if (!des) {
      return this.descripcionHTML = this.sanitizer.bypassSecurityTrustHtml('');
    }

    const spl = des.split('\n');
    let desc = '<ul style="list-style:none;padding:0">';
    spl.forEach(element => {
      desc += `<li>${element}</li>`;
    });
    desc += '</ul>';

    const html = this.sanitizer.bypassSecurityTrustHtml(desc);
    return type ? html : (this.descripcionHTML = html);
  }

  convertPhotoDes(des: string) {
    if (!des) {
      return this.descripcionPhotoHTML = this.sanitizer.bypassSecurityTrustHtml('');
    }

    const spl = des.split('\n');
    let desc = '<ul style="list-style:none;padding:0">';
    spl.forEach(element => {
      desc += `<li>${element}</li>`;
    });
    desc += '</ul>';

    this.descripcionPhotoHTML = this.sanitizer.bypassSecurityTrustHtml(desc);
    return true
  }

  getId(id) {
    this.loading = true;
    this.itemsService.cargarItemById(id).subscribe((res: any) => {
      this.item = res.item;

      /*  const t: string = `My Ticket Party | ${this.item.nombre}`;
       this.title.setTitle(t);
 
       this.metaService.generateTags({
         title: `My Ticket Party| ${this.item.nombre}`,
         description: `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.item.descripcion)}`,
         keywords: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
         slug: 'core/faqs',
         colorBar: '#13547a',
         image: this.url + '/upload/items/' + this.getImgPrincipal(),
       });
  */
      if (this.item.proveedor.ubicaciones?.length > 0) {
        this.getUbicacion(this.item.proveedor.ubicaciones[0]);
      }

      this.isMap = this.item.proveedor.contactos.some(ct => ct.tipoContacto == this.ContactoP[2].value);

      this.item.photos.forEach((ph, i) => {
        if (ph.isPrincipal) {
          this.titleToView = ph.nombre;
          this.textToView = ph.descripcion;
          this.tipoMediaView = ph.tipoMedia;
          this.indexToView = i;
          this.convertPhotoDes(ph.descripcion);
        }
      });

      this.item.proveedor.colores.forEach(pv => {
        this.CLPR.forEach(cl => {
          if (pv.tipoColor === cl.value && cl.clave === 'cPrincipalWP') {
            this.cP = pv.value;
          } else if (pv.tipoColor === cl.value && cl.clave === 'cSecondWP') {
            this.cS = pv.value;
          }
        });
      });

      this.createForm();
      setTimeout(() => this.loading = false, 100);
    });
  }

  mayorMenor(items, type) {
    this.menor = items[0].precio;
    items.forEach(it => {
      if (type === 'mayor') {
        if (this.mayor < it.precio) this.mayor = it.precio;
      } else {
        if (it.precio < this.menor) this.menor = it.precio;
      }
    });
    return type === 'mayor' ? this.mayor : this.menor;
  }

  getImgPrincipal() {
    return this.item.photos.find((pic: any) => pic.isPrincipal)?.img;
  }

  setCarrito(opcSelected) {
    if (!this.uid) {
      this.functionsService.alert('Carrito', 'Tienes que ingresar a tu cuenta para hacer una cotización', 'info');
      this.functionsService.navigateTo('/auth/login');
      return;
    }

    this.form.value.usuario = this.uid || '';

    if (opcSelected && this.cantidadSelected > 0) {
      const car = { ...this.form.value, idItem: this.id };
      let carrito = this.functionsService.getLocal('carrito') || [];
      carrito.push(car);
      this.functionsService.setLocal('carrito', carrito);

      this.cantidadSelected = 0;
      this.form.reset();
      this.createForm();
      this.goToCarrito();
    } else {
      this.functionsService.alertError(null, 'Favor de seleccionar  una opción o cantidad errónea');
    }
  }

  back() {
    this.router.navigate(['/core/market']);
  }

  setCantidad(event) {
    this.cantidadSelected = event.target.value;
  }

  goToCarrito() {
    Swal.fire({
      title: '¿Ir al carrito o continuar con la compra?',
      showDenyButton: true,
      confirmButtonColor: '#13547a',
      denyButtonColor: '#80d0c7',
      confirmButtonText: 'Carrito',
      denyButtonText: 'Marketplace'
    }).then(result => {
      this.functionsService.alert('Elemento guardado', 'satisfactoriamente', 'success');
      const path = result.isConfirmed ? '/core/market/carrito' : '/core/market';
      this.functionsService.navigateTo(path);
    });
  }

  viewImg(photo?: any, tpFile?: any) {
    this.tpFile = tpFile;
    this.viewImgOk = !this.viewImgOk;
    if (photo) this.imgToView = photo;
  }

  navigateT0(url: string) {
    this.functionsService.navigateTo(url);
  }
}