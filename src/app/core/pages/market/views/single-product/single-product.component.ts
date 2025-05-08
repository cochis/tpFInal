import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item.model';
import { ItemsService } from 'src/app/core/services/item.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
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
  uid = this.functionsService.getLocal('uid')
  id!: string
  item: any
  CP = environment.cPrimary
  CS = environment.cSecond
  CW = '#ffffff'
  cP: any = this.CP;
  cS: any = this.CS;
  PRODUCTO = environment.tiProducto
  SERVICIO = environment.tiServicio
  CLPR = environment.cProvedores
  url = environment.base_url
  mayor: any = 0
  menor: any = 0
  cantidadSelected = 0
  opcSelected: any = null
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  loading: boolean = false
  viewImgOk = false
  imgToView = ''
  tipoMediaView: string = ''
  titleToView: string = ''
  textToView: string = ''
  indexToView: number = 0
  descripcionHTML: SafeHtml;
  descripcionPhotoHTML: SafeHtml;
  provLocation: any
  tipoMedias: TipoMedia[]
  ContactoP = environment.contactosProveedor
  isMap = false
  tpFile = ''
  salon: Salon
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoMediasService: TipoMediasService,
    private sanitizer: DomSanitizer,
    private salonsService: SalonsService,
    private metaService: MetaService,
    private title: Title,
  ) {









    this.getCatalogos()
    this.id = this.route.snapshot.params['id']
    this.getId(this.id)

  }
  getCatalogos() {
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {
      this.tipoMedias = this.functionsService.getActivos(resp.tipoMedias)



    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de medios')
      })

  }
  createForm() {
    this.form = this.fb.group({
      item: [this.item],
      opcion: [''],
      cantidad: ['0'],
      usuario: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })

  }
  onSubmit() {

  }
  opcSeleccion(itm, items) {
    let r = items.filter((res) => { return res.nombre == itm.target.value })
    this.opcSelected = r[0]

    this.convertDes(this.opcSelected.descripcion)
  }
  viewPhoto(item, index) {


    this.indexToView = index

    this.item.photos.forEach((pic: any) => {
      if (pic.img === item.img) {
        this.titleToView = pic.nombre
        this.textToView = pic.descripcion
        this.tipoMediaView = pic.tipoMedia
        this.convertPhotoDes(pic.descripcion)

        pic.isPrincipal = true
      } else {
        pic.isPrincipal = false
      }
    });
  }
  getUbicacion(id) {

    this.salonsService.cargarSalonById(id).subscribe(res => {

      if (res.salon.long && res.salon.lat) {

        this.provLocation = [res.salon.long, res.salon.lat]

      }

    })
  }
  convertDes(des: string, type?) {
    if (!type) {

      if (des) {
        let spl = des.split('\n')
        var desc = '<ul style="list-style:none;padding:0">'
        spl.forEach(element => {
          desc += `<li>${element}</li>`


        });
        desc += '</ul>'

        this.descripcionHTML = this.sanitizer.bypassSecurityTrustHtml(desc);


      } else {
        this.descripcionHTML = this.sanitizer.bypassSecurityTrustHtml('');

      }
      return this.descripcionHTML
    } else {

      let spl = des.split('\n')
      var desc = '<ul style="list-style:none;padding:0">'
      spl.forEach(element => {
        desc += `<li>${element}</li>`


      });
      desc += '</ul>'



      return this.sanitizer.bypassSecurityTrustHtml(desc);


    }



  }
  convertPhotoDes(des: string) {

    if (des) {
      let spl = des.split('\n')
      var desc = '<ul style="list-style:none;padding:0">'
      spl.forEach(element => {
        desc += `<li>${element}</li>`


      });
      desc += '</ul>'

      this.descripcionPhotoHTML = this.sanitizer.bypassSecurityTrustHtml(desc);

    } else {
      this.descripcionPhotoHTML = this.sanitizer.bypassSecurityTrustHtml('');

    }



  }

  getId(id) {
    this.loading = true
    this.itemsService.cargarItemById(id).subscribe((res: any) => {

      this.item = res.item



      let t: string = `My Ticket Party | ${this.item.nombre}`;
      this.title.setTitle(t);

      this.metaService.generateTags({
        title: `My Ticket Party| ${this.item.nombre}`,
        description:
          `Descripción del producto : ${this.functionsService.convertDesSinHtml(this.item.descripcion)}`,
        keywords:
          'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
        slug: 'core/faqs',
        colorBar: '#13547a',
        image: this.url + '/upload/items/' + this.getImgPrincipal(),
      });









      if (this.item.proveedor.ubicaciones && this.item.proveedor.ubicaciones.length > 0) {

        this.getUbicacion(this.item.proveedor.ubicaciones[0])
      }

      this.item.proveedor.contactos.forEach(ct => {
        if (ct.tipoContacto == this.ContactoP[2].value) {
          this.isMap = true
        }

      });




      this.item.photos.forEach((ph, i) => {
        if (ph.isPrincipal) {
          this.titleToView = ph.nombre
          this.textToView = ph.descripcion
          this.tipoMediaView = ph.tipoMedia
          this.indexToView = i
          this.convertPhotoDes(ph.descripcion)

        }

      });

      this.item.proveedor.colores.forEach(pv => {

        this.CLPR.forEach(cl => {

          if (pv.tipoColor === cl.value && cl.clave === 'cPrincipalWP') {
            this.cP = pv.value
          } else if (pv.tipoColor === cl.value && cl.clave === 'cSecondWP') {

            this.cS = pv.value
          }

        });
      });
      this.createForm()
      setTimeout(() => {

        this.loading = false
      }, 100);

    })
  }
  mayorMenor(items, type) {
    this.menor = items[0].precio
    if (type == 'mayor') {
      for (var i = 0; i < items.length; i++) {

        if (i == 0) {

          this.menor = items[i].precio
        }
        if (this.mayor < items[i].precio) {
          this.mayor = items[i].precio;
        }

      }

      return this.mayor

    } else {

      for (var i = 0; i < items.length; i++) {


        if (items[i].precio < this.mayor) {
          this.menor = items[i].precio;
        }
      }


      return this.menor
    }


  }
  getImgPrincipal() {

    let fotos = this.item.photos.filter((pic: any) => { return pic.isPrincipal })
    let foto: any = fotos[0]

    return foto.img
  }


  setCarrito(opcSelected) {

    if (this.uid == '') {
      this.functionsService.alert('Carrito', 'Tienes que ingresar a tu cuenta para hacer una cotización', 'info')
      this.functionsService.navigateTo('/auth/login')
      return
    }
    this.form.value.usuario = (this.functionsService.getLocal('uid')) ? this.functionsService.getLocal('uid') : ''


    if (opcSelected !== null && this.cantidadSelected !== 0) {
      if (this.functionsService.getLocal('carrito')) {
        let carrito = this.functionsService.getLocal('carrito')
        let car = {
          ...this.form.value,
          idItem: this.id
        }
        carrito.push(car)
        this.functionsService.setLocal('carrito', carrito)

        this.cantidadSelected = 0
        this.form.reset()
        this.createForm()

      } else {
        let carrito = []
        let car = {
          ...this.form.value,
          idItem: this.id
        }
        carrito.push(this.form.value)

        this.functionsService.setLocal('carrito', carrito)

        this.cantidadSelected = 0
        this.form.reset()
        this.createForm()


      }
      this.goToCarrito()
    } else {


      this.functionsService.alertError(null, 'Favor de seleccionar  una opción o cantidad errónea')
    }


  }
  back() {


    this.router.navigate(['/core/market']);
  }
  setCantidad(event) {

    this.cantidadSelected = event.target.value
  }
  goToCarrito() {
    Swal.fire({
      title: "¿Ir al carrito o continuar con la compra?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: "#13547a",
      denyButtonColor: '#80d0c7',
      confirmButtonText: "Carrito",
      denyButtonText: `Marketplace`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.functionsService.alert('Elemento guardado', 'satisfactoriamente', 'success')

        this.functionsService.navigateTo('/core/market/carrito')
      } else if (result.isDenied) {
        this.functionsService.alert('Elemento guardado', 'satisfactoriamente', 'success')

        this.functionsService.navigateTo('/core/market')

      }
    });
  }
  viewImg(photo?: any, tpFile?: any) {

    this.tpFile = tpFile



    this.viewImgOk = !this.viewImgOk
    if (photo != '') {

      this.imgToView = photo

    }

  }
}
