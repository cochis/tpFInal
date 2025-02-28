import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarTipoColors, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { FileService } from 'src/app/core/services/file.service';

import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MapsService } from 'src/app/shared/services/maps.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.css']
})
export class EditarDatosComponent {
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
  uid = this.functionsService.getLocal('uid')
  public imagenSubir!: File
  public imgTemp: any = undefined
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  setColor = true
  viewModal = false
  classModal = 'animate__fadeInLeftBig'
  ContactoP = environment.contactosProveedor
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private proveedorsService: ProveedorsService,
    private tipoColoresService: TipoColorsService,
    private tipoContactosService: TipoContactosService,
    private fileService: FileService,
    private mapsServices: MapsService,

  ) {
    this.loading = true

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

      ubicacion: [''],
      lng: [''],
      lat: [''],
      contactos: this.fb.array([]),
      colores: this.fb.array([]),
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
        this.functionsService.alert('Proveedor', 'Proveedor creado', 'success')
        if (this.isProveedor) {

          this.functionsService.navigateTo('/core/inicio')
        } else {
          setTimeout(() => {

            window.location.reload();
          }, 500);



        }
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
    this.functionsService.navigateTo('/core/inicio')
  }
  getCatalogos() {
    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = resp.tipoContactos


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Contactos')
      })
    this.tipoColoresService.cargarTipoColorsAll().subscribe((resp: CargarTipoColors) => {
      this.tipoColores = resp.tipoColors

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Colores')
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
    let clave = this.form.value.nombre.substring(1, 4) + (this.today.toString().substring(1, 3)) + new Date().getFullYear()

    this.form.patchValue({
      clave: clave
    })


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
      img: [proveedor.img, [Validators.required]],
      contactos: this.fb.array([]),
      colores: this.fb.array([]),
      ubicacion: [proveedor.ubicacion],
      lng: [proveedor.lng],
      lat: [proveedor.lat],
      bannerImg: [proveedor.bannerImg, [Validators.required]],
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

      this.proveedorsService.actualizarProveedor(this.proveedor).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Proveedor')
        if (this.isProveedor) {

          this.functionsService.navigateTo('/core/inicio')
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
}


