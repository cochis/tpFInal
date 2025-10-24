import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarCotizacion, CargarTipoContactos, CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Cotizacion } from 'src/app/core/models/cotizacion.model';
import { CotizacionesService } from 'src/app/core/services/cotizacion.service';
import { EmailsService } from 'src/app/core/services/email.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { EstatusCotizacion } from 'src/app/core/models/estatusCotizacion.model';
import { CargarEstatusCotizaciones } from '../../../../interfaces/cargar-interfaces.interfaces';
import { EstatusCotizacionesService } from 'src/app/core/services/estatusCotizaciones.service';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
@Component({
  selector: 'app-mi-cotizacion',
  templateUrl: './mi-cotizacion.component.html',
  styleUrls: ['./mi-cotizacion.component.scss']
})
export class MiCotizacionComponent {
  loading = false
  public imagenSubir!: File
  uid = this.functionsService.getLocal('uid')
  public imgTemp: any = undefined
  cotizacion: any
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  tipoContactos: any
  msnOk: boolean = false
  location: [Number, Number]
  id!: string
  isProveedor = false
  public formCot!: FormGroup
  url = environment.base_url
  urlT = environment.text_url
  proveedores = []
  estatusCotizaciones: any = []
  prvs = []
  tipoMedias: TipoMedia[]
  empresas = this.functionsService.getLocal('proveedor')
  events: any = []
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private proveedoresServices: ProveedorsService,
    private estatusCotizacionServices: EstatusCotizacionesService,
    private cotizacionsService: CotizacionesService,
    private emailService: EmailsService,
    private tipoContactosService: TipoContactosService,
    private route: ActivatedRoute,
    private tipoMediasService: TipoMediasService,

  ) {

    this.id = this.route.snapshot.params['id']

    this.loading = true
    this.getId(this.id)
    this.getCatalogos()
    this.createFormCot()
    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = this.functionsService.getActivos(resp.tipoContactos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Contactos')
        this.loading = false
      })
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }


  changeStatus() {
    this.loading = true
    this.submited = true


    if (this.formCot.valid) {

      this.cotizacion = {
        ...this.cotizacion,
        ...this.formCot.value,
        fechaEvento: this.functionsService.dateToNumber(this.formCot.value.fechaEvento),
        proveedor: this.cotizacion.proveedor._id,
        usuarioCreated: this.cotizacion.usuarioCreated._id,
        lasEdited: this.today

      }

      this.cotizacionsService.actualizarCotizacion(this.cotizacion).subscribe((resp: any) => {
        window.location.reload()

      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Cotizaciones')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }
  }
  getId(id: string) {

    this.empresas.forEach(emp => {

      if (emp.usuarioCreated === this.uid) { this.isProveedor = true }

    });
    this.cotizacionsService.cargarCotizacionById(id).subscribe((resp: CargarCotizacion) => {

      this.cotizacion = resp.cotizacion

      this.location = [this.cotizacion.lng, this.cotizacion.lat]
      let event = {
        title: this.cotizacion.nombreEvento,
        start: this.functionsService.numberDateTimeLocal(this.cotizacion.fechaEvento),
        allDay: false // will make the time show
      }
      this.events.push(event)




      this.uniqueObj()
      setTimeout(() => {

        this.setFormCot(this.cotizacion)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Cotizaciones')
        this.loading = false


      })
  }
  get errorControlCot() {
    return this.formCot.controls;
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
    if (this.cotizacion.productos.length > 0) {
      this.cotizacion.productos.forEach((car) => {
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
  getContact(contacto: any) {



    var res: any = {}

    this.tipoContactos.forEach(ct => {

      if (ct.uid === contacto.tipoContacto) {

        res = ct

      }
    });


    return res


  }
  getProvTotal(id) {



    const prs = this.cotizacion.productos.filter(res => {

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
  createFormCot() {
    this.formCot = this.fb.group({

      nombreEvento: [''],
      nombreAnf: ['', [Validators.required]],
      apellidoPatAnf: ['', [Validators.required]],
      apellidoMatAnf: ['', [Validators.required]],
      isAnfitironFestejado: [false, [Validators.required]],
      nombreFes: [''],
      apellidoPatFes: [''],
      apellidoMatFes: [''],
      telfonoAnf: ['', [Validators.required]],
      emailAnf: ['', [Validators.required]],
      fechaEvento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      dateCreated: ['',],
      lastEdited: ['',],
    })
  }
  get errorControl() {
    return this.form.controls;
  }

  setFormCot(cotizacion) {

    let estatus = (typeof (cotizacion.estatusCotizacion) == 'string') ? cotizacion.estatusCotizacion : ((cotizacion.estatusCotizacion._id) ? cotizacion.estatusCotizacion._id : cotizacion.estatusCotizacion.uid)
    this.formCot = this.fb.group({
      nombreEvento: cotizacion.nombreEvento,
      nombreAnf: cotizacion.nombreAnf,
      apellidoPatAnf: cotizacion.apellidoPatAnf,
      apellidoMatAnf: cotizacion.apellidoMatAnf,
      isAnfitironFestejado: { value: cotizacion.isAnfitironFestejado, disabled: true },
      nombreFes: cotizacion.nombreFes,
      apellidoPatFes: cotizacion.apellidoPatFes,
      apellidoMatFes: cotizacion.apellidoMatFes,
      telfonoAnf: cotizacion.telfonoAnf,
      emailAnf: cotizacion.emailAnf,
      fechaEvento: this.functionsService.numberDateTimeLocal(cotizacion.fechaEvento),
      direccion: cotizacion.direccion,
      ubicacion: cotizacion.ubicacion,
      estatusCotizacion: estatus,
      lat: cotizacion.lat,
      lng: cotizacion.lng,
      dateCreated: cotizacion.dateCreated,
      lastEdited: this.today,
    })
    setTimeout(() => {
      this.loading = false
    }, 500);
  }
  setForm(cotizacion: Cotizacion) {


    /* 
        this.form = this.fb.group({
          nombre: [cotizacion.nombre, [Validators.required, Validators.minLength(3)]],
          clave: [cotizacion.clave, [Validators.required, Validators.minLength(3)]],
          activated: [cotizacion.activated],
          dateCreated: [cotizacion.dateCreated],
          lastEdited: [this.today],
        }) */

  }

  onSubmitCot() {
    this.loading = true
    this.submited = true


    if (this.formCot.valid) {

      this.cotizacion = {
        ...this.cotizacion,
        ...this.formCot.value,
        fechaEvento: this.functionsService.dateToNumber(this.formCot.value.fechaEvento),
        proveedor: this.cotizacion.proveedor._id,
        usuarioCreated: this.cotizacion.usuarioCreated._id,
        lasEdited: this.today

      }

      this.cotizacionsService.actualizarCotizacion(this.cotizacion).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Cotizaciones')
        this.functionsService.navigateTo('mis-cotizaciones')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Cotizaciones')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }

  uniqueObj() {

    this.proveedores = []
    this.cotizacion.productos.forEach(it => {
      if (!this.proveedores.includes(it.item.proveedor._id)) {
        this.proveedores.push(it.item.proveedor._id)
        this.prvs.push(it.item.proveedor)
      }

    });

  }
  back() {
    this.functionsService.navigateTo('mis-cotizaciones')
  }

  sendPdf() {
    var correoProveedor: any
    correoProveedor = this.cotizacion.productos[0].item.proveedor.contactos.filter(ct => { return ct.value.includes('@') })
    let productos = {
      productos: this.cotizacion.productos,
      correoProveedor: (correoProveedor.length > 0) ? correoProveedor[0].value : ''
    }
    this.emailService.sendMailCotizacion(this.cotizacion.uid, productos).subscribe(res => {
      this.functionsService.alert('Cotizacion', 'Se genero correctamente, correo enviado ', 'success')
    })
  }



  public export(): void {

    let cots = []

    this.prvs.forEach(async (prv, i) => {
      this.getNumCot(prv)


      var Bf = ''
      if (i != 0) {
        Bf = 'before'
      } else {

        Bf = ''
      }
      let cot = [
        {
          alignment: 'center',
          image: await this.functionsService.imageUrlToBase64(`${this.urlT}/assets/images/logo.svg`),
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
                    text: this.getContactosPDF('Proveedor', prv),
                  }
                ],
                [


                  {
                    text: this.getContactosPDF('Cliente', this.formCot.value)


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
            widths: ['25%', '25%', '15%', '15%', '10%', '10%'],
            headerRows: 1,

            body: this.getProductsPdf(prv, this.cotizacion.productos)



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

    const pdf = pdfMake.createPdf(docDefinition);

    this.loading = true
    setTimeout(() => {
      this.functionsService.alert('Cotización', 'Se enviara correo y se esta trabajando en el PDF', 'info')
      pdf.download('Cotizacion-' + (this.formCot.value.nombreEvento) + '-' + this.functionsService.numberToDate(Date.now()) + '.pdf');
      this.sendPdf()
      this.loading = false
    }, 5000);

  }

  async getNumCot(prv) {

    this.cotizacionsService.cargarCotizacionesByProveedor(prv._id).subscribe(async res => {

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
  getProducts(proveedor, carrito) {

    const prs = this.cotizacion.filter(res => {

      return res.item.proveedor._id === proveedor._id
    })




  }
  getContactosPDF(typeV, type) {
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

      cts.push({ text: 'Anfitrión: ', bold: true, fontSize: 8, color: '#80d0c7', },)
      cts.push({ text: type.nombreAnf + ' ' + type.apellidoPatAnf + ' ' + type.apellidoMatAnf + '\n ', fontSize: 8, color: '#13547a', },)
      if (!type.isAnfitironFestejado && (type.nombreFes !== '' || type.apellidoPatFes !== '' || type.apellidoMatFes !== '')) {
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

      return cts
    }

  }
  getContactType(id) {

    let type = ''
    let n = this.tipoContactos.filter(res => {

      return res.uid == id
    })


    return n[0].nombre


  }
  getCatalogos() {
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {

      this.tipoMedias = resp.tipoMedias


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Contactos')
        this.loading = false
      })


    this.estatusCotizacionServices.cargarEstatusCotizacionesAll().subscribe((resp: CargarEstatusCotizaciones) => {
      this.estatusCotizaciones = this.functionsService.getActives(resp.estatusCotizaciones)


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de centros de eventos')
      })
  }

  getImagenProd(photos, i) {

    var img = ''
    photos.forEach(im => {

      this.tipoMedias.forEach(tm => {

        if (im.isPrincipal) {


          if (tm.uid === im.tipoMedia && tm.clave == 'image/*') {


            img = this.url + '/upload/items/' + im.img
          }
          else if (tm.uid === im.tipoMedia && tm.clave != 'image/*') {

            img = this.url + '/upload/proveedores/' + this.cotizacion.productos[i].item.proveedor.img

            return
          }

        }

      });
    });



    return img
  }
}

