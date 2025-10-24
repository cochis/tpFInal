import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoContacto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-contacto',
  templateUrl: './editar-tipo-contacto.component.html',
  styleUrls: ['./editar-tipo-contacto.component.scss']
})
export class EditarTipoContactoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoContacto: TipoContacto
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

    private tipoContactosService: TipoContactosService,

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

    this.tipoContactosService.cargarTipoContactoById(id).subscribe((resp: CargarTipoContacto) => {

      this.tipoContacto = resp.tipoContacto


      setTimeout(() => {

        this.setForm(this.tipoContacto)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoContactos')
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
  setForm(tipoContacto: TipoContacto) {



    this.form = this.fb.group({
      nombre: [tipoContacto.nombre, [Validators.required, Validators.minLength(3)]],
      icon: [tipoContacto.icon, [Validators.required, Validators.minLength(3)]],
      value: [tipoContacto.value, [Validators.required, Validators.minLength(3)]],
      descripcion: [tipoContacto.descripcion, [Validators.required, Validators.minLength(3)]],
      activated: [tipoContacto.activated],
      dateCreated: [tipoContacto.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.icon = this.form.value.icon.trim()
    if (this.form.value.nombre === '' || this.form.value.icon === '') {
      this.functionsService.alertForm('TipoContactos')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoContacto = {
        ...this.tipoContacto,
        ...this.form.value,


      }
      this.tipoContactosService.actualizarTipoContacto(this.tipoContacto).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoContactos')
        this.functionsService.navigateTo('tipo-contactos/vista-tipo-contactos')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'TipoContactos')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('tipo-contactos/vista-tipo-contactos')
  }

}
