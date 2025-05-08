import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaItem } from 'src/app/core/models/categoriaItem.model';

import { CategoriaItemsService } from 'src/app/core/services/categoriaItem.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-categoria-item',
  templateUrl: './crear-categoria-item.component.html',
  styleUrls: ['./crear-categoria-item.component.scss']
})
export class CrearCategoriaItemComponent {
  loading = false
  categoriaItem: CategoriaItem
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private categoriaItemsService: CategoriaItemsService,

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


      this.categoriaItemsService.crearCategoriaItem(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('CategoriaItem', 'CategoriaItem creado', 'success')
        this.functionsService.navigateTo('core/categoria-items/vista-categoria-items')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'CategoriaItems')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('CategoriaItems')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/categoria-items/vista-categoria-items')
  }

}

