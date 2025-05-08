import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarTipoUbicacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { TipoUbicacion } from 'src/app/core/models/tipoUbicacion.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { TipoUbicacionesService } from 'src/app/core/services/tipoUbicacion.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-ubicacion',
  templateUrl: './editar-tipo-ubicacion.component.html',
  styleUrls: ['./editar-tipo-ubicacion.component.scss']
})
export class EditarTipoUbicacionComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoUbicacion: TipoUbicacion
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  roles: Role[]
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoUbicacionesService: TipoUbicacionesService,
    private rolesService: RolesService,
    private route: ActivatedRoute,

  ) {
    this.getCatalogos()
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

    this.tipoUbicacionesService.cargarTipoUbicacionById(id).subscribe((resp: CargarTipoUbicacion) => {

      this.tipoUbicacion = resp.tipoUbicacion


      setTimeout(() => {

        this.setForm(this.tipoUbicacion)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Tipo de Ubicaciones')
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
      roles: [[], [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoUbicacion: TipoUbicacion) {



    this.form = this.fb.group({
      nombre: [tipoUbicacion.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoUbicacion.clave, [Validators.required, Validators.minLength(3)]],
      roles: [tipoUbicacion.roles, [Validators.required]],
      activated: [tipoUbicacion.activated],
      dateCreated: [tipoUbicacion.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Tipo de Ubicaciones')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoUbicacion = {
        ...this.tipoUbicacion,
        ...this.form.value,


      }
      this.tipoUbicacionesService.actualizarTipoUbicacion(this.tipoUbicacion).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Tipo de Ubicaciones')
        this.functionsService.navigateTo('core/tipo-ubicaciones/vista-tipo-ubicaciones')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Tipo de Ubicaciones')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }

  getCatalogos() {
    this.rolesService.cargarRolesInit().subscribe((resp: CargarRoles) => {
      this.roles = resp.roles

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Registro')
      })
  }
  back() {
    this.functionsService.navigateTo('core/tipo-ubicaciones/vista-tipo-ubicaciones')
  }

}
