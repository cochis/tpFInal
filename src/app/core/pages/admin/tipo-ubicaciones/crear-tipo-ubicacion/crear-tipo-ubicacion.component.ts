import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarRoles, CargarTipoUbicacion, CargarTipoUbicaciones } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { TipoUbicacion } from 'src/app/core/models/tipoUbicacion.model';
import { RolesService } from 'src/app/core/services/roles.service';

import { TipoUbicacionesService } from 'src/app/core/services/tipoUbicacion.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-tipo-ubicacion',
  templateUrl: './crear-tipo-ubicacion.component.html',
  styleUrls: ['./crear-tipo-ubicacion.component.scss']
})
export class CrearTipoUbicacionComponent {
  loading = false
  tipoUbicacion: TipoUbicacion
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  roles: Role[]


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoUbicacionesService: TipoUbicacionesService,
    private rolesService: RolesService,

  ) {
    this.loading = true
    this.getCatalogos()
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
      roles: [[], [Validators.required]],

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

      this.tipoUbicacionesService.crearTipoUbicacion(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoUbicacion', 'TipoUbicacion creado', 'success')
        this.functionsService.navigateTo('core/tipo-ubicaciones/vista-tipo-ubicaciones')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TipoUbicaciones')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoUbicaciones')
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

