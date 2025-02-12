import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';

import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-tipo-contacto',
  templateUrl: './crear-tipo-contacto.component.html',
  styleUrls: ['./crear-tipo-contacto.component.css']
})
export class CrearTipoContactoComponent {
  loading = false
  tipoContacto: TipoContacto
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoContactosService: TipoContactosService,

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
      icon: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],

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
      this.form.value.icon = this.form.value.icon.trim()
      this.form.value.value = this.form.value.value.toUpperCase().trim()
      this.form.value.descripcion = this.form.value.descripcion.toUpperCase().trim()

      this.tipoContactosService.crearTipoContacto(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoContacto', 'TipoContacto creado', 'success')
        this.functionsService.navigateTo('core/tipo-contactos/vista-tipo-contactos')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TipoContactos')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoContactos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/tipo-contactos/vista-tipo-contactos')
  }

}

