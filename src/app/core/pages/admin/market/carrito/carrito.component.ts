import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CargarEstatusCotizacion, CargarEstatusCotizaciones, CargarTipoContactos, CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { text } from 'stream/consumers';
import { MapsService } from 'src/app/shared/services/maps.service';
import { CotizacionesService } from 'src/app/core/services/cotizacion.service';
import { EstatusCotizacion } from 'src/app/core/models/estatusCotizacion.model';
import { EstatusCotizacionesService } from 'src/app/core/services/estatusCotizaciones.service';
import { EmailsService } from 'src/app/core/services/email.service';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';

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
  urlT = environment.text_url
  today: Number = this.functionsService.getToday()
  todayDate = this.functionsService.numberToDate(this.today)
  isPago: boolean = false
  isCotizacion: boolean = false
  public form!: FormGroup
  public formCot!: FormGroup
  tipoContactos: TipoContacto[]
  tipoMedias: TipoMedia[]
  proveedores = []
  estatusCotizacion: any
  prvs = []
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  submited = false

  location: any
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private mapsServices: MapsService,
    private cotizacionesService: CotizacionesService,
    private estatusCotizacionesService: EstatusCotizacionesService,
    private tipoContactosService: TipoContactosService,
    private tipoMediasService: TipoMediasService,
    private emailService: EmailsService,
    private router: Router,) {

    console.log('this.pdfFonts::: ', pdfFonts);



    this.mapsServices.getUserLocation().then(res => {
      this.location = res

    })
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

  setPrecio(car) {
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

    return precio

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
    if (this.carrito.length == 0) {
      this.functionsService.navigateTo('/')
    }
  }
  newCarrito(): FormGroup {
    return this.fb.group({
      cantidad: ['', [Validators.required]],
      item: ['', [Validators.required]],
      opcion: ['', [Validators.required]]
    })
  }

  getImagen(photos, i) {
    var img = ''
    photos.forEach(im => {

      this.tipoMedias.forEach(tm => {

        if (im.isPrincipal) {

          if (tm.uid === im.tipoMedia && tm.clave == 'image/*') {

            img = this.url + '/upload/items/' + im.img
          }
          else {

            img = this.url + '/upload/proveedores/' + this.carrito[i].item.proveedor.img
          }

        }

      });
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
  getProvTotal(id) {



    const prs = this.carrito.filter(res => {

      return res.item.proveedor._id === id
    })

    var total = 0
    if (prs.length > 0) {
      prs.forEach((car) => {

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
  get errorControl() {
    return this.form.controls;
  }
  get errorControlCot() {
    return this.formCot.controls;
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
    this.submited = true
    if (this.formCot.valid) {

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

      this.export()
      setTimeout(() => {
        this.form.reset()
        this.formCot.reset()
        this.functionsService.removeItemLocal('carrito')
        this.functionsService.navigateTo('/core/mis-cotizaciones')
      }, 5500);
    } else {
      this.functionsService.alert('Cotización', 'Completa el formulario', 'info')
    }

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
        apellidoMatFes: this.usuario.apellidoMaterno,

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

      nombreEvento: [''],
      nombreAnf: [this.usuario.nombre, [Validators.required]],
      apellidoPatAnf: [this.usuario.apellidoPaterno, [Validators.required]],
      apellidoMatAnf: [this.usuario.apellidoMaterno],
      isAnfitironFestejado: [false, [Validators.required]],
      nombreFes: [''],
      apellidoPatFes: [''],
      apellidoMatFes: [''],
      telfonoAnf: [this.usuario.telefono, [Validators.required]],
      emailAnf: [this.usuario.email, [Validators.required]],
      fechaEvento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
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
    this.estatusCotizacionesService.cargarEstatusCotizacionesByStep('1').subscribe((resp: CargarEstatusCotizaciones) => {

      this.estatusCotizacion = resp.estatusCotizaciones


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Contactos')
        this.loading = false
      })
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {

      this.tipoMedias = resp.tipoMedias


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
        this.prvs.push(it.item.proveedor)
      }
    });

  }

  getContactType(id) {

    let type = ''
    let n = this.tipoContactos.filter(res => {

      return res.uid == id
    })


    return n[0].nombre


  }



  async getContactosPDF(typeV, type) {
    var ctsT = []
    var cts = []

    if (typeV == 'Proveedor') {

      cts.push({ text: 'Nombre: ', bold: true, fontSize: 8, color: '#80d0c7', },)
      cts.push({ text: type.nombre + '\n ', fontSize: 8, color: '#13547a', },)
      type.contactos.forEach(ct => {



        if (this.getContactType(ct.tipoContacto) === 'TELÉFONO') {
          cts.push({ text: 'TELÉFONO: ', bold: true, fontSize: 8, color: '#80d0c7', })
          cts.push({ text: ct.value + '\n', bold: true, fontSize: 8, color: '#13547a', })

          ctsT.push(cts)
        }
        if (this.getContactType(ct.tipoContacto) === 'MAIL') {
          cts.push({ text: 'MAIL: ', bold: true, fontSize: 8, color: '#80d0c7', })
          cts.push({ text: ct.value + '\n', bold: true, fontSize: 8, color: '#13547a', })
          ctsT.push(cts)
        }

        if (this.getContactType(ct.tipoContacto) === 'PAGINA WEB') {
          cts.push({ text: 'PAGINA WEB: ', bold: true, fontSize: 8, color: '#80d0c7', })
          cts.push({ text: ct.value + '\n', bold: true, fontSize: 8, color: '#13547a', })
          ctsT.push(cts)
        }
        if (this.getContactType(ct.tipoContacto) === 'DIRECCIÓN') {
          cts.push({ text: 'DIRECCIÓN: ', bold: true, fontSize: 8, color: '#80d0c7', })
          cts.push({ text: ct.value + '\n', bold: true, fontSize: 8, color: '#13547a', })
          ctsT.push(cts)
        }



      });


      return cts
    } else {
      console.log('Cliente');

      cts.push({ text: 'Anfitrión: ', bold: true, fontSize: 8, color: '#80d0c7', },)
      cts.push({ text: type.nombreAnf + ' ' + type.apellidoPatAnf + ' ' + type.apellidoMatAnf + '\n ', fontSize: 8, color: '#13547a', },)
      if (type.nombreFes !== '' || type.apellidoPatFes !== '') {
        cts.push({ text: 'Festejada(o): ', bold: true, fontSize: 8, color: '#80d0c7', },)
        cts.push({ text: type.nombreFes + ' ' + type.apellidoPatFes + ' ' + type.apellidoMatFes + '\n ', fontSize: 8, color: '#13547a' },)

      }
      if (type.telfonoAnf !== '') {
        cts.push({ text: 'Teléfono: ', bold: true, fontSize: 8, color: '#80d0c7', },)
        cts.push({ text: type.telfonoAnf + '\n ', fontSize: 8, color: '#13547a', },)

      }
      if (type.emailAnf !== '') {
        cts.push({ text: 'EMAIL: ', bold: true, fontSize: 8, color: '#80d0c7', },)
        cts.push({ text: type.emailAnf + '\n ', fontSize: 8, color: '#13547a', },)

      }
      if (type.direccion !== '') {
        cts.push({ text: 'Dirección: ', bold: true, fontSize: 8, color: '#80d0c7', },)
        cts.push({ text: type.direccion + '\n ', fontSize: 8, color: '#13547a', },)

      }
      if (type.fechaEvento !== '') {
        cts.push({ text: 'FechaEvento: ', bold: true, fontSize: 8, color: '#80d0c7', },)
        cts.push({ text: type.fechaEvento + '\n ', fontSize: 8, color: '#13547a', },)

      }

      return await cts
    }

  }

  getProducts(proveedor, carrito) {

    const prs = this.carrito.filter(res => {

      return res.item.proveedor._id === proveedor._id
    })


    let cot = {

      ...this.formCot.value,
      fechaEvento: this.functionsService.dateToNumber(this.formCot.value.fechaEvento),
      proveedor: prs[0].item.proveedor._id,
      productos: prs,
      estatusCotizacion: this.estatusCotizacion.uid,
      usuarioCreated: this.uid,
      activated: true,
      dateCreated: this.today,
      lastEdited: this.today,
    }


    this.cotizacionesService.crearCotizacion(cot).subscribe((res: any) => {

      let coti = res.cotizacion


      var correoProveedor: any

      correoProveedor = coti.productos[0].item.proveedor.contactos.filter(ct => { return ct.value.includes('@') })

      let productos = {
        productos: coti.productos,
        correoProveedor: correoProveedor[0].value
      }


      this.emailService.sendMailCotizacion(coti.uid, productos).subscribe(res => {

        this.functionsService.alert('Cotizacion', 'Se genero correctamente, correo enviado ', 'success')

      })


    })

  }
  async getNumCot(prv) {

    this.cotizacionesService.cargarCotizacionesByProveedor(prv._id).subscribe(async res => {


      return await res.cotizaciones.length
    })

  }
  getProductsPdf(proveedor, carrito) {
    var prods = []
    var prod = []
    var x = [1, 1]

    let inicio = [{ text: 'Producto', style: 'tableHeader', color: '#13547a', }, { text: 'Opción', style: 'tableHeader', color: '#13547a', }, { text: 'Precio', style: 'tableHeader', color: '#13547a', }, { text: '#', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader', color: '#13547a', }]
    prods.push(inicio)

    carrito.forEach(cr => {
      prod = []

      if (cr.item.proveedor._id === proveedor._id) {
        var precio = Number(this.setPrecio(cr))
        prod.push({ text: cr.item.nombre, color: '#13547a', fontSize: 9 })
        prod.push({ text: cr.opcion, color: '#13547a', fontSize: 9 })
        prod.push({ text: precio, color: '#13547a', fontSize: 9 })
        prod.push({ text: cr.cantidad, color: '#13547a', fontSize: 9 })
        prod.push({ text: '$' + (cr.cantidad * precio), color: '#13547a', fontSize: 9 })


        prods.push(prod)
      }
    });


    return prods
  }

  public export(): void {

    let cots = []

    this.prvs.forEach(async (prv, i) => {
      this.getNumCot(prv)

      this.getProducts(prv, this.carrito)
      var Bf = ''
      if (i != 0) {
        Bf = 'before'
      } else {

        Bf = ''
      }
      let cot = [
        {
          alignment: 'center',
          image: await this.functionsService.imageUrlToBase64(`${this.urlT}/assets/images/logo.png`),
          width: 70
        },
        {
          pageBreak: Bf,
          alignment: 'center',
          text: 'MyTicketparty',
          style: 'header',
          color: '#13547a',
          fontSize: 23,
          bold: true,
          margin: [0, 10],
        },
        {

          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: ['50%', '50%'],
            body: [

              [{ text: 'Proveedor', style: 'tableHeader', color: '#13547a', }, { text: 'Cliente', style: 'tableHeader', color: '#13547a', }],
              [
                [
                  {
                    alignment: 'left',
                    image: await this.functionsService.imageUrlToBase64(`${this.url}/upload/proveedores/${prv.img}`),
                    width: 30
                  },
                  {
                    text: await this.getContactosPDF('Proveedor', prv),
                  }
                ],
                [


                  {
                    text: await this.getContactosPDF('Cliente', this.formCot.value)


                    ,
                  }
                ]
              ]
            ]
          }
          ,
          layout: 'noBorders'
        },








        {
          style: 'tableExample',
          alignment: 'center',
          table: {
            alignment: 'center',
            headerRows: 1,
            widths: ['100%'],
            body: [

              [{ text: 'Total', style: 'tableHeader', color: '#13547a', alignment: 'center', }],
              [{ text: this.getProvTotal(prv._id), color: '#80d0c7', alignment: 'center', }]
            ]
          }
          ,
          layout: 'noBorders'
        },
        {
          alignment: 'center',
          style: 'tableExample',
          borderColor: ['#13547a'],
          table: {
            alignment: 'center',
            widths: ['25%', '25%', '15%', '15%', '10%', '10%'],
            headerRows: 1,

            body: this.getProductsPdf(prv, this.carrito)



          },
          layout: 'headerLineOnly',


        },



      ]

      cots.push(cot)

    });


    var docDefinition = {
      content: [
        cots

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        borderColor: ['#13547a'],
      },
      patterns: {
        stripe45d: {
          boundingBox: [1, 1, 4, 4],
          xStep: 3,
          yStep: 3,
          pattern: '1 w 0 1 m 4 5 l s 2 0 m 5 3 l s'
        }
      }
    };
    /* const pdf = pdfMake.createPdf(docDefinition); */
    const pdf = pdfMake.createPdf(docDefinition)

    this.loading = true
    setTimeout(() => {


      pdf.download('Cotizacion-' + (this.formCot.value.nombreEvento) + '-' + this.functionsService.numberToDate(Date.now()) + '.pdf');
      this.loading = false
    }, 5000);

  }
  showCoordenadas(e) {


    this.formCot.patchValue({
      /* fechaEvento: this.functionsService.dateToNumber(this.formCot.value.fechaEvento), */
      lat: e.lat,
      lng: e.lng,
      [e.type]: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`
    })


  }
}
