import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';

import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-crear-tipo-modulo',
  templateUrl: './crear-tipo-modulo.component.html',
  styleUrls: ['./crear-tipo-modulo.component.scss']
})
export class CrearTipoModuloComponent {
  loading = false
  tipoModulo: TipoModulo
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoModulosService: TipoModulosService,

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
      values: ['', [Validators.required, Validators.minLength(3)]],

      activated: [true],
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
      this.form.value.values = this.form.value.values.trim()

      this.tipoModulosService.crearTipoModulo(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoModulo', 'TipoModulo creado', 'success')
        this.functionsService.navigateTo('core/tipo-modulos/vista-tipo-modulos')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TipoModulos')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoModulos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/tipo-modulos/vista-tipo-modulos')
  }

}

