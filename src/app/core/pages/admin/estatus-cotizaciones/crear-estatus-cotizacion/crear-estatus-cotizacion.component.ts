import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstatusCotizacion } from 'src/app/core/models/estatusCotizacion.model';
import { EstatusCotizacionesService } from 'src/app/core/services/estatusCotizaciones.service';

import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-estatus-cotizacion',
  templateUrl: './crear-estatus-cotizacion.component.html',
  styleUrls: ['./crear-estatus-cotizacion.component.scss']
})
export class CrearEstatusCotizacionComponent {
  loading = false
  estatusCotizacion: EstatusCotizacion
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private estatusCotizacionesService: EstatusCotizacionesService,

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
      step: ['', [Validators.required]],

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

      this.estatusCotizacionesService.crearEstatusCotizacion(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('EstatusCotizacion', 'EstatusCotizacion creado', 'success')
        this.functionsService.navigateTo('core/estatus-cotizaciones/vista-estatus-cotizaciones')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'EstatusCotizaciones')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('EstatusCotizaciones')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/estatus-cotizaciones/vista-estatus-cotizaciones')
  }

}

