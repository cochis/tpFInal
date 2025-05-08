import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoItem } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoItem } from 'src/app/core/models/tipoItem.model';
import { TipoItemsService } from 'src/app/core/services/tipoItem.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-item',
  templateUrl: './editar-tipo-item.component.html',
  styleUrls: ['./editar-tipo-item.component.scss']
})
export class EditarTipoItemComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoItem: TipoItem
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

    private tipoItemsService: TipoItemsService,

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

    this.tipoItemsService.cargarTipoItemById(id).subscribe((resp: CargarTipoItem) => {

      this.tipoItem = resp.tipoItem


      setTimeout(() => {

        this.setForm(this.tipoItem)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoItems')
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
  setForm(tipoItem: TipoItem) {



    this.form = this.fb.group({
      nombre: [tipoItem.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoItem.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoItem.activated],
      dateCreated: [tipoItem.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.trim()

    if (this.form.value.nombre === '' || this.form.value.icon === '') {
      this.functionsService.alertForm('TipoItems')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoItem = {
        ...this.tipoItem,
        ...this.form.value,


      }
      this.tipoItemsService.actualizarTipoItem(this.tipoItem).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoItems')
        this.functionsService.navigateTo('core/tipo-items/vista-tipo-items')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'TipoItems')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/tipo-items/vista-tipo-items')
  }

}

