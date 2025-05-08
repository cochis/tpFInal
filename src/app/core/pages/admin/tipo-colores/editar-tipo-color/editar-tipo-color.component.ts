import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoColor } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-color',
  templateUrl: './editar-tipo-color.component.html',
  styleUrls: ['./editar-tipo-color.component.scss']
})
export class EditarTipoColorComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoColor: TipoColor
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

    private tipoColorsService: TipoColorsService,

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

    this.tipoColorsService.cargarTipoColorById(id).subscribe((resp: CargarTipoColor) => {

      this.tipoColor = resp.tipoColor

      setTimeout(() => {

        this.setForm(this.tipoColor)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoColors')
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
      value: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoColor: TipoColor) {



    this.form = this.fb.group({
      nombre: [tipoColor.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoColor.clave, [Validators.required, Validators.minLength(3)]],
      value: [tipoColor.value, [Validators.required, Validators.minLength(3)]],
      activated: [tipoColor.activated],
      dateCreated: [tipoColor.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('TipoColors')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoColor = {
        ...this.tipoColor,
        ...this.form.value,


      }
      this.tipoColorsService.actualizarTipoColor(this.tipoColor).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoColors')
        this.functionsService.navigateTo('core/tipo-colores/vista-tipo-colores')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'TipoColors')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/tipo-colores/vista-tipo-colores')
  }

}
