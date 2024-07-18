import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarEventos, CargarRoles, CargarSalons, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Evento } from 'src/app/core/models/evento.model';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { EventosService } from 'src/app/core/services/evento.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';

import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { ModalTemplateComponent } from 'src/app/shared/components/modals/modal-template/modal-template.component';
import { Template } from 'src/app/core/models/template.model';
import { DefaultComponent } from '../../templates/default/default.component';



@Component({
  selector: 'app-crear-fiesta',
  templateUrl: './crear-fiesta.component.html',
  styleUrls: ['./crear-fiesta.component.css']
})
export class CrearFiestaComponent {
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  loading = false
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  eventos: Evento[]
  usuarios: Usuario[]
  salones: Salon[]
  roles: Role[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  todayDate: any
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  rol = this.functionsService.getLocal('role')

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private eventosService: EventosService,
    private salonesService: SalonsService,
    private usuariosService: UsuariosService,
    private readonly _modalService: ModalService
  ) {



    this.todayDate = this.functionsService.numberToDate(this.today)
    this.loading = true
    this.getCatalogos()
    this.createForm()
    this.loading = false

  }



  getCatalogos() {
    this.loading = true


    if (this.rol === this.ADM) {


      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)
        // console.log('this.salones::: ', this.salones);


      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = this.functionsService.getActivos(resp.eventos)

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false


        })
      this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {

        this.usuarios = this.functionsService.getActivos(resp.usuarios)
        // console.log('this.uid::: ', this.uid);
        this.usuarios = this.usuarios.filter((usuario) => usuario.uid != this.uid);
        // console.log(' this.usuarios::: ', this.usuarios);


      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false


        })
      this.usuariosService.cargarUsuarioById(this.uid).subscribe(resp => {
        this.usuario = resp.usuario
        // console.log('this.usuario ::: ', this.usuario);
      },
        (error) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
    } else if (this.rol !== this.ADM) {


      this.salonesService.cargarSalonByMail(this.email).subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)
        // console.log('this.salones::: ', this.salones);

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })

      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = this.functionsService.getActivos(resp.eventos)

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.usuariosService.cargarUsuarioByCreador(this.uid).subscribe((resp: CargarUsuarios) => {
        // console.log('this.email::: ', this.email);
        // console.log('resp::: ', resp);


        this.usuarios = this.functionsService.getActivos(resp.usuarios)
        // console.log('this.uid::: ', this.uid);
        this.usuarios = this.usuarios.filter((usuario) => usuario.uid != this.uid);

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })

      this.usuariosService.cargarUsuarioById(this.uid).subscribe(resp => {
        this.usuario = resp.usuario
        // console.log('this.usuario ::: ', this.usuario);
      },
        (error) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
    }

  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      evento: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(50)]],
      fecha: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numeroExt: ['', [Validators.required]],
      numeroInt: [''],
      municipioDelegacion: ['', [Validators.required]],
      coloniaBarrio: ['', [Validators.required]],
      cp: [''],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      comoLlegar: [''],
      salon: ['', [Validators.required]],
      usuarioFiesta: ['', [Validators.required]],
      img: [''],
      invitacion: ['', [Validators.required]],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
    // console.log('this.form.value::: ', this.form.value.invitacion);
    // console.log('this.form.value::: ', this.form.value);


    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase()
      this.form.value.fecha = new Date(this.form.value.fecha).getTime()
      let form = {
        ...this.form.value,
        activated: false,
        realizada: false
      }


      this.fiestasService.crearFiesta(this.form.value).subscribe((resp: any) => {

        // console.log('this.usuario', this.usuario)
        this.usuario.cantidadFiestas = this.usuario.cantidadFiestas - 1
        this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp2: any) => {
          // console.log('resp2', resp2)
          this.loading = false
          this.functionsService.alert('Fiestas', 'Fiesta creada', 'success')
          this.functionsService.navigateTo(`core/invitaciones/editar-invitacion/true/${resp.fiesta.uid}`)
        },
          (error) => {
            this.functionsService.alertError(error, 'Fiestas')
            this.loading = false
          })
      },
        (error) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false


        })
    } else {

      this.functionsService.alertForm('Fiestas')
      this.loading = false
      return // console.log('Please provide all the required values!');
    }






  }
  selectSalon(event) {

    this.salonesService.cargarSalonById(event.target.value).subscribe((resp) => {
      setTimeout(() => {

        this.setSalon(resp.salon)
      }, 500);

    })

  }
  setSalon(salon) {
    this.form = this.fb.group({
      nombre: [this.form.value.nombre, [Validators.required, Validators.minLength(3)]],
      evento: [this.form.value.evento, [Validators.required]],
      cantidad: [this.form.value.cantidad, [Validators.required]],
      invitacion: [this.form.value.invitacion, [Validators.required]],
      fecha: [this.form.value.fecha, [Validators.required]],
      usuarioFiesta: [this.form.value.usuarioFiesta, [Validators.required]],
      calle: [salon.calle, [Validators.required]],
      numeroExt: [salon.numeroExt, [Validators.required]],
      numeroInt: [salon.numeroInt],
      municipioDelegacion: [salon.municipioDelegacion, [Validators.required]],
      coloniaBarrio: [salon.coloniaBarrio, [Validators.required]],
      cp: [salon.cp],
      estado: [salon.estado, [Validators.required]],
      pais: [salon.pais, [Validators.required]],
      comoLlegar: [salon.comoLlegar],
      lat: [salon.lat],
      long: [salon.long],
      salon: [this.form.value.salon, [Validators.required]],
      img: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  back() {
    this.functionsService.navigateTo('core/fiestas/vista-fiestas')
  }
  showTemplate(id) {
    if (id == 'default') {

      this._modalService.show<Template>(DefaultComponent, {
        title: 'Ver invitación',
        size: 1,
        model: id,
        mode: 'default'
      })
    }
  }
}
