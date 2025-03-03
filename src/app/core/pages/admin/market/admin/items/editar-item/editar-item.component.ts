import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';

import { CargarCategoriaItems, CargarImgItem, CargarItem, CargarMonedas, CargarProveedors, CargarTipoColors, CargarTipoContactos, CargarTipoItems, CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


import { FunctionsService } from 'src/app/shared/services/functions.service';
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

import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';
import { ImgItem } from 'src/app/core/models/imgItem.model';
import { Item } from 'src/app/core/models/item.model';
import { Moneda } from 'src/app/core/models/moneda.model';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { TipoItem } from 'src/app/core/models/tipoItem.model';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';


@Component({
  selector: 'app-editar-item',
  templateUrl: './editar-item.component.html',
  styleUrls: ['./editar-item.component.css']
})
export class EditarItemComponent {


  rol = this.functionsService.getLocal('role')
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  PRV = environment.prv_role
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  item: Item
  itemTemp: Item
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
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
  imgItems: ImgItem[]
  noMoreImg = false
  @Inject(DOCUMENT) document: Document
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
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
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.itemsService.cargarItemById(id).subscribe((resp: CargarItem) => {

      this.item = resp.item

      this.itemTemp = resp.item

      setTimeout(() => {

        this.setForm(this.item)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Productos y Servicios')
        this.loading = false


      })
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
      isSelectedBy: [''],
      isByService: [false],
      isByColor: [false],
      isByCantidad: [false],
      idealTo: this.fb.array([]),
      calificacion: [null],

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
  setForm(item: any) {


    let pro = (typeof (item.proveedor) == 'string') ? item.proveedor : ((item.proveedor._id) ? item.proveedor._id : item.proveedor.uid)
    let cat = (typeof (item.categoriaItem) == 'string') ? item.categoriaItem : ((item.categoriaItem._id) ? item.categoriaItem._id : item.categoriaItem.uid)
    setTimeout(() => {
      this.loading = true
      this.form = this.fb.group({
        nombre: [(item.nombre) ? item.nombre : '', [Validators.required, Validators.minLength(3)]],
        descripcion: [(item.descripcion) ? item.descripcion : '', [Validators.required, Validators.minLength(3)]],
        proveedor: [pro, [Validators.required, Validators.minLength(3)]],
        tipoItem: [(item.tipoItem) ? item.tipoItem : '', [Validators.required, Validators.minLength(3)]],
        categoriaItem: [cat, [Validators.required, Validators.minLength(3)]],

        isSelectedBy: [(item.isSelectedBy) ? item.isSelectedBy : '', [Validators.required]],
        isBySize: { value: item.isBySize, disabled: (this.edit == 'false') ? true : false },
        isByService: { value: item.isByService, disabled: (this.edit == 'false') ? true : false },
        isByColor: { value: item.isByColor, disabled: (this.edit == 'false') ? true : false },
        isByCantidad: { value: item.isByCantidad, disabled: (this.edit == 'false') ? true : false },
        idealTo: this.fb.array([]),
        calificacion: [(item.calificacion) ? item.calificacion : 0],
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

  setPh(ph: any): FormGroup {
    return this.fb.group({


      isPrincipal: { value: ph.isPrincipal, disabled: (this.edit == 'false') ? true : false },
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
  setIdeal(id: any): FormGroup {
    return this.fb.group({
      nombre: [(id.nombre !== '') ? id.nombre : '', [Validators.required]],
      descripcion: [(id.descripcion !== '') ? id.descripcion : '', [Validators.required]],

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
    let index = 'precio' + (Number(this.sizes.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);



  }
  removeSizes(i: number) {
    this.sizes.removeAt(i);
  }
  addIdealTos() {
    this.idealTo.push(this.newIdealTo())
    let index = 'idealTo' + (Number(this.idealTo.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);
  }
  removeIdealTos(i: number) {
    this.idealTo.removeAt(i);
  }
  addCantidades() {
    this.cantidades.push(this.newCantidad())

    let index = 'precio' + (Number(this.cantidades.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);



  }
  removeCantidades(i: number) {
    this.cantidades.removeAt(i);
  }
  addColors() {
    this.colores.push(this.newColor())

    let index = 'precio' + (Number(this.colores.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);




  }
  removeColors(i: number) {

    this.colores.removeAt(i);
  }
  addServicios() {
    this.servicios.push(this.newServicio())

    let index = 'precio' + (Number(this.servicios.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);



  }

  removeServicios(i: number) {
    this.servicios.removeAt(i);
  }
  addPhotos() {
    this.photos.push(this.newPhoto())
    let index = 'photo' + (Number(this.photos.length) - 1)

    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);




  }
  noMore() {
    let rt = false
    if (this.photos.length > 0) {
      this.form.value.photos.forEach(ph => {
        if (
          ph.nombre == '' ||
          ph.descripcion == '' ||
          ph.descripcion == '' ||
          ph.img == '') {
          rt = true
          return rt
        } else {
          return rt
        }
      });
    }
    return rt
  }

  removePhotos(i: number) {

    if (this.photos.value[i].img) {

      setTimeout(() => {

        this.fileService.deleteFile('Imagen', 'items', this.photos.value[i].img).subscribe(res => {


          this.photos.removeAt(i);
        })
      }, 500);
    } else {

      this.photos.removeAt(i);
    }


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
      isPrincipal: { value: (this.form.value.photos.length == 0) ? true : false, disabled: (this.edit == 'false') ? true : false },
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

    let data = {
      uid: this.item.uid,
      ...this.form.value
    }


    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.itemsService.actualizarItem(data).subscribe((resp: any) => {

        this.item = resp.item
        this.functionsService.alert('Producto o servicio', 'Editado', 'success')
        if (this.rol == this.ADM) {

          this.functionsService.navigateTo('core/items/vista-items')
          this.loading = false
        } else {
          this.functionsService.navigateTo('core/mis-productos')
          this.loading = false

        }

      },
        (error) => {
          this.functionsService.alertError(error, 'Productos y Servicios')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Productos y Servicios')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }


  back() {
    this.functionsService.navigateTo('core/items/vista-items')
  }
  getCatalogos() {
    this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {
      this.tipoContactos = this.functionsService.getActivos(resp.tipoContactos)

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Contactos')
      })
    this.tipoColoresService.cargarTipoColorsAll().subscribe((resp: CargarTipoColors) => {
      this.tipoColores = this.functionsService.getActivos(resp.tipoColors)

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de Colores')
      })
    this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActivos(resp.monedas)

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Monedas')
      })
    this.tipoitemsService.cargarTipoItemsAll().subscribe((resp: CargarTipoItems) => {
      this.tipoItems = this.functionsService.getActivos(resp.tipoItems)


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de items')
      })
    this.proveedorsService.cargarProveedorsAll().subscribe((resp: CargarProveedors) => {
      this.proveedors = this.functionsService.getActivos(resp.proveedors)

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de proveedores')
      })
    this.categoriaItemsService.cargarCategoriaItemsAll().subscribe((resp: CargarCategoriaItems) => {
      this.categoriaItems = this.functionsService.getActivos(resp.categoriaItems)

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de categoria de productos')
      })
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {
      this.tipoMedias = this.functionsService.getActivos(resp.tipoMedias)



    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de medios')
      })

  }
  delProductos(type) {
    switch (type) {
      case 'colores':
        this.colores.value.forEach(i => {
          this.removeColors(i)
        });
        break;
      case 'cantidades':
        this.cantidades.value.forEach(i => {
          this.removeCantidades(i)
        });
        break;
      case 'sizes':
        this.sizes.value.forEach(i => {
          this.removeSizes(i)
        });
        break;
      case 'servicios':
        this.servicios.value.forEach(i => {
          this.removeServicios(i)
        });
        break;

      default:
        break;
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
          this.delProductos('colores')
          this.delProductos('cantidades')
          this.delProductos('sizes')
          this.delProductos('servicios')

          this.form.patchValue({
            isSelectedBy: 'isBySize'
          })


          break;
        case 'isByCantidad':
          this.typeImg = 'isByCantidad'
          this.form.patchValue({
            isByColor: false,
            isByService: false,
            isBySize: false,
          })
          this.delProductos('colores')
          this.delProductos('cantidades')
          this.delProductos('sizes')
          this.delProductos('servicios')
          this.form.patchValue({
            isSelectedBy: 'isByCantidad'
          })

          break;
        case 'isByService':
          this.typeImg = 'isByService'
          this.form.patchValue({
            isByColor: false,
            isBySize: false,
            isByCantidad: false,
          })
          this.delProductos('colores')
          this.delProductos('cantidades')
          this.delProductos('sizes')
          this.delProductos('servicios')
          this.form.patchValue({
            isSelectedBy: 'isByService'
          })
          break;
        case 'isByColor':
          this.typeImg = 'isByColor'
          this.form.patchValue({
            isBySize: false,
            isByService: false,
            isByCantidad: false,
          })
          this.delProductos('colores')
          this.delProductos('cantidades')
          this.delProductos('sizes')
          this.delProductos('servicios')
          this.form.patchValue({
            isSelectedBy: 'isByColor'
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
          this.form.patchValue({
            isSelectedBy: ' '
          })
          this.delProductos('colores')
          this.delProductos('cantidades')
          this.delProductos('sizes')
          this.delProductos('servicios')
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
      this.delProductos('colores')
      this.delProductos('cantidades')
      this.delProductos('sizes')
      this.delProductos('servicios')
      this.form.patchValue({
        isSelectedBy: ' '
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
  async subirImagen(type?, idx?) {



    this.loading = true


    if (this.item !== this.form.value) {


      this.fileService.actualizarFoto(this.imagenSubir, 'items', this.item.uid, idx).then(
        (img) => {


          this.photos.value[idx].img = img
          let data = {
            ...this.form.value,
            photos: this.photos.value,
            uid: this.item.uid
          }

          this.itemsService.actualizarItem(data).subscribe((res: any) => {

            this.setForm(res.itemActualizado)
            this.loading = false
            let index = 'photo' + (Number(this.photos.length) - 1)
            setTimeout(() => {
              this.functionsService.scroolTo(index)
            }, 500);
          },
            (error) => {
              console.error('error::: ', error);

            })



        },
        (err) => {
          console.error('error::: ', err);

        },
      )
    } else {


    }



    /* this.imgItems = []
    this.imgItemsService.existByItem(this.item.uid).subscribe((resp: any) => {

      this.imgItems = resp.imgItems
      
      if (this.imgItems.length == 0) {
        

        var imgI
        var ImgS = []
        for (let index = 0; index < this.form.value.photos.length; index++) {
          const element = this.form.value.photos[index];
          imgI = undefined
          if (idx === Number(index)) {
            imgI = {
              type: type,
              idx: idx,
              ...this.form.value.photos[idx],
              item: this.item.uid
            }
            this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {
              this.imgItem = res.imgItem
              this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
                (img) => {
                  this.imgItem.img = img
                  this.imgItemsService.actualizarImgItem(this.imgItem).subscribe(res => {
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
                    this.loading = true
                    this.imgTemp = undefined
                  })
                },
                (err) => {
                  console.error('error::: ', err);

                },
              )
              this.loading = false
            })
          }
        }
      } else {

        let im = this.imgItems.filter((img) => {
          return img.idx == idx
        })
       
        if (im.length !== 0) {
         

          for (let index = 0; index < this.form.value.photos.length; index++) {
            const element = this.form.value.photos[index];
            imgI = undefined
            if (idx === Number(index)) {
              imgI = {
                type: type,
                idx: idx,
                ...this.form.value.photos[idx],
                item: this.item.uid,
                uid: im[0].uid
              }

              this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', im[0].uid)
                .then(
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

                    let it = {
                      ...this.form.value,
                      uid: this.item.uid
                    }
                    this.itemsService.actualizarItem(it).subscribe((res: any) => {
                      this.functionsService.alertUpdate('Imagen agregada')
                      this.createForm()
                      this.setForm(res.itemActualizado)
                    })
                    this.loading = true
                    this.imgTemp = undefined

                  })
                .catch(error => {
                  console.error('error::: ', error);

                })





            }
          }




        } else {
       

          var imgI
          var ImgS = []
          for (let index = 0; index < this.form.value.photos.length; index++) {
            const element = this.form.value.photos[index];
            imgI = undefined
            if (idx === Number(index)) {
              imgI = {
                type: type,
                idx: idx,
                ...this.form.value.photos[idx],
                item: this.item.uid
              }
              this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {
                this.imgItem = res.imgItem
                this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
                  (img) => {
                    this.imgItem.img = img
                    this.imgItemsService.actualizarImgItem(this.imgItem).subscribe(res => {
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
                      this.loading = true
                      this.imgTemp = undefined
                    })
                  },
                  (err) => {
                    console.error('error::: ', err);

                  },
                )
                this.loading = false
              })
            }
          }
        }




         this.imgItems.forEach(async img => {
          if (img.idx == idx) {
            for (let index = 0; index < this.form.value.photos.length; index++) {
              const element = this.form.value.photos[index];
              imgI = undefined
              if (idx === Number(index)) {
                imgI = {
                  type: type,
                  item: this.item.uid,
                  idx: idx,
                  ...this.form.value.photos[idx],
                  img: '',
                }
              }
            }
            this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid)
              .then(
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
                  this.loading = true
                  this.imgTemp = undefined
 
                })
              .catch(error => {
                console.error('error::: ', error);
 
              })
 
          } else {
            for (let index = 0; index < this.form.value.photos.length; index++) {
              const element = this.form.value.photos[index];
              imgI = undefined
              if (idx === Number(index)) {
                imgI = {
                  type: type,
                  idx: idx,
                  ...this.form.value.photos[idx],
                  item: this.item.uid
                }
          
 
                if (this.imgItems.length <= (idx - 1)) {
                  var imgI
                  var ImgS = []
                  for (let index = 0; index < this.form.value.photos.length; index++) {
                    const element = this.form.value.photos[index];
                    imgI = undefined
                    if (idx === Number(index)) {
                      imgI = {
                        type: type,
                        idx: idx,
                        ...this.form.value.photos[idx],
 
                      }
                      this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {
                        this.imgItem = res.imgItem
                        this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
                          (img) => {
                            this.imgItem.img = img
                            this.imgItemsService.actualizarImgItem(this.imgItem).subscribe(res => {
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
                              this.loading = true
                              this.imgTemp = undefined
                            })
                          },
                          (err) => {
                            console.error('error::: ', err);
 
                          },
                        )
                        this.loading = false
                      })
                    }
                  }
                } else {
                  var imgI
                  var ImgS = []
                  for (let index = 0; index < this.form.value.photos.length; index++) {
                    const element = this.form.value.photos[index];
                    imgI = undefined
                    if (idx === Number(index)) {
                      imgI = {
                        type: type,
                        idx: idx,
                        ...this.form.value.photos[idx],
                        item: this.item.uid
                      }
                      this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {
                        this.imgItem = res.imgItem
                        this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
                          (img) => {
                            this.imgItem.img = img
                            this.imgItemsService.actualizarImgItem(this.imgItem).subscribe(res => {
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
                              this.loading = true
                              this.imgTemp = undefined
                            })
                          },
                          (err) => {
                            console.error('error::: ', err);
 
                          },
                        )
                        this.loading = false
                      })
                    }
                  }
                }
 
 
                this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {
                  this.imgItem = res.imgItem
                  this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
                    (img) => {
                      this.imgItem.img = img
                      this.imgItemsService.actualizarImgItem(this.imgItem).subscribe(res => {
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
                        this.loading = true
                        this.imgTemp = undefined
                      })
                    },
                    (err) => {
                      console.error('error::: ', err);
 
                    },
                  )
                  this.loading = false
                })
              }
            }
          }
        });  






      }


    }) */
    /* this.form.value.photos.forEach(form => {
      this.itemTemp.photos.forEach((item => {
      }))
    });
    var imgI
    var ImgS = []
    for (let index = 0; index < this.form.value.photos.length; index++) {
      const element = this.form.value.photos[index];
      imgI = undefined
      if (idx === Number(index)) {
        imgI = {
          type: type,
          idx: idx,
          ...this.form.value.photos[idx],
          item: this.item.uid
        }
      }
    }
   
    this.imgItemsService.crearImgItem(imgI).subscribe((res: CargarImgItem) => {
      this.imgItem = res.imgItem
      this.fileService.actualizarFoto(this.imagenSubir, 'imgItems', this.imgItem.uid).then(
        (img) => {
          this.imgItem.img = img
          this.imgItemsService.actualizarImgItem(this.imgItem).subscribe(res => {
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
            this.loading = true
            this.imgTemp = undefined
          })
        },
        (err) => {
          console.error('error::: ', err);

        },
      )
      this.loading = false
    }) */
  }



  async crearItemImg(img: any) {
    this.imgItemsService.crearImgItem(img).subscribe(async (resp: any) => {

      return await resp

    },
      (error: any) => {
        console.error('error::: ', error);

      })

  }
  async editarItemImg(img: any) {
    this.imgItemsService.crearImgItem(img).subscribe(async (resp: any) => {

      return await resp

    },
      (error: any) => {
        console.error('error::: ', error);

      })

  }

}
