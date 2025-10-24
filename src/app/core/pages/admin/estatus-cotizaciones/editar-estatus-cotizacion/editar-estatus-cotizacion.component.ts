import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEstatusCotizacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EstatusCotizacion } from 'src/app/core/models/estatusCotizacion.model';
import { EstatusCotizacionesService } from 'src/app/core/services/estatusCotizaciones.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-estatus-cotizacion',
  templateUrl: './editar-estatus-cotizacion.component.html',
  styleUrls: ['./editar-estatus-cotizacion.component.scss']
})
export class EditarEstatusCotizacionComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  estatusCotizacion: EstatusCotizacion
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

    private estatusCotizacionesService: EstatusCotizacionesService,

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

    this.estatusCotizacionesService.cargarEstatusCotizacionById(id).subscribe((resp: CargarEstatusCotizacion) => {

      this.estatusCotizacion = resp.estatusCotizacion

      setTimeout(() => {

        this.setForm(this.estatusCotizacion)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'EstatusCotizaciones')
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
      step: [0, [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(estatusCotizacion: EstatusCotizacion) {



    this.form = this.fb.group({
      nombre: [estatusCotizacion.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [estatusCotizacion.clave, [Validators.required, Validators.minLength(3)]],
      step: [estatusCotizacion.step],
      activated: [estatusCotizacion.activated],
      dateCreated: [estatusCotizacion.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('EstatusCotizaciones')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.estatusCotizacion = {
        ...this.estatusCotizacion,
        ...this.form.value,


      }
      this.estatusCotizacionesService.actualizarEstatusCotizacion(this.estatusCotizacion).subscribe((resp: any) => {
        this.functionsService.alertUpdate('EstatusCotizaciones')
        this.functionsService.navigateTo('estatus-cotizaciones/vista-estatus-cotizaciones')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'EstatusCotizaciones')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('estatus-cotizaciones/vista-estatus-cotizaciones')
  }

}
