import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evento } from 'src/app/core/models/evento.model';

import { EventosService } from 'src/app/core/services/evento.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.scss']
})
export class CrearEventoComponent {
  loading = false
  evento: Evento
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private eventosService: EventosService,

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

      this.eventosService.crearEvento(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Evento', 'Evento creado', 'success')
        this.functionsService.navigateTo('core/eventos/vista-eventos')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Eventos')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Eventos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/eventos/vista-eventos')
  }

}

