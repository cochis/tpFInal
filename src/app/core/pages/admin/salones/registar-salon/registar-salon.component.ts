import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CargarTipoCantidad, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

import { Salon } from 'src/app/core/models/salon.model';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';
import { Usuario } from 'src/app/core/models/usuario.model';

import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-registar-salon',
  templateUrl: './registar-salon.component.html',
  styleUrls: ['./registar-salon.component.css']
})
export class RegistarSalonComponent {
  loading = false
  salones: Salon[]


  public form!: FormGroup
  EVTRGL = environment.EVTRGL
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  usuario: Usuario

  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  tipoCantidad: TipoCantidad
  role = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private usuariosService: UsuariosService,
    private tipoCantidadesService: TipoCantidadesService,
    private modalService: NgbModal,
  ) {
    this.getCatalogos()
    if (this.functionsService.getLocal('uid')) {

      this.uid = this.functionsService.getLocal('uid')
    }


    this.loading = true

    this.createForm()
    this.getUser()

    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getUser() {


    this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
      //console.log('this.usuario ::: ', this.usuario);


    },
      (error) => {
        this.functionsService.alertError(error, 'Home')
      })

  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      nombre: [''],
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
      ubicacionGoogle: [''],
      telefono: ['', [Validators.required, Validators.pattern(".{10,10}")]],
      email: [this.functionsService.getLocal('email'), [Validators.required, Validators.email]],
      img: [''],
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
      this.form.value.calle = this.form.value.calle.toUpperCase().trim()
      this.form.value.numeroExt = this.form.value.numeroExt.toUpperCase().trim()
      this.form.value.numeroInt = this.form.value.numeroInt.toUpperCase().trim()
      this.form.value.municipioDelegacion = this.form.value.municipioDelegacion.toUpperCase().trim()
      this.form.value.coloniaBarrio = this.form.value.coloniaBarrio.toUpperCase().trim()
      this.form.value.estado = this.form.value.estado.toUpperCase().trim()
      this.form.value.pais = this.form.value.pais.toUpperCase().trim()
      this.form.value.comoLlegar = this.form.value.comoLlegar.toUpperCase().trim()
      this.form.value.direccion = `${this.form.value.calle}  ${this.form.value.numeroExt},   ${this.form.value.numeroInt}, colonia o barrio ${this.form.value.coloniaBarrio}, municipio o delegación ${this.form.value.municipioDelegacion}, CP. ${this.form.value.cp} estado ${this.form.value.estado} en ${this.form.value.pais} `

      let salon = {
        ...this.form.value,
        activated: true
      }

      this.salonesService.crearSalon(salon).subscribe((resp: any) => {


        this.functionsService.alert('Centro de Eventos', 'Creado', 'success')

        this.usuario.salon = resp.salon.uid
        this.usuario.lastEdited = this.functionsService.getToday()

        this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp: CargarUsuario) => {
          this.functionsService.alert('Centro de Eventos', 'Se ha registrado tu centro de eventos', 'success')

          this.loading = false
          this.functionsService.navigateTo('core')
        },
          (error) => {
            this.functionsService.alertError(error, 'Centro de Eventos')
            this.loading = false
          })
      },
        (error) => {
          this.functionsService.alertError(error, 'Centro de Eventos')
          this.loading = false


        })
    } else {

      this.functionsService.alertForm('Centro de Eventos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }




  }

  getCatalogos() {
    this.tipoCantidadesService.cargarTipoCantidadByClave(this.EVTRGL).subscribe((resp: CargarTipoCantidad) => {
      this.tipoCantidad = resp.tipoCantidad
    },
      (error) => {
        this.functionsService.alertError(error, 'Paquetes')
        console.error('Error', error)

      })
  }
  back() {
    this.functionsService.navigateTo('core/salones/vista-salones')
  }
  showInfo(content) {
    this.modalService.open(content, { fullscreen: true });
  }
}
