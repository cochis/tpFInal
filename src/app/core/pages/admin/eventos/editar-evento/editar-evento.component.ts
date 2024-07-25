import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEvento } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Evento } from 'src/app/core/models/evento.model';
import { EventosService } from 'src/app/core/services/evento.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  evento: Evento
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private eventosService: EventosService,

    private route: ActivatedRoute,

  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.eventosService.cargarEventoById(id).subscribe((resp: CargarEvento) => {

      this.evento = resp.evento
      setTimeout(() => {

        this.setForm(this.evento)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Eventos')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(evento: Evento) {



    this.form = this.fb.group({
      nombre: [evento.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [evento.clave, [Validators.required, Validators.minLength(3)]],
      activated: [evento.activated],
      dateCreated: [evento.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Eventos')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.evento = {
        ...this.evento,
        ...this.form.value,


      }
      this.eventosService.actualizarEvento(this.evento).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Eventos')
        this.functionsService.navigateTo('core/eventos/vista-eventos')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Eventos')


        })
    } else {

      //message
      this.loading = false

      return // console.log('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/eventos/vista-eventos')
  }

}
