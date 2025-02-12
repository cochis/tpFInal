import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item.model';
import { ItemsService } from 'src/app/core/services/item.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements AfterViewInit {
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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private functionsService: FunctionsService,

  ) {

    this.id = this.route.snapshot.params['id']
    this.getId(this.id)
  }
  ngAfterViewInit() {


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

  }
  viewPhoto(id) {

    this.item.photos.forEach((pic: any) => {
      if (pic.img === id) {
        pic.isPrincipal = true
      } else {
        pic.isPrincipal = false
      }
    });
  }
  getId(id) {
    this.loading = true
    this.itemsService.cargarItemById(id).subscribe((res: any) => {

      this.item = res.item

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
    if (type == 'mayor') {

      for (var i = 0; i < items.length; i++) {
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
    this.form.value.usuario = (this.functionsService.getLocal('uid')) ? this.functionsService.getLocal('uid') : ''


    if (opcSelected !== null && this.cantidadSelected !== 0) {
      if (this.functionsService.getLocal('carrito')) {
        let carrito = this.functionsService.getLocal('carrito')

        carrito.push(this.form.value)
        this.functionsService.setLocal('carrito', carrito)

        this.cantidadSelected = 0
        this.form.reset()
        this.createForm()

      } else {
        let carrito = []

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
}
