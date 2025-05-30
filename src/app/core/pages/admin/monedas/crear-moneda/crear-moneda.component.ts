import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Moneda } from 'src/app/core/models/moneda.model';

import { MonedasService } from 'src/app/core/services/moneda.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-moneda',
  templateUrl: './crear-moneda.component.html',
  styleUrls: ['./crear-moneda.component.scss']
})
export class CrearMonedaComponent {
  loading = false
  moneda: Moneda
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private monedasService: MonedasService,

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
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.monedasService.crearMoneda(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Moneda', 'Moneda creado', 'success')
        this.functionsService.navigateTo('core/monedas/vista-monedas')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Monedas')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Monedas')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/monedas/vista-monedas')
  }

}

