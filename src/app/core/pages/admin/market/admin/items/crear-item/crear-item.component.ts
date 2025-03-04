import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarCategoriaItems, CargarImgItem, CargarImgItems, CargarMonedas, CargarProveedors, CargarTipoColors, CargarTipoContactos, CargarTipoItems, CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';
import { ImgItem } from 'src/app/core/models/imgItem.model';
import { Item } from 'src/app/core/models/item.model';
import { Moneda } from 'src/app/core/models/moneda.model';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { TipoItem } from 'src/app/core/models/tipoItem.model';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { CategoriaItemsService } from 'src/app/core/services/categoriaItem.service';
import { FileService } from 'src/app/core/services/file.service';
import { ImgItemsService } from 'src/app/core/services/imgItem.service';

import { ItemsService } from 'src/app/core/services/item.service';
import { MonedasService } from 'src/app/core/services/moneda.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { TipoItemsService } from 'src/app/core/services/tipoItem.service';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';
import { NgxCurrencyDirective } from "ngx-currency";


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-crear-item',
  templateUrl: './crear-item.component.html',
  styleUrls: ['./crear-item.component.css']
})
export class CrearItemComponent {
  loading = false
  item: any
  rol = this.functionsService.getLocal('role')
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  PRV = environment.prv_role

  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  uid = this.functionsService.getLocal('uid')
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoContactos: TipoContacto[]
  monedas: Moneda[]
  tipoColores: TipoColor[]
  tipoItems: TipoItem[]
  tipoMedias: TipoMedia[]
  proveedors: Proveedor[]
  categoriaItems: CategoriaItem[]
  imgItem: ImgItem = null
  imgItemtemp: ImgItem = null
  typeImg = ''

  url = environment.base_url




