import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  uid = this.functionsService.getLocal('uid')
  isLogin = false
  loading: boolean = false
  carrito: any = []
  usuario: Usuario = undefined
  url = environment.base_url
  today: Number = this.functionsService.getToday()
  todayDate = this.functionsService.numberToDate(this.today)
  isPago: boolean = false
  isCotizacion: boolean = false
  public form!: FormGroup
  public formCot!: FormGroup
  tipoContactos: TipoContacto[]
  proveedores = []
  qr = {
    data: {
      nombreAnf: "OSCAR ALEJANDRO",
      apellidoPatAnf: "RAMIREZ",
      apellidoMatAnf: "ROSAS",
      isAnfitironFestejado: false,
      nombreFes: "",
      apellidoPatFes: "",
      apellidoMatFes: "",


    },
    img: 'http://localhost:3008/api/upload/items/18249c35-b348-4eea-b10a-c8d521f01d06.jpg',
    colorP: '#13547a',
    colorB: '#80d0c7'
  }
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private tipoContactosService: TipoContactosService,
    private router: Router,) {

    this.getUser()
    this.getCatalogos()
    this.createForm()

  }
  ngOnInit(): void {
    this.loading = true

    setTimeout(() => {
      if (this.functionsService.getLocal('uid')) {
        this.isLogin = true
        this.loading = false
      }
      this.carrito = (this.functionsService.getLocal('carrito')) ? this.functionsService.getLocal('carrito') : []
      this.setForm(this.carrito)
      this.uniqueObj()
    }, 500);
  }


  createForm() {
    this.form = this.fb.group({

      fechaEvento: [''],
      carritos: this.fb.array([]),

      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  get carritos(): FormArray {
    return this.form.get('carritos') as FormArray
  }
  setForm(carritos: any) {

    setTimeout(() => {
      this.loading = true
      this.form = this.fb.group({
        fechaEvento: [''],
        carritos: this.fb.array([]),
        activated: [(carritos.activated) ? carritos.activated : false],
        dateCreated: [this.today],
        lastEdited: [this.today],
      })

      carritos.forEach(car => {

        this.carritos.push(this.setCar(car))
      });



      this.loading = false
    }, 500);
  }
  setCar(car: any): FormGroup {

    var precio = 0
    switch (car.item.isSelectedBy) {
      case 'isByCantidad':
        car.item.cantidades.forEach((opc: any) => {
          if (opc.nombre == car.opcion) {
            precio = opc.precio
          }
        });
        break;
      case 'isByColor':
        car.item.colores.forEach((opc: any) => {
          if (opc.nombre == car.opcion) {
            precio = opc.precio
          }
        });
        break;
      case 'isByService':
        car.item.servicios.forEach((opc: any) => {
          if (opc.nombre == car.opcion) {
            precio = opc.precio
          }
        });
        break;
      case 'isBySize':
        car.item.sizes.forEach((opc: any) => {
          if (opc.nombre == car.opcion) {
            precio = opc.precio
          }
        });
        break;

      default:
        precio = 0
        break;
    }




    return this.fb.group({

      cantidad: [car.cantidad, [Validators.required]],
      nombre: [car.item.nombre, [Validators.required]],
      precio: [precio, [Validators.required]],
      item: [car.item, [Validators.required]],
      opcion: [car.opcion, [Validators.required]]

    })
  }
  addCarrito() {
    this.carritos.push(this.newCarrito())

  }
  removeCarrito(i: number) {
    this.carritos.removeAt(i);
    this.changeValor()
  }
  newCarrito(): FormGroup {
    return this.fb.group({
      cantidad: ['', [Validators.required]],
      item: ['', [Validators.required]],
      opcion: ['', [Validators.required]]
    })
  }

  getImagen(photos) {

    var img = ''

    photos.forEach(im => {

      if (im.isPrincipal) {
        img = im.img
      }

    });


    return img
  }
  getTotal(item, opcion, cantidad) {

    var cant = 0

    if (item.isByCantidad) {
      item.cantidades.forEach(cat => {

        if (cat.nombre == opcion) {
          cant = cat.precio
        }
      });
      return cant * cantidad

    } else if (item.isByColor) {
      item.colores.forEach(cat => {

        if (cat.nombre == opcion) {
          cant = cat.precio
        }
      });
      return cant * cantidad

    } else if (item.isByService) {
      item.servicios.forEach(cat => {

        if (cat.nombre == opcion) {
          cant = cat.precio
        }
      });
      return cant * cantidad

    } else if (item.isBySize) {
      item.sizes.forEach(cat => {

        if (cat.nombre == opcion) {
          cant = cat.precio
        }
      });
      return cant * cantidad
    } else {
      this.functionsService.alertError(null, 'Favor de contactar con el proveedor')
      return 'no hay precio'
    }
  }
  getAllTotal() {
    var total = 0
    if (this.carrito.length > 0) {
      this.carrito.forEach((car) => {
        if (car.item.isByCantidad) {
          car.item.cantidades.forEach(cat => {

            if (cat.nombre == car.opcion) {


              total += (cat.precio * car.cantidad)
            }
          });


        } else if (car.item.isByColor) {
          car.item.colores.forEach(cat => {

            if (cat.nombre == car.opcion) {

              total += (cat.precio * car.cantidad)
            }
          });


        } else if (car.item.isByService) {
          car.item.servicios.forEach(cat => {

            if (cat.nombre == car.opcion) {

              total += (cat.precio * car.cantidad)
            }
          });


        } else if (car.item.isBySize) {
          car.item.sizes.forEach(cat => {

            if (cat.nombre == car.opcion) {

              total += (cat.precio * car.cantidad)
            }
          });

        }
      });
      return total
    } else {

      return total
    }

  }

  getPrecio(item, opcion) {
    var precio = 0
    if (item.isByCantidad) {
      item.cantidades.forEach(cat => {
        if (cat.nombre == opcion) {
          precio = cat.precio
        }
      });
      return precio
    } else if (item.isByColor) {
      item.colores.forEach(cat => {
        if (cat.nombre == opcion) {
          precio = cat.precio
        }
      });
      return precio
    } else if (item.isByService) {
      item.servicios.forEach(cat => {
        if (cat.nombre == opcion) {
          precio = cat.precio
        }
      });
      return precio
    } else if (item.isBySize) {
      item.sizes.forEach(cat => {
        if (cat.nombre == opcion) {
          precio = cat.precio
        }
      });


      return precio
    } else {
      this.functionsService.alertError(null, 'Favor de contactar con el proveedor')
      return 'no hay precio'
    }
  }
  back() {


    this.router.navigate(['/core/market']);
  }

  isCheckout() {
    this.loading = true

    this.createFormCot()



    setTimeout(() => {

      this.isCotizacion = !this.isCotizacion
      this.isPago = !this.isPago
      this.loading = false
    }, 100);

  }

  cotizar() {
    let cotiza = []

    this.proveedores.forEach(prv => {
      let proveedor = []
      this.carrito.forEach(car => {
        if (car.item.proveedor._id == prv) {
          proveedor.push(car)
        }
      });
      cotiza.push(proveedor)
    });
    let dataForm = {
      ...this.formCot.value,
      productos: cotiza
    }

    //this.functionsService.removeItemLocal('carrito')
  }

  getUser() {
    this.usuariosService.cargarUsuarioById(this.uid).subscribe(res => {
      this.usuario = res.usuario

    })
  }
  isAnfFes(val) {

    if (val.checked) {

      this.formCot.patchValue({
        nombreFes: this.usuario.nombre,
        apellidoPatFes: this.usuario.apellidoPaterno,
        apellidoMatFes: this.usuario.apellidoMaterno
      })
    } else {

      this.formCot.patchValue({
        nombreFes: "",
        apellidoPatFes: "",
        apellidoMatFes: "",
      })
    }
  }

  createFormCot() {
    this.formCot = this.fb.group({

      nombreAnf: [this.usuario.nombre],
      apellidoPatAnf: [this.usuario.apellidoPaterno],
      apellidoMatAnf: [this.usuario.apellidoMaterno],
      isAnfitironFestejado: [false],
      nombreFes: [''],
      apellidoPatFes: [''],
      apellidoMatFes: [''],
      telfonoAnf: [''],
      emailAnf: [''],
      fechaEvento: [''],
      direccion: [''],
      ubicacion: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  getIsSelected(item) {

    switch (item.item.isSelectedBy) {
      case 'isByCantidad':
        return item.item.cantidades
        break;
      case 'isByColor':
        return item.item.colores

        break;
      case 'isByService':
        return item.item.servicios

        break;
      case 'isBySize':
        return item.item.sizes

        break;

      default:
        return []
        break;
    }

  }
  changeValor() {
    this.carrito = this.form.value.carritos

    if (this.carrito.length > 0) {
      this.functionsService.setLocal('carrito', this.carrito)
    } else {
      this.functionsService.removeItemLocal('carrito')
    }

  }
  getContact(contacto: any) {



    var res: any = {}

    this.tipoContactos.forEach(ct => {

      if (ct.uid === contacto.tipoContacto) {

        res = ct

      }
    });


    return res


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
  uniqueObj() {

    this.proveedores = []
    this.carrito.forEach(it => {
      if (!this.proveedores.includes(it.item.proveedor._id)) {
        this.proveedores.push(it.item.proveedor._id)
      }
    });

  }

}
