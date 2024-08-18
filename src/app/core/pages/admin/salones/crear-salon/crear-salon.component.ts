import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';

import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-salon',
  templateUrl: './crear-salon.component.html',
  styleUrls: ['./crear-salon.component.css']
})
export class CrearSalonComponent {
  loading = false
  salones: Salon[]
  submited: boolean = false
  usuarios: Usuario[]
  SLN = environment.salon_role
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  ADM = environment.admin_role

  URS = environment.user_role
  CHK = environment.chk_role
  ANF = environment.anf_role
  rol = this.functionsService.getLocal('role')
  email = this.functionsService.getLocal('email')


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private usuariosService: UsuariosService,

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
      nombre: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numeroExt: ['', [Validators.required]],
      numeroInt: [''],
      municipioDelegacion: ['', [Validators.required]],
      coloniaBarrio: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.pattern(".{5,5}")]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      comoLlegar: ['', [Validators.required]],
      lat: [''],
      long: [''],
      telefono: ['', [Validators.required, Validators.pattern(".{10,10}")]],
      email: [this.functionsService.getLocal('email'), [Validators.required, Validators.email]],
      ubicacionGoogle: [''],
      img: [''],
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
      this.form.value.calle = this.form.value.calle.toUpperCase().trim()
      this.form.value.numeroExt = this.form.value.numeroExt.toUpperCase().trim()
      this.form.value.numeroInt = this.form.value.numeroInt.toUpperCase().trim()
      this.form.value.municipioDelegacion = this.form.value.municipioDelegacion.toUpperCase().trim()
      this.form.value.coloniaBarrio = this.form.value.coloniaBarrio.toUpperCase().trim()
      this.form.value.estado = this.form.value.estado.toUpperCase().trim()
      this.form.value.pais = this.form.value.pais.toUpperCase().trim()
      this.form.value.ubicacionGoogle = this.form.value.ubicacionGoogle.toLowerCase().trim()
      this.form.value.comoLlegar = this.form.value.comoLlegar.toUpperCase().trim()
      this.form.value.direccion = `${this.form.value.calle}  ${this.form.value.numeroExt},   ${this.form.value.numeroInt}, colonia o barrio ${this.form.value.coloniaBarrio}, municipio o delegación ${this.form.value.municipioDelegacion}, estado ${this.form.value.estado} en ${this.form.value.pais} `


      this.salonesService.crearSalon(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Centro de eventos', 'Creado', 'success')
        this.functionsService.navigateTo('core/salones/vista-salones')
        this.loading = false
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'Centro de eventos')

        })
    } else {

      this.functionsService.alertForm('Centro de eventos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }
  getCatalogos() {
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = resp.usuarios


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Centro de eventos')
        this.loading = false
      })
  }
  back() {
    this.functionsService.navigateTo('core/salones/vista-salones')
  }





}
