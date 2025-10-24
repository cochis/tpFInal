import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Red } from 'src/app/core/models/red.model';

import { RedesService } from 'src/app/core/services/red.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-red',
  templateUrl: './crear-red.component.html',
  styleUrls: ['./crear-red.component.scss']
})
export class CrearRedComponent {
  loading = false
  red: Red
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private redesService: RedesService,

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
      this.form.value.clave = this.form.value.clave.trim()

      this.redesService.crearRed(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Red', 'Red creado', 'success')
        this.functionsService.navigateTo('redes/vista-redes')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Redes')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Redes')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('redes/vista-redes')
  }

}

