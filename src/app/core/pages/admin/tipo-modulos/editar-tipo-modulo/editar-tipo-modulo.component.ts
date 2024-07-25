import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoModulo } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';
import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-modulo',
  templateUrl: './editar-tipo-modulo.component.html',
  styleUrls: ['./editar-tipo-modulo.component.css']
})
export class EditarTipoModuloComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoModulo: TipoModulo
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

    private tipoModulosService: TipoModulosService,

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

    this.tipoModulosService.cargarTipoModuloById(id).subscribe((resp: CargarTipoModulo) => {

      this.tipoModulo = resp.tipoModulo
      setTimeout(() => {

        this.setForm(this.tipoModulo)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoModulos')
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
      values: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoModulo: TipoModulo) {
    // // console.log('tipoModulo::: ', tipoModulo);




    this.form = this.fb.group({
      nombre: [tipoModulo.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoModulo.clave, [Validators.required, Validators.minLength(3)]],
      values: [tipoModulo.values, [Validators.required, Validators.minLength(3)]],
      activated: [tipoModulo.activated],
      dateCreated: [tipoModulo.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    this.form.value.values = this.form.value.values.trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('TipoModulos')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoModulo = {
        ...this.tipoModulo,
        ...this.form.value,


      }
      this.tipoModulosService.actualizarTipoModulo(this.tipoModulo).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoModulos')
        this.functionsService.navigateTo('core/tipo-modulos/vista-tipo-modulos')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'TipoModulos')


        })
    } else {

      //message
      this.loading = false

      return //  console.log('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/tipo-modulos/vista-tipo-modulos')
  }

}
