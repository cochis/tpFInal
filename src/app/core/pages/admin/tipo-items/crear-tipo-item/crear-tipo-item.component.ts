import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoItem } from 'src/app/core/models/tipoItem.model';

import { TipoItemsService } from 'src/app/core/services/tipoItem.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-tipo-item',
  templateUrl: './crear-tipo-item.component.html',
  styleUrls: ['./crear-tipo-item.component.css']
})
export class CrearTipoItemComponent {
  loading = false
  tipoItem: TipoItem
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoItemsService: TipoItemsService,

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


      this.tipoItemsService.crearTipoItem(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoItem', 'TipoItem creado', 'success')
        this.functionsService.navigateTo('core/tipo-items/vista-tipo-items')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TipoItems')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoItems')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/tipo-items/vista-tipo-items')
  }

}

