import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';

import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-tipo-media',
  templateUrl: './crear-tipo-media.component.html',
  styleUrls: ['./crear-tipo-media.component.scss']
})
export class CrearTipoMediaComponent {
  loading = false
  tipoMedia: TipoMedia
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoMediasService: TipoMediasService,

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


      this.tipoMediasService.crearTipoMedia(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoMedia', 'TipoMedia creado', 'success')
        this.functionsService.navigateTo('tipo-medios/vista-tipo-medios')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TipoMedias')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoMedias')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('tipo-medios/vista-tipo-medios')
  }

}

