import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parametro } from 'src/app/core/models/parametro.model';

import { ParametrosService } from 'src/app/core/services/parametro.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-parametro',
  templateUrl: './crear-parametro.component.html',
  styleUrls: ['./crear-parametro.component.scss']
})
export class CrearParametroComponent {
  loading = false
  parametro: Parametro
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private parametrosService: ParametrosService,

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
      type: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
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

      this.parametrosService.crearParametro(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Parametro', 'Parametro creado', 'success')
        this.functionsService.navigateTo('core/parametros/vista-parametros')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Parametros')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Parametros')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/parametros/vista-parametros')
  }

}

