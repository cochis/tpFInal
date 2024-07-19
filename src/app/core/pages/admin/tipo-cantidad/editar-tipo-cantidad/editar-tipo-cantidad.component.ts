import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoCantidad } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-cantidad',
  templateUrl: './editar-tipo-cantidad.component.html',
  styleUrls: ['./editar-tipo-cantidad.component.css']
})
export class EditarTipoCantidadComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoCantidad: TipoCantidad
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
    private tipoCantidadesService: TipoCantidadesService,
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
    this.tipoCantidadesService.cargarTipoCantidadById(id).subscribe((resp: CargarTipoCantidad) => {
      this.tipoCantidad = resp.tipoCantidad
      setTimeout(() => {
        this.setForm(this.tipoCantidad)
      }, 500);
    },
      (error: any) => {
        this.functionsService.alertError(error, 'TipoCantidades')
        this.loading = false
      })
  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoCantidad: TipoCantidad) {
    this.form = this.fb.group({
      tipo: [(tipoCantidad.tipo) ? tipoCantidad.tipo : '', [Validators.required, Validators.minLength(3)]],
      nombre: [tipoCantidad.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoCantidad.clave, [Validators.required, Validators.minLength(3)]],
      value: [tipoCantidad.value, [Validators.required]],
      costo: [tipoCantidad.costo, [Validators.required]],
      descripcion: [tipoCantidad.descripcion, [Validators.required, Validators.minLength(3)]],
      activated: [tipoCantidad.activated],
      dateCreated: [tipoCantidad.dateCreated],
      lastEdited: [this.today],
    })
  }
  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('TipoCantidades')
      this.loading = false
      return
    }
    if (this.form.valid) {
      this.tipoCantidad = {
        ...this.tipoCantidad,
        ...this.form.value,
      }
      this.tipoCantidadesService.actualizarTipoCantidad(this.tipoCantidad).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoCantidades')
        this.functionsService.navigateTo('core/tipo-cantidad/vista-tipo-cantidades')
        this.loading = false
      },
        (error) => {
          //message
          this.loading = true
          this.functionsService.alertError(error, 'TipoCantidades')
        })
    } else {
      //message
      this.loading = false
      return console.log('Please provide all the required values!');
    }
  }
  back() {
    this.functionsService.navigateTo('core/tipo-cantidad/vista-tipo-cantidades')
  }
}
