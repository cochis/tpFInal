import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';

import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-crear-tipo-cantidad',
  templateUrl: './crear-tipo-cantidad.component.html',
  styleUrls: ['./crear-tipo-cantidad.component.css']
})
export class CrearTipoCantidadComponent {
  loading = false
  tipoCantidad: TipoCantidad
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoCantidadesService: TipoCantidadesService,

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
  get descripciones(): FormArray {
    return this.form.get('descripciones') as FormArray
  }
  newDescripcion(descripcion?): FormGroup {
    if (descripcion) {
      return this.fb.group({
        info: descripcion.info
      })
    } else {

      return this.fb.group({
        info: ''
      })
    }
  }

  addPaquete() {
    this.descripciones.push(this.newDescripcion());
  }
  addDescripcion() {
    this.descripciones.push(this.newDescripcion());
  }
  setDescripcion(paquete) {
    this.descripciones.push(this.newDescripcion(paquete));
  }
  ub(i: number) {
    this.descripciones.removeAt(i);
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      costo: ['', [Validators.required, Validators.minLength(3)]],
      tipoCosto: ['', [Validators.required, Validators.minLength(3)]],
      tipoPaquete: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      descripciones: this.fb.array([]),
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

      this.tipoCantidadesService.crearTipoCantidad(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoCantidad', 'TipoCantidad creado', 'success')
        this.functionsService.navigateTo('core/tipo-cantidad/vista-tipo-cantidades')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo de Cantidades')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Tipo de Cantidades')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/tipo-cantidad/vista-tipo-cantidades')
  }

}

