import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarEventos, CargarPaquetes, CargarRoles, CargarSalons, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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
import { PaquetesService } from 'src/app/core/services/paquete.service';
import { Paquete } from 'src/app/core/models/paquete.model';

import Swal from 'sweetalert2';
import { ByFileComponent } from '../../templates/by-file/by-file.component';

@Component({
  selector: 'app-crear-fiesta',
  templateUrl: './crear-fiesta.component.html',
  styleUrls: ['./crear-fiesta.component.css']
})
export class CrearFiestaComponent {
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  loading = false
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  eventos: Evento[]
  usuarios: Usuario[]

  salones: Salon[]
  roles: Role[]
  paquetes: Paquete[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  todayDate: any
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  rol = this.functionsService.getLocal('role')
  cantidadFiestas = 0
  cantidadGalerias = 0
  salonSelect = ''
  usuarioSelect: any
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private eventosService: EventosService,
    private salonesService: SalonsService,
    private usuariosService: UsuariosService,
    private paquetesService: PaquetesService,
    private readonly _modalService: ModalService
  ) {
    this.getUsersById()
    this.loading = true
    this.getCatalogos()
    this.todayDate = this.functionsService.numberToDate(this.today)
    this.createForm()
    this.loading = false

  }
  getCatalogos() {
    this.loading = true
    this.paquetesService.cargarPaquetesAll().subscribe((resp: CargarPaquetes) => {
      this.paquetes = this.functionsService.getActivos(resp.paquetes)
    },
      (error: any) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Paquetes')
        this.loading = false
      })
    if (this.rol === this.ADM) {
      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)
      },
        (error: any) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = this.functionsService.getActivos(resp.eventos)
      },
        (error: any) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
        this.usuarios = this.functionsService.getActivos(resp.usuarios)
        /* this.usuarios = this.usuarios.filter((usuario) => usuario.uid != this.uid); */
      },
        (error: any) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.usuariosService.cargarUsuarioById(this.uid).subscribe(resp => {
        this.usuario = resp.usuario
      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
    } else if (this.rol !== this.ADM) {

      this.salonesService.cargarSalonByMail(this.email).subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)
      },
        (error: any) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = this.functionsService.getActivos(resp.eventos)
      },
        (error: any) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.usuariosService.cargarUsuarioByCreador(this.uid).subscribe((resp: CargarUsuarios) => {
        this.usuarios = this.functionsService.getActivos(resp.usuarios)
        this.usuarios = this.usuarios.filter((usuario) => usuario.uid != this.uid);
      },
        (error: any) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })

      this.usuariosService.cargarUsuarioById(this.uid).subscribe(resp => {
        this.usuario = resp.usuario
        this.cantidadFiestas = this.usuario.cantidadFiestas
        this.cantidadGalerias = this.usuario.cantidadGalerias

        this.calcularItems(this.usuario.compras)






      },
        (error) => {
          console.error('error::: ', error);
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
      cantidad: [''],
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
      usuarioFiesta: [(this.rol == this.ANF) ? this.uid : '', [Validators.required]],
      img: [''],
      galeria: [false],
      croquisOk: [false],
      checking: [false],
      example: [false],
      mesaOk: [false],
      invitacion: ['', [Validators.required]],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })

  }
  onSubmit() {



    if (this.rol != this.ADM && Number(this.functionsService.dateToNumber(this.form.value.fecha)) < Number(this.today)) {
      this.functionsService.alert('Fiesta', 'La fecha del evento no puede ser menor al dia de hoy', 'info')
      this.loading = false
      return
    }

    if (this.rol != this.ADM && this.form.value.checking && this.form.value.cantidad < 50) {
      this.functionsService.alert('Fiesta', 'La cantidad de invitados tiene que ser mayor a 50', 'info')
      this.loading = false
      return
    }



    this.loading = true
    this.submited = true


    if (!this.form.value.checking) {
      this.form.value.cantidad = 0
    }
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase()
      this.form.value.fecha = new Date(this.form.value.fecha).getTime()
      let form = {
        ...this.form.value,
        usuarioCreated: this.salonSelect,
        activated: true,
        realizada: false
      }




      this.fiestasService.crearFiesta(form).subscribe((resp: any) => {
        var rp = resp
        if (this.usuario.cantidadFiestas == 0 && this.usuario.cantidadGalerias == 0) {

          this.restarItems(this.usuarioSelect.compras, this.form.value.galeria)
          this.loading = false
          this.functionsService.alert('Fiestas', 'Fiesta creada', 'success')


          this.functionsService.navigateTo(`/core/fiestas/editar-fiesta/true/${resp.fiesta.uid}`)

          /*   if (rp.fiesta.invitacion.includes('default')) {
  
              this.functionsService.navigateTo(`core/invitaciones/editar-invitacion/true/${resp.fiesta.uid}`)
            } else {
  
              this.functionsService.navigateTo(`core/fiestas/vista-fiestas`)
            } */

        } else {
          this.usuario.cantidadFiestas--
          this.usuario.cantidadGalerias--

          this.usuariosService.actualizarUsuario(this.usuario).subscribe((respU: any) => {
            this.loading = false
            this.functionsService.alert('Fiestas', 'Fiesta creada', 'success')
            this.functionsService.navigateTo(`core/fiestas/editar-fiesta/true/${resp.fiesta.uid}`)
            /* if (rp.fiesta.invitacion.includes('default')) {
              Swal.fire({
                title: "¿ Deseas agregar alguna imagen ?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Si",
                denyButtonText: `No`
              }).then((result) => {
                this.functionsService.navigateTo(`core/fiestas/editar-fiesta/true/${resp.fiesta.uid}`)
              });
              //this.functionsService.navigateTo(`core/invitaciones/editar-invitacion/true/${resp.fiesta.uid}`)
              //this.functionsService.navigateTo(`core/mis-fiestas`)
            } else {

              this.functionsService.navigateTo(`core/fiestas/vista-fiestas`)
            } */

          })
        }




      },
        (error) => {
          console.error('error::: ', error);
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
    } else {
      this.functionsService.alertForm('Fiestas')
      this.loading = false
      return console.info('Please provide all the required values!');
    }
  }
  selectSalon(event) {
    this.salonesService.cargarSalonById(event.target.value).subscribe((resp) => {

      setTimeout(() => {

        this.salonSelect = resp.salon.usuarioCreated

        this.usuariosService.cargarUsuarioById(this.salonSelect).subscribe(resp => {


          this.usuarioSelect = resp.usuario


          if (this.usuarioSelect.role.clave != this.ADM) {

            this.cantidadFiestas = this.usuarioSelect.cantidadFiestas
            this.cantidadGalerias = this.usuarioSelect.cantidadGalerias
          } else {

            this.cantidadFiestas = 1

            this.cantidadGalerias = 1
          }

          this.calcularItems(this.usuarioSelect.compras)
        })



        this.setSalon(resp.salon)
      }, 500);
    })
  }
  setSalon(salon) {


    this.form = this.fb.group({
      nombre: [this.form.value.nombre, [Validators.required, Validators.minLength(3)]],
      evento: [this.form.value.evento, [Validators.required]],
      cantidad: [this.form.value.cantidad],
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
      galeria: [this.form.value.galeria],
      croquisOk: [this.form.value.galeria],
      checking: [this.form.value.checking],
      example: [this.form.value.example],
      mesaOk: [this.form.value.mesaOk],
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
    } else {
      this._modalService.show<Template>(ByFileComponent, {
        title: 'Ver invitación',
        size: 1,
        model: id,
        mode: 'default'
      })

    }
  }
  calcularItems(items = []) {

    this.loading = true

    setTimeout(() => {
      this.cantidadFiestas = this.cantidadFiestas
      this.cantidadGalerias = this.cantidadGalerias
      items.forEach((compra, i) => {
        compra.uso.forEach(us => {
          this.paquetes.forEach(paq => {
            if (paq.uid == us.infoPaq._id) {

              if (paq.tipo == 'eventos') {
                this.cantidadFiestas += (Number(us.cantidad))
                this.cantidadFiestas -= Number(us.cantidadUsada)
              } else {
                this.cantidadGalerias += (Number(us.cantidad))
                this.cantidadGalerias -= Number(us.cantidadUsada)
              }
            }
          });
        });
      });
      this.cantidadGalerias = this.cantidadGalerias
      this.cantidadFiestas = this.cantidadFiestas


      if (this.rol == this.ADM) {

        if (this.cantidadFiestas <= 0) {
          this.functionsService.alert('Fiestas', 'Ese  salon no tiene fiestas disponibles', 'error')

        }
        if (this.cantidadFiestas <= 0) {
          this.form.patchValue({
            galeria: false
          })
        }
      }
      this.loading = false
    }, 500);

  }

  restarItems(items, galeria: boolean) {
    this.cantidadFiestas = 0
    this.cantidadGalerias = 0
    var restadoE = true
    var restadoG = true
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].uso.length; j++) {


        this.paquetes.forEach(paq => {

          if (paq.uid == items[i].uso[j].infoPaq._id) {
            if (this.usuario.compras[i].uso[j].cantidad - this.usuario.compras[i].uso[j].cantidadUsada == 0) {
              this.usuario.compras[i].activated == false
            }
            if (paq.tipo == 'eventos' && restadoE && (this.usuario.compras[i].uso[j].cantidad - this.usuario.compras[i].uso[j].cantidadUsada) > 0 && this.usuario.compras[i].activated) {
              this.usuario.compras[i].uso[j].cantidadUsada = this.usuario.compras[i].uso[j].cantidadUsada + 1
              restadoE = false


            } else if (paq.tipo == "galerias" && galeria && restadoG && (this.usuario.compras[i].uso[j].cantidad - this.usuario.compras[i].uso[j].cantidadUsada) > 0 && this.usuario.compras[i].activated) {
              this.usuario.compras[i].uso[j].cantidadUsada = this.usuario.compras[i].uso[j].cantidadUsada + 1
              galeria = false
              restadoG = false


            }
          }

        });

      }
    }
    this.usuariosService.actualizarUsuario(this.usuario).subscribe(async (resp: any) => {

      this.calcularItems(resp.usuarioActualizado.compras)
      return await resp.usuario
    })
  }

  getUsersById() {
    this.usuariosService.cargarUsuarioByCreador(this.uid).subscribe((resp) => {

      if (resp.usuarios.length == 1 && this.rol == this.SLN) {

        this.functionsService.alert('Usuarios', 'No tienes ningún anfitrión ', 'info')
        this.functionsService.navigateTo('/core/usuarios/crear-usuario')
      }

    })
  }

}