  public imagenSubir!: File
  public imgTemp: any = undefined

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private itemsService: ItemsService,
    private tipoColoresService: TipoColorsService,
    private tipoContactosService: TipoContactosService,
    private tipoitemsService: TipoItemsService,
    private tipoMediasService: TipoMediasService,
    private monedasService: MonedasService,
    private proveedorsService: ProveedorsService,
    private categoriaItemsService: CategoriaItemsService,
    private imgItemsService: ImgItemsService,
    private fileService: FileService,

  ) {
    this.loading = true
    this.getCatalogos()
    this.createForm()



    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      proveedor: ['', [Validators.required, Validators.minLength(3)]],
      tipoItem: ['', [Validators.required, Validators.minLength(3)]],
      categoriaItem: ['', [Validators.required, Validators.minLength(3)]],
      isBySize: [false],
      isByService: [false],
      isByColor: [false],
      isByCantidad: [false],
      idealTo: this.fb.array([]),
      calificacion: [0],
      envios: [false],
      descripcionEnvios: [''],

      sizes: this.fb.array([]),
      colores: this.fb.array([]),
      servicios: this.fb.array([]),
      cantidades: this.fb.array([]),
      photos: this.fb.array([]),
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })

  }
  setForm(item: Item) {


    setTimeout(() => {
      this.loading = true
      this.form = this.fb.group({
        nombre: [(item.nombre) ? item.nombre : '', [Validators.required, Validators.minLength(3)]],
        descripcion: [(item.descripcion) ? item.descripcion : '', [Validators.required, Validators.minLength(3)]],
        proveedor: [(item.proveedor) ? item.proveedor : '', [Validators.required, Validators.minLength(3)]],
        tipoItem: [(item.tipoItem) ? item.tipoItem : '', [Validators.required, Validators.minLength(3)]],
        categoriaItem: [(item.categoriaItem) ? item.categoriaItem : '', [Validators.required, Validators.minLength(3)]],
        isBySize: [(item.isBySize) ? item.isBySize : false],
        isByService: [(item.isByService) ? item.isByService : false],
        isByColor: [(item.isByColor) ? item.isByColor : false],
        isByCantidad: [(item.isByCantidad) ? item.isByCantidad : false],
        idealTo: this.fb.array([]),
        calificacion: [(item.calificacion) ? item.calificacion : 0],
        envios: [(item.envios) ? item.envios : false],
        descripcionEnvios: [(item.descripcionEnvios) ? item.descripcionEnvios : ''],
        sizes: this.fb.array([]),
        colores: this.fb.array([]),
        servicios: this.fb.array([]),
        cantidades: this.fb.array([]),
        photos: this.fb.array([]),
        activated: [(item.activated) ? item.activated : false],
        dateCreated: [this.today],
        lastEdited: [this.today],
      })


      item.photos.forEach((ph: any) => {
        this.photos.push(this.setPh(ph))

      });
      item.sizes.forEach((pc: any) => {
        this.sizes.push(this.setPrices(pc))
      });
      item.colores.forEach((pc: any) => {
        this.colores.push(this.setPrices(pc))
      });
      item.servicios.forEach((pc: any) => {
        this.servicios.push(this.setPrices(pc))
      });
      item.cantidades.forEach((pc: any) => {
        this.cantidades.push(this.setPrices(pc))
      });
      item.idealTo.forEach((id: any) => {
        this.idealTo.push(this.setIdeal(id))
      });


      this.loading = false



    }, 500);
  }

  setIdeal(id: any): FormGroup {
    return this.fb.group({
      nombre: [(id.nombre !== '') ? id.nombre : '', [Validators.required]],
      descripcion: [(id.descripcion !== '') ? id.descripcion : '', [Validators.required]],

    })
  }
  setPh(ph: any): FormGroup {
    return this.fb.group({

      isPrincipal: [(ph.isPrincipal) ? true : false],
      nombre: [(ph.nombre !== '') ? ph.nombre : '', [Validators.required]],
      descripcion: [(ph.descripcion !== '') ? ph.descripcion : '', [Validators.required]],
      tipoMedia: [(ph.tipoMedia !== '') ? ph.tipoMedia : '', [Validators.required]],
      img: [(ph.img !== '') ? ph.img : '', [Validators.required]],

    })
  }
  setPrices(pc: any): FormGroup {
    return this.fb.group({
      nombre: [(pc.nombre !== '') ? pc.nombre : '', [Validators.required]],
      precio: [(pc.precio !== '') ? pc.precio : '', [Validators.required]],
      moneda: [(pc.moneda !== '') ? pc.moneda : '', [Validators.required]],
      descripcion: [(pc.descripcion !== '') ? pc.descripcion : '', [Validators.required]],


    })
  }







  get sizes(): FormArray {
    return this.form.get('sizes') as FormArray
  }
  get colores(): FormArray {
    return this.form.get('colores') as FormArray
  }
  get servicios(): FormArray {
    return this.form.get('servicios') as FormArray
  }
  get cantidades(): FormArray {
    return this.form.get('cantidades') as FormArray
  }
  get idealTo(): FormArray {
    return this.form.get('idealTo') as FormArray
  }
  get photos(): FormArray {
    return this.form.get('photos') as FormArray
  }
  addSizes() {
    this.sizes.push(this.newSize())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeSizes(i: number) {
    this.sizes.removeAt(i);
  }
  addIdealTos() {
    this.idealTo.push(this.newIdealTo())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeIdealTos(i: number) {
    this.idealTo.removeAt(i);
  }
  addCantidades() {
    this.cantidades.push(this.newCantidad())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeCantidades(i: number) {
    this.cantidades.removeAt(i);
  }
  addColors() {
    this.colores.push(this.newColor())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeColors(i: number) {
    this.colores.removeAt(i);
  }
  addServicios() {
    this.servicios.push(this.newServicio())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }

  removeServicios(i: number) {
    this.servicios.removeAt(i);
  }
  addPhotos() {
    this.photos.push(this.newPhoto())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removePhotos(i: number) {
    this.photos.removeAt(i);
  }
  newSize(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    })
  }
  newColor(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    })
  }
  newServicio(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    })
  }
  newCantidad(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    })
  }
  newPhoto(): FormGroup {
    return this.fb.group({
      isPrincipal: [(this.form.value.photos.length == 0) ? true : false],
      nombre: [''],
      descripcion: [''],
      tipoMedia: [''],
      img: [''],
    })
  }
  newIdealTo(): FormGroup {
    return this.fb.group({
      nombre: [''],
      descripcion: [''],
    })
  }
  onSubmit() {
    this.loading = true
    this.submited = true


    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.itemsService.crearItem(this.form.value).subscribe((resp: any) => {

        this.item = resp.item
        this.functionsService.alert('Producto o servicio', 'Creado', 'success')

        this.functionsService.navigateTo(`/core/items/editar-item/true/${this.item.uid}`)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Producto o servicio')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Producto o servicio')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }
  back() {
    this.functionsService.navigateTo('core/items/vista-items')
  }
  getCatalogos() {



    if (this.rol === this.ADM) {
      this.proveedorsService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {
        this.proveedors = resp.proveedors

      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Tipo de proveedores')
        })
    } else {
      this.proveedorsService.cargarProveedorsByCreador(this.uid).subscribe((resp: CargarProveedors) => {
        this.proveedors = resp.proveedors


      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Tipo de proveedores')
        })
    }

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
    this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = resp.monedas

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Monedas')
      })
    this.tipoitemsService.cargarTipoItemsAll().subscribe((resp: CargarTipoItems) => {
      this.tipoItems = resp.tipoItems


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de items')
      })

    this.categoriaItemsService.cargarCategoriaItemsAll().subscribe((resp: CargarCategoriaItems) => {
      this.categoriaItems = resp.categoriaItems


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de categoria de productos')
      })
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {
      this.tipoMedias = resp.tipoMedias


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de medios')
      })

  }
  cambiarImagen(file: any, type: string, idx: number) {


    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null

    } else {


      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result

      }
      this.subirImagen(type, idx)

    }
  }
  subirImagen(type?, idx?) {




    if (this.item) {

      for (let index = 0; index < this.photos.length; index++) {
        const element = this.photos[index];


      }
      let imgI: ImgItem = {
        type: type,
        idx: idx,

        ...this.item.photos[idx],
        item: this.item.uid
      }
      this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {

        this.imgItem = res.imgItem
        this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
          (img) => {

            var fotos: any = []

            for (let i = 0; i < this.photos.length; i++) {


              if (i === idx) {
                this.photos.value[idx].img = img
              }
              fotos.push(this.photos.value[idx])
            }

            this.form.patchValue({
              photos: fotos
            })


            this.item.photos = fotos

            this.itemsService.actualizarItem(this.item).subscribe((res: any) => {

              this.functionsService.alertUpdate('Imagen agregada')
              this.createForm()
              this.setForm(res.itemActualizado)




            })
            //message
            //this.functionsService.navigateTo(`core/items/editar-item/true/${this.item.uid}`)
            this.loading = true
            this.imgTemp = undefined

          },
          (err) => {
            console.error('error::: ', err);

          },
        )
        this.loading = false

      })








    } else {
      if (this.form.valid) {
        this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()

        this.itemsService.crearItem(this.form.value).subscribe((resp: any) => {

          this.item = resp.item

          let imgI: ImgItem = {
            type: type,
            idx: idx,

            ...this.item.photos[idx],
            item: this.item.uid
          }

          this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {

            this.imgItem = res.imgItem
            this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
              (img) => {
                var fotos: any = []
                for (let i = 0; i < this.photos.length; i++) {
                  if (i === idx) {
                    this.photos.value[idx].img = img
                  }
                  fotos.push(this.photos.value[idx])
                }
                this.form.patchValue({
                  photos: fotos
                })
                this.item.photos = fotos
                this.itemsService.actualizarItem(this.item).subscribe((res: any) => {
                  this.functionsService.alertUpdate('Imagen agregada')
                  this.functionsService.navigateTo(`/core/items/editar-item/true/${this.item.uid}`)
                })
                //message
                //this.functionsService.navigateTo(`core/items/editar-item/true/${this.item.uid}`)
                this.loading = true
                this.imgTemp = undefined

              },
              (err) => {
                console.error('error::: ', err);

              },
            )
            this.loading = false

          })

          this.imgItemsService.crearImgItem
          this.loading = false
          //this.imgItemsService.crearImgItem()
          /*  this.fileService
             .actualizarFoto(this.imagenSubir, 'item', this.item.uid, type)
             .then(
               (img) => {
                 if (type == 'img') {
 
                   //this.item.img = img
                 } else {
 
                   //this.item.bannerImg = img
                 }
                 //message
                 this.functionsService.navigateTo(`core/items/editar-item/true/${this.item.uid}`)
                 this.loading = true
                 this.imgTemp = undefined
                   this.getId(this.id)  
               },
               (err) => {
                console.error('error::: ', err);
 
               },
             )
           this.loading = false */
        },
          (error) => {
            this.functionsService.alertError(error, 'Producto o servicio')
            this.loading = false
            console.error('Error', error)

          })
      } else {

        this.functionsService.alertForm('Producto o servicio')
        this.loading = false
        return console.info('Please provide all the required values!');
      }

    }
  }


  changePrice(type) {

    if (this.form.value[type]) {

      switch (type) {
        case 'isBySize':
          this.typeImg = 'isBySize'
          this.form.patchValue({
            isByColor: false,
            isByService: false,
            isByCantidad: false,
          })

          break;
        case 'isByCantidad':
          this.typeImg = 'isByCantidad'
          this.form.patchValue({
            isByColor: false,
            isByService: false,
            isBySize: false,
          })

          break;
        case 'isByService':
          this.typeImg = 'isByService'
          this.form.patchValue({
            isByColor: false,
            isBySize: false,
            isByCantidad: false,
          })

          break;
        case 'isByColor':
          this.typeImg = 'isByColor'
          this.form.patchValue({
            isBySize: false,
            isByService: false,
            isByCantidad: false,
          })

          break;

        default:
          this.typeImg = ''
          this.form.patchValue({
            isByColor: false,
            isBySize: false,
            isByService: false,
            isByCantidad: false,
          })
          break;
      }
    } else {
      this.typeImg = ''
      this.form.patchValue({
        isByColor: false,
        isBySize: false,
        isByService: false,
        isByCantidad: false,
      })
    }







  }

  changePrincipal(i) {
    this.form.value.photos.forEach((element, ix) => {
      if (ix === Number(i)) {
        element.isPrincipal = true
      } else {
        element.isPrincipal = false
      }
    });
    this.form.patchValue({
      photos: this.form.value.photos
    })
  }
}

