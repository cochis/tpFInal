import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarParametro } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Parametro } from 'src/app/core/models/parametro.model';
import { ParametrosService } from 'src/app/core/services/parametro.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar-parametro',
  templateUrl: './editar-parametro.component.html',
  styleUrls: ['./editar-parametro.component.css']
})
export class EditarParametroComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  parametro: Parametro
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

    private parametrosService: ParametrosService,

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

    this.parametrosService.cargarParametroById(id).subscribe((resp: CargarParametro) => {

      this.parametro = resp.parametro
      setTimeout(() => {

        this.setForm(this.parametro)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Parametros')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(parametro: Parametro) {



    this.form = this.fb.group({
      nombre: [parametro.nombre, [Validators.required, Validators.minLength(3)]],
      type: [parametro.type, [Validators.required, Validators.minLength(3)]],
      value: [parametro.value, [Validators.required]],
      clave: [parametro.clave, [Validators.required, Validators.minLength(3)]],
      activated: [parametro.activated],
      dateCreated: [parametro.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Parametros')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.parametro = {
        ...this.parametro,
        ...this.form.value,


      }
      this.parametrosService.actualizarParametro(this.parametro).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Parametros')
        this.functionsService.navigateTo('core/parametros/vista-parametros')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Parametros')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/parametros/vista-parametros')
  }

}
