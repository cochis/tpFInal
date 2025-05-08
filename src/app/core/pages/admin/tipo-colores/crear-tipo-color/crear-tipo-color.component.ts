import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoColor } from 'src/app/core/models/tipoColor.model';

import { TipoColorsService } from 'src/app/core/services/tipoColores.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-tipo-color',
  templateUrl: './crear-tipo-color.component.html',
  styleUrls: ['./crear-tipo-color.component.scss']
})
export class CrearTipoColorComponent {
  loading = false
  tipoColor: TipoColor
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoColorsService: TipoColorsService,

  ) {
    this.loading = true

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
      clave: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required, Validators.minLength(3)]],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.tipoColorsService.crearTipoColor(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoColor', 'TipoColor creado', 'success')
        this.functionsService.navigateTo('core/tipo-colores/vista-tipo-colores')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TipoColors')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoColors')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/tipo-colores/vista-tipo-colores')
  }

}

