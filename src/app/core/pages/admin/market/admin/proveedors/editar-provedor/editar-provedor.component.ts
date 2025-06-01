import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { CargarProveedor, CargarRedes, CargarTipoColors, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { FileService } from 'src/app/core/services/file.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { Editor, Toolbar } from 'ngx-editor';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MapsService } from 'src/app/shared/services/maps.service';
import { environment } from 'src/environments/environment';
import { SafeUrl } from '@angular/platform-browser';
import { Red } from 'src/app/core/models/red.model';
import { RedesService } from 'src/app/core/services/red.service';
@Component({
  selector: 'app-editar-provedor',
  templateUrl: './editar-provedor.component.html',
  styleUrls: ['./editar-provedor.component.scss']
})
export class EditarProvedorComponent implements OnDestroy {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  proveedor: Proveedor
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  editBol = false
  url = environment.base_url
  tipoContactos: TipoContacto[]
  tipoColores: TipoColor[]
  text_url = environment.text_url
  urlLink = ''
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  location: any = undefined
  ContactoP = environment.contactosProveedor
  isMap = false
  descripcion: Editor
  redesAll: Red[]
  public qrCodeDownloadLink: SafeUrl = "";
  rol = this.functionsService.getLocal('role')
  ADM = environment.admin_role
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
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private proveedorsService: ProveedorsService,
    private tipoColoresService: TipoColorsService,
    private redesService: RedesService,
    private tipoContactosService: TipoContactosService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private mapService: MapsService,
    private printService: NgxPrintService

  ) {
    this.mapService.getUserLocation().then(res => {
      this.location = res
    })
    this.descripcion = new Editor();
    this.loading = true
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']

    this.editBol = (this.edit == 'true') ? true : false

    this.loading = true
    this.getCatalogos()
    this.getId(this.id)

    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 3000);

  }

  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray
  }
  get redes(): FormArray {
    return this.form.get('redes') as FormArray
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

  addRedes() {
    this.redes.push(this.newRed())
    let index = 'red' + (Number(this.redes.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);
  }
  removeContactos(i: number) {
    this.contactos.removeAt(i);
  }
  removeRedes(i: number) {
    this.redes.removeAt(i);
  }


  addColors() {
    this.colores.push(this.newColor())

    let index = 'colors' + (Number(this.colores.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);


  }
  removeColors(i: number) {
    this.colores.removeAt(i);
  }
  newRed(): FormGroup {
    return this.fb.group({
      red: ['', [Validators.required]],

      value: ['', [Validators.required]],
    })
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
  isDirection() {


    var res
    this.form.value.contactos.forEach(ct => {

      if (ct.tipoContacto == this.ContactoP[2].value) {

        res = true
      }

    });


    return res
  }
  getId(id: string) {
    this.loading = true
    this.proveedorsService.cargarProveedorById(id).subscribe((resp: CargarProveedor) => {

      this.proveedor = resp.proveedor

      this.urlLink = this.text_url + 'core/vista-proveedor/?id=' + this.proveedor.uid
      if (this.proveedor.lng && this.proveedor.lat) {
        this.location = [this.proveedor.lng, this.proveedor.lat]
      }

      this.setForm(this.proveedor)


    },
      (error: any) => {

        this.functionsService.alertError(error, 'Proveedores')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      bannerImg: ['', [Validators.required, Validators.minLength(3)]],
      img: ['', [Validators.required, Validators.minLength(3)]],
      enviosOk: [false],

      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      contactos: this.fb.array([]),
      redes: this.fb.array([]),
      colores: this.fb.array([]),
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  setForm(proveedor: Proveedor) {


    this.loading = true


    this.form = this.fb.group({
      nombre: [proveedor.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [proveedor.clave, [Validators.required, Validators.minLength(3)]],
      descripcion: [proveedor.descripcion, [Validators.required, Validators.minLength(3)]],
      img: [proveedor.img, [Validators.required]],
      enviosOk: [proveedor.enviosOk,],


      contactos: this.fb.array([]),
      redes: this.fb.array([]),
      bannerImg: [proveedor.bannerImg, [Validators.required]],
      colores: this.fb.array([]),
      example: [proveedor.example],
      activated: [proveedor.activated],
      dateCreated: [proveedor.dateCreated],
      lastEdited: [this.today],
    })



    if (proveedor.colores.length > 0) {

      proveedor.colores.forEach(color => {
        this.colores.push(this.setColores(color))
      });
    }
    if (proveedor.contactos.length > 0) {
      proveedor.contactos.forEach(contacto => {
        this.contactos.push(this.setContacto(contacto))
      });
    }
    if (proveedor.redes.length > 0) {

      proveedor.redes.forEach(red => {
        this.redes.push(this.setRed(red))
      });
    }


    this.isMapView()

    setTimeout(() => {

      this.loading = false
    }, 1500);
  }

  onSubmit() {

    this.loading = true
    this.submited = true

    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Proveedores')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.proveedor = {
        ...this.proveedor,
        ...this.form.value,


      }


      this.proveedorsService.actualizarProveedor(this.proveedor).subscribe((resp: any) => {

        this.functionsService.alertUpdate('Proveedores')
        this.functionsService.navigateTo('core/proveedores/vista-proveedores')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Proveedores')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }

  isMapView() {
    this.form.value.contactos.forEach(ct => {
      if (ct.tipoContacto == this.ContactoP[2].value) {
        this.isMap = true
      }

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
  setRed(red: any): FormGroup {
    return this.fb.group({

      red: [(red.red !== '') ? red.red : '', [Validators.required]],

      value: [(red.value !== '') ? red.value : '', [Validators.required]]
    })
  }








  back() {
    this.functionsService.navigateTo('core/proveedores/vista-proveedores')
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
          this.getId(this.id)
          this.loading = false
        },
        (err) => {
          console.error('error::: ', err);
          this.loading = false
        },
      )
  }
  getCatalogos() {
    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = resp.tipoContactos

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Contactos')
      })
    this.redesService.cargarRedesAll().subscribe((resp: CargarRedes) => {
      this.redesAll = resp.redes


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

  getColoresQR() {
    var res = true


    this.form.value.colores.forEach(cl => {

      if (cl.tipoColor == '' || cl.value == '') {
        res = false
        return

      }


    });

    if (this.form.value.colores.length < 2) {
      res = false
    }


    return res


  }
  showCoordenadas(e) {


    this.form.patchValue({
      lng: e.lng,
      lat: e.lat,
      [e.type]: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`
    })


  }

  hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');

      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.3)';
    }
    throw new Error('Bad Hex');
  }
  ngOnDestroy() {
    this.descripcion.destroy();

  }
  onChangeURL(url: SafeUrl) {

    this.qrCodeDownloadLink = url;
  }
}
