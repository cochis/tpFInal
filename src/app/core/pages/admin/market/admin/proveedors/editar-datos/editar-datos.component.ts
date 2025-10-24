import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { CargarRedes, CargarTipoColors, CargarTipoContactos, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { Salon } from 'src/app/core/models/salon.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';

import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MapsService } from 'src/app/shared/services/maps.service';
import { environment } from 'src/environments/environment';
import { Red } from 'src/app/core/models/red.model';
import { RedesService } from 'src/app/core/services/red.service';
import { SafeUrl } from '@angular/platform-browser';
import { Editor, Toolbar } from 'ngx-editor';
@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.scss']
})
export class EditarDatosComponent {

  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  loading = false
  proveedor: Proveedor = undefined
  proveedorQr = undefined
  qrOK = false
  location: any = undefined
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoContactos: TipoContacto[]
  tipoColores: TipoColor[]
  url = environment.base_url
  text_url = environment.text_url
  urlLink = ''
  link = ''
  isProveedor = false
  usuario: Usuario
  public imagenSubir!: File
  public imgTemp: any = undefined
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  setColor = true
  viewModal = false
  classModal = 'animate__fadeInLeftBig'
  ContactoP = environment.contactosProveedor
  CLPR = environment.cProvedores
  CP: string;
  CS: string;
  salon: Salon
  redesAll: Red[]
  descripcion: Editor
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  public qrCodeDownloadLink: SafeUrl = "";
  rol = this.functionsService.getLocal('role')
  ADM = environment.admin_role
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private proveedorsService: ProveedorsService,
    private tipoColoresService: TipoColorsService,
    private tipoContactosService: TipoContactosService,
    private salonsService: SalonsService,
    private usuariosService: UsuariosService,
    private fileService: FileService,
    private mapsServices: MapsService,
    private printService: NgxPrintService,
    private redesService: RedesService,

  ) {
    this.descripcion = new Editor();
    this.loading = true
    this.CLPR.forEach(cl => {
      if (cl.clave == 'cPrincipalWP') {

        this.CP = cl.value

      } else {
        this.CS = cl.value

      }
    });
    this.getCatalogos()
    this.getProveedor(this.uid)

    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  get errorControl() {
    return this.form.controls;
  }
  quitModal() {


    if (!this.viewModal) {
      this.classModal = 'animate__fadeInLeftBig'

      this.viewModal = !this.viewModal



    } else {

      this.classModal = 'animate__fadeOutRight'
      setTimeout(() => {
        this.viewModal = !this.viewModal
      }, 2000);
    }
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      calificacion: [null],
      img: [''],
      bannerImg: [''],
      descripcion: ['', [Validators.required]],
      redes: this.fb.array([]),
      ubicacion: [''],
      lng: [''],
      lat: [''],
      envios: [''],
      descripcionEnvios: [''],
      contactos: this.fb.array([]),
      colores: this.fb.array([]),
      example: [false],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })


  }
  isDirection() {


    var res
    this.form.value.contactos.forEach(ct => {

      if (ct.tipoContacto == this.ContactoP[2].value) {

        res = true
      }

    });

    return res
  }
  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray
  }
  get colores(): FormArray {
    return this.form.get('colores') as FormArray
  }
  get redes(): FormArray {
    return this.form.get('redes') as FormArray
  }
  addContactos() {

    this.contactos.push(this.newContacto())
    let index = 'contacto' + (Number(this.contactos.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);

  }
  removeContactos(i: number) {
    this.contactos.removeAt(i);
  }
  addRedes() {
    this.redes.push(this.newRed())
    let index = 'red' + (Number(this.redes.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);
  }
  removeRedes(i: number) {
    this.redes.removeAt(i);
  }
  newRed(): FormGroup {
    return this.fb.group({
      red: ['', [Validators.required]],

      value: ['', [Validators.required]],
    })
  }

  addColors() {

    this.colores.push(this.newColor())




  }
  removeColors(i: number) {
    this.colores.removeAt(i);
  }
  newContacto(): FormGroup {
    return this.fb.group({
      tipoContacto: ['', [Validators.required]],
      value: ['', [Validators.required]],
    })
  }
  newColor(): FormGroup {
    return this.fb.group({
      tipoColor: ['', [Validators.required]],
      value: ['', [Validators.required]],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true


    if (this.form.valid && this.form.value.contactos.length > 0) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.proveedorsService.crearProveedor(this.form.value).subscribe((resp: any) => {

        this.proveedor = resp.proveedor



        this.salonsService.cargarSalonByMail(this.email).subscribe(res => {


          if (res.salons.length > 0) {
            if (!this.proveedor.ubicaciones.includes(res.salons[0].uid)) {

              this.proveedor.ubicaciones.push(res.salons[0].uid)


              this.proveedorsService.actualizarProveedor(this.proveedor).subscribe(res => {
                this.functionsService.alert('Proveedor', 'Proveedor creado', 'success')


                this.functionsService.navigateTo('/inicio')

              })
            } else {
              if (this.isProveedor) {


                this.functionsService.navigateTo('/inicio')
              } else {
                setTimeout(() => {

                  window.location.reload();
                }, 500);



              }
            }
          }

        })





        setTimeout(() => {

          this.loading = false
        }, 2000);
      },
        (error) => {
          this.functionsService.alertError(error, 'Proveedores')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Proveedores')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('/inicio')
  }
  getCatalogos() {
    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = resp.tipoContactos


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Contactos')
      })
    this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario



    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Usuario')
      })
    this.tipoColoresService.cargarTipoColorsAll().subscribe((resp: CargarTipoColors) => {
      this.tipoColores = resp.tipoColors

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Colores')
      })
    this.redesService.cargarRedesAll().subscribe((resp: CargarRedes) => {
      this.redesAll = resp.redes


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Contactos')
      })

  }

  getLocation() {
    this.mapsServices.getUserLocation().then(res => {
      this.location = res


    })
  }
  cambiarImagen(file: any, type) {


    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null

    } else {


      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result

      }
      this.subirImagen(type)

    }
  }
  subirImagen(type?) {

    if (this.proveedor) {

      this.fileService
        .actualizarFoto(this.imagenSubir, 'proveedor', this.proveedor.uid, type)
        .then(
          (img) => {
            if (type == 'img') {

              this.proveedor.img = img
            } else {

              this.proveedor.bannerImg = img
            }
            //message
            this.loading = true
            this.imgTemp = undefined
            this.getProveedor(this.uid)

          },
          (err) => {
            console.error('error::: ', err);

          },
        )
    } else {
      if (this.form.valid) {
        this.loading = true
        this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
        this.form.value.clave = this.form.value.clave.toUpperCase().trim()

        this.proveedorsService.crearProveedor(this.form.value).subscribe((resp: any) => {

          this.proveedor = resp.proveedor

          this.fileService
            .actualizarFoto(this.imagenSubir, 'proveedor', this.proveedor.uid, type)
            .then(
              (img) => {
                if (type == 'img') {

                  this.proveedor.img = img
                } else {

                  this.proveedor.bannerImg = img
                }
                //message
                this.functionsService.navigateTo(`core/proveedores/editar-datos`)
                this.loading = false
                this.imgTemp = undefined
                /* this.getId(this.id) */
              },
              (err) => {
                console.error('error::: ', err);

              },
            )
          this.loading = false
        },
          (error) => {
            this.functionsService.alertError(error, 'Proveedores')
            this.loading = false
            console.error('Error', error)

          })
      } else {

        this.functionsService.alertForm('Proveedor')
        this.loading = false
        return console.info('Please provide all the required values!');
      }

    }
  }


  setClave() {

    if (this.form.value.clave == '') {

      let clave = this.form.value.nombre.substring(1, 4) + (this.today.toString().substring(1, 3)) + new Date().getFullYear()

      this.form.patchValue({
        clave: clave
      })
    }


  }

  getProveedor(id) {

    this.loading = true
    this.proveedorsService.cargarProveedorsByCreador(id).subscribe(resp => {
      if (resp.proveedors.length > 0) {
        this.isProveedor = true
        this.proveedor = resp.proveedors[0]


        this.urlLink = JSON.stringify(this.text_url + 'core/vista-proveedor/' + this.proveedor.uid)
        this.link = this.text_url + 'core/vista-proveedor/' + this.proveedor.uid

        this.proveedorQr = this.proveedor

        this.setForm(this.proveedor)
        this.qrOK = true
        if (this.form.value.colores.length <= 2) {
          this.setColor = false
        }
        if (this.proveedor.lng == null && this.proveedor.lat == null) {
          this.getLocation()
        } else {
          this.location = [this.proveedor.lng, this.proveedor.lat]
        }


        this.loading = false


      } else {
        this.qrOK = false
        this.isProveedor = false
        this.getLocation()

        this.loading = false
        this.createForm()
      }

    })


  }

  setForm(proveedor: Proveedor) {

    this.loading = true


    this.form = this.fb.group({
      nombre: [proveedor.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [proveedor.clave, [Validators.required, Validators.minLength(3)]],
      descripcion: [proveedor.descripcion, [Validators.required, Validators.minLength(3)]],
      img: [proveedor.img],
      contactos: this.fb.array([]),
      colores: this.fb.array([]),
      ubicacion: [proveedor.ubicacion],
      redes: this.fb.array([]),
      lng: [proveedor.lng],
      lat: [proveedor.lat],
      envios: [proveedor.envios],
      descripcionEnvios: [proveedor.descripcionEnvios],
      bannerImg: [proveedor.bannerImg],
      activated: [proveedor.activated],
      dateCreated: [proveedor.dateCreated],
      lastEdited: [this.today],
    })



    proveedor.colores.forEach(color => {
      this.colores.push(this.setColores(color))
    });
    proveedor.contactos.forEach(contacto => {
      this.contactos.push(this.setContacto(contacto))
    });
    if (proveedor.redes.length > 0) {

      proveedor.redes.forEach(red => {
        this.redes.push(this.setRed(red))
      });
    }

  }
  setColores(color: any): FormGroup {
    return this.fb.group({

      tipoColor: [(color.tipoColor !== '') ? color.tipoColor : '', [Validators.required]],
      value: [(color.value !== '') ? color.value : '', [Validators.required]]
    })
  }
  setContacto(contacto: any): FormGroup {
    return this.fb.group({

      tipoContacto: [(contacto.tipoContacto !== '') ? contacto.tipoContacto : '', [Validators.required]],
      value: [(contacto.value !== '') ? contacto.value : '', [Validators.required]]
    })
  }
  setRed(red: any): FormGroup {
    return this.fb.group({

      red: [(red.red !== '') ? red.red : '', [Validators.required]],

      value: [(red.value !== '') ? red.value : '', [Validators.required]]
    })
  }
  onSubmitEdit() {
    this.loading = true
    this.submited = true

    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Proveedor')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.proveedor = {
        ...this.proveedor,
        ...this.form.value,


      }
      this.salonsService.cargarSalonByMail(this.email).subscribe(resU => {

        if (!this.proveedor.ubicaciones.includes(resU.salons[0].uid)) {

          this.proveedor.ubicaciones.push(resU.salons[0].uid)
        }


        this.proveedorsService.actualizarProveedor(this.proveedor).subscribe((resp: any) => {
          this.functionsService.alertUpdate('Proveedor')
          if (this.isProveedor) {

            this.functionsService.navigateTo('/inicio')
          } else {
            this.functionsService.navigateTo('core/proveedores/editar-datos')

          }
          this.loading = false
        },
          (error) => {

            //message
            this.loading = false
            this.functionsService.alertError(error, 'Proveedor')


          })
      })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }
  showCoordenadas(e) {


    this.form.patchValue({
      /* fechaEvento: this.functionsService.dateToNumber(this.formCot.value.fechaEvento), */
      lat: e.lat,
      lng: e.lng,
      [e.type]: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`
    })


  }

  printMe() {





    const customPrintOptions: PrintOptions = new PrintOptions({

      printSectionId: 'print-section',
      // Add any other print options as needed
    });
    customPrintOptions.useExistingCss = true

    this.printService.print(customPrintOptions)
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
  ngOnDestroy() {
    this.descripcion.destroy();

  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}


