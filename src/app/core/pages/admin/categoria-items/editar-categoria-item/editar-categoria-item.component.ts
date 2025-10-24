import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarCategoriaItem } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';
import { CategoriaItemsService } from 'src/app/core/services/categoriaItem.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-categoria-item',
  templateUrl: './editar-categoria-item.component.html',
  styleUrls: ['./editar-categoria-item.component.scss']
})
export class EditarCategoriaItemComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  categoriaItem: CategoriaItem
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private categoriaItemsService: CategoriaItemsService,

    private route: ActivatedRoute,

  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.categoriaItemsService.cargarCategoriaItemById(id).subscribe((resp: CargarCategoriaItem) => {

      this.categoriaItem = resp.categoriaItem


      setTimeout(() => {

        this.setForm(this.categoriaItem)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'CategoriaItems')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      icon: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(categoriaItem: CategoriaItem) {



    this.form = this.fb.group({
      nombre: [categoriaItem.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [categoriaItem.clave, [Validators.required, Validators.minLength(3)]],
      activated: [categoriaItem.activated],
      dateCreated: [categoriaItem.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.icon === '') {
      this.functionsService.alertForm('CategoriaItems')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.categoriaItem = {
        ...this.categoriaItem,
        ...this.form.value,


      }
      this.categoriaItemsService.actualizarCategoriaItem(this.categoriaItem).subscribe((resp: any) => {
        this.functionsService.alertUpdate('CategoriaItems')
        this.functionsService.navigateTo('categoria-items/vista-categoria-items')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'CategoriaItems')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('categoria-items/vista-categoria-items')
  }

}

