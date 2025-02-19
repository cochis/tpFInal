import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pais } from 'src/app/core/models/pais.model';

import { PaisesService } from 'src/app/core/services/pais.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.css']
})
export class CrearPaisComponent {
  loading = false
  pais: Pais
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private paisesService: PaisesService,

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
      nombre: ['', [Validators.required]],
      clave: ['', [Validators.required]],

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

      this.paisesService.crearPais(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Pais', 'Pais creado', 'success')
        this.functionsService.navigateTo('core/paises/vista-paises')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Paises')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Paises')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/paises/vista-paises')
  }

}

