import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRed } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Red } from 'src/app/core/models/red.model';
import { RedesService } from 'src/app/core/services/red.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-red',
  templateUrl: './editar-red.component.html',
  styleUrls: ['./editar-red.component.scss']
})
export class EditarRedComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  red: Red
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

    private redesService: RedesService,

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

    this.redesService.cargarRedById(id).subscribe((resp: CargarRed) => {

      this.red = resp.red

      setTimeout(() => {

        this.setForm(this.red)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Redes')
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
  setForm(red: Red) {



    this.form = this.fb.group({
      nombre: [red.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [red.clave, [Validators.required, Validators.minLength(3)]],
      activated: [red.activated],
      dateCreated: [red.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Redes')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.red = {
        ...this.red,
        ...this.form.value,


      }
      this.redesService.actualizarRed(this.red).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Redes')
        this.functionsService.navigateTo('redes/vista-redes')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Redes')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('redes/vista-redes')
  }

}
