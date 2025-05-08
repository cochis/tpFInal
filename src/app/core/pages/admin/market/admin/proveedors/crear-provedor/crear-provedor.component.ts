import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarTipoColors, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { Salon } from 'src/app/core/models/salon.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { FileService } from 'src/app/core/services/file.service';

import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';

import { Editor, Toolbar } from 'ngx-editor';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-crear-provedor',
  templateUrl: './crear-provedor.component.html',
  styleUrls: ['./crear-provedor.component.scss']
})
export class CrearProvedorComponent implements OnDestroy {
  loading = false
  proveedor: Proveedor
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoContactos: TipoContacto[]
  tipoColores: TipoColor[]
  salon: Salon
  url = environment.base_url
  public imagenSubir!: File
  public imgTemp: any = undefined
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
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private proveedorsService: ProveedorsService,
    private tipoColoresService: TipoColorsService,
    private salonsService: SalonsService,
    private tipoContactosService: TipoContactosService,
    private fileService: FileService,

  ) {
    this.loading = true
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {
      this.descripcion = new Editor();
      this.loading = false
    }, 1500);
  }

  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })

  }
  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray
  }
  get colores(): FormArray {
    return this.form.get('colores') as FormArray
  }

  addContactos() {
    this.contactos.push(this.newContacto())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeContactos(i: number) {
    this.contactos.removeAt(i);
  }
  addColors() {
    this.colores.push(this.newColor())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


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
    /*    this.loading = true
       this.submited = true */



    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.proveedorsService.crearProveedor(this.form.value).subscribe((resp: any) => {

        this.proveedor = resp.proveedor
        this.functionsService.alert('Proveedor', 'Proveedor creado', 'success')
        this.functionsService.navigateTo(`core/proveedores/editar-proveedor/true/${this.proveedor.uid}`)
        this.loading = false
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
    this.functionsService.navigateTo('core/proveedores/vista-proveedores')
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
            /* this.getId(this.id) */
          },
          (err) => {
            console.error('error::: ', err);

          },
        )
    } else {
      if (this.form.valid) {
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
                this.functionsService.navigateTo(`core/proveedores/editar-proveedor/true/${this.proveedor.uid}`)
                this.loading = true
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

        this.functionsService.alertForm('Proveedores')
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
  ngOnDestroy(): void {
    this.descripcion.destroy();

  }
}

