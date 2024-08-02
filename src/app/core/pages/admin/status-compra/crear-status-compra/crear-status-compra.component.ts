import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCompra } from 'src/app/core/models/statusCompra.model';

import { StatusComprasService } from 'src/app/core/services/statusCompra.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-status-compra',
  templateUrl: './crear-status-compra.component.html',
  styleUrls: ['./crear-status-compra.component.css']
})
export class CrearStatusCompraComponent {
  loading = false
  statusCompra: StatusCompra
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private statusComprasService: StatusComprasService,

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

      this.statusComprasService.crearStatusCompra(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Estatus de compra', 'Estatus de compra creado', 'success')
        this.functionsService.navigateTo('core/status-compra/vista-status-compra')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Estatus de compra')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Estatus de compra')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/status-compra/vista-status-compra')
  }

}


