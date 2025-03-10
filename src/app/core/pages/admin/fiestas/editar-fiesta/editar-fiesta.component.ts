import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEvento, CargarEventos, CargarFiesta, CargarPaquetes, CargarRoles, CargarSalons, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Evento } from 'src/app/core/models/evento.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Paquete } from 'src/app/core/models/paquete.model';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { EventosService } from 'src/app/core/services/evento.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FileService } from 'src/app/core/services/file.service';
import { PaquetesService } from 'src/app/core/services/paquete.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-fiesta',
  templateUrl: './editar-fiesta.component.html',
  styleUrls: ['./editar-fiesta.component.css']
})
export class EditarFiestaComponent {
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  PRV = environment.prv_role
  URS = environment.user_role
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  salones: Salon[]
  eventos: Evento[]
  paquetes: Paquete[]
  fiesta: Fiesta
  usuarios: Usuario[]
  usuario: Usuario
  submited: boolean = false
  roles: Role[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  cantidadGalerias = 0

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fileService: FileService,
    private eventosService: EventosService,
    private usuariosService: UsuariosService,
    private fiestasServices: FiestasService,
    private route: ActivatedRoute,
    private salonesService: SalonsService,
    private paquetesService: PaquetesService,
  ) {
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']

    this.loading = true
    this.getCatalogos()
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 2000);
  }
  getId(id: string) {


    this.fiestasServices.cargarFiestaById(id).subscribe((resp: CargarFiesta) => {

      this.fiesta = resp.fiesta

      setTimeout(() => {
        this.setForm(this.fiesta)
        this.loading = false
      }, 500);
    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Fiestas')
      })
  }
  getCatalogos() {
    this.loading = true



    if (this.rol === this.ADM) {


      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)


      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = this.functionsService.getActivos(resp.eventos)


      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false


        })
      this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {

        this.usuarios = this.functionsService.getActivos(resp.usuarios)

          ;


      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false


        })
    } else if (this.rol === this.SLN || this.rol == this.ANF || this.rol == this.PRV) {

      this.paquetesService.cargarPaquetesAll().subscribe((resp: CargarPaquetes) => {
        this.paquetes = this.functionsService.getActivos(resp.paquetes)

      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Paquetes')
          this.loading = false
        })
      this.salonesService.cargarSalonByMail(this.email).subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })

      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = this.functionsService.getActivos(resp.eventos)


      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })

      this.usuariosService.cargarUsuarioByCreador(this.uid).subscribe((resp: CargarUsuarios) => {

        this.usuarios = this.functionsService.getActivos(resp.usuarios)


      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
        })

      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {

        this.usuario = resp.usuario

        this.calcularItems(this.usuario.compras)

      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Usuario')
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
      cantidad: ['', [Validators.required]],
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
      croquisCheck: [true],
      example: [false],
      croquis: [''],
      galeria: [''],
      checking: [''],

      croquisOk: [false],
      mesaOk: [''],
      invitacion: [],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(fiesta: any) {


    let fecha = this.functionsService.numberDateTimeLocal(fiesta.fecha)
    let usuarioFiesta = fiesta.usuarioFiesta.nombre
    var evento = fiesta.evento.nombre
    var salon = fiesta.salon.nombre
    setTimeout(() => {
      this.form = this.fb.group({
        nombre: [fiesta.nombre, [Validators.required, Validators.minLength(3)]],
        evento: [(this.edit === 'false') ? evento : fiesta.evento._id, [Validators.required]],
        cantidad: [fiesta.cantidad],
        fecha: [fecha, [Validators.required]],
        calle: [fiesta.salon.calle, [Validators.required]],
        numeroExt: [fiesta.salon.numeroExt, [Validators.required]],
        numeroInt: [fiesta.salon.numeroInt,],
        municipioDelegacion: [fiesta.salon.municipioDelegacion, [Validators.required]],
        coloniaBarrio: [fiesta.salon.coloniaBarrio, [Validators.required]],
        cp: [fiesta.salon.cp, [Validators.required]],
        estado: [fiesta.salon.estado, [Validators.required]],
        pais: [fiesta.salon.pais, [Validators.required]],
        comoLlegar: [fiesta.salon.comoLlegar, [Validators.required]],
        salon: [(this.edit === 'false') ? salon : fiesta.salon._id, [Validators.required]],
        usuarioFiesta: [(this.edit === 'false') ? usuarioFiesta : fiesta.usuarioFiesta._id, [Validators.required]],
        invitacion: [fiesta.invitacion],
        galeria: [fiesta.galeria],
        checking: [fiesta.checking],
        croquisOk: [fiesta.croquisOk],
        mesaOk: [fiesta.mesaOk],
        croquisCheck: [fiesta.croquisCheck],
        example: [fiesta.example],
        activated: [fiesta.activated],
        dateCreated: [fiesta.dateCreated],
        lastEdited: [this.today],
      })
      this.loading = false
    }, 800);

  }

  onSubmit() {
    this.loading = true
    this.submited = true

    if (this.form.valid) {
      if (!this.form.value.checking) {
        this.form.value.cantidad = 0

      }
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
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.fecha = new Date(this.form.value.fecha).getTime()
      this.fiesta = {
        ...this.fiesta,
        ...this.form.value,

      }

      this.fiestasServices.actualizarFiesta(this.fiesta).subscribe((resp: any) => {


        this.functionsService.alertUpdate('Fiestas')
        this.functionsService.navigateTo('core/fiestas/vista-fiestas')
        this.loading = false
      },
        (error) => {
          console.error('Error', error)

          this.loading = true
          this.functionsService.alertError(error, 'Fiestas')


        })
    } else {
      this.functionsService.alertForm('Fiestas')
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }
  cambiarImagen(file: any, type) {

    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null

    } else {


      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result

      }
      this.subirImagen(type)

    }
  }
  subirImagen(type?) {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'fiestas', this.fiesta.uid, type)
      .then(
        (img) => {
          if (type == 'img') {

            this.fiesta.img = img
          } else {

            this.fiesta.croquis = img
          }
          //message
          this.loading = true
          this.imgTemp = undefined
          if (this.fiesta.croquisOk !== this.form.value.croquisOk) {
            this.fiesta.croquisOk = this.form.value.croquisOk
          }


          this.setForm(this.fiesta)

        },
        (err) => {
          console.error('error::: ', err);

        },
      )
  }
  selectSalon(event) {


    this.salonesService.cargarSalonById(event.target.value).subscribe((resp) => {
      setTimeout(() => {

        this.setSalon(resp.salon)

      }, 500);

    })

  }
  setSalon(salon) {


    if (!salon) {
      this.form = this.fb.group({
        nombre: [this.form.value.nombre, [Validators.required, Validators.minLength(3)]],
        evento: [this.form.value.evento, [Validators.required]],
        cantidad: [this.form.value.cantidad, [Validators.required]],
        fecha: [this.form.value.fecha, [Validators.required]],
        usuarioFiesta: [this.form.value.usuarioFiesta, [Validators.required]],
        calle: ['', [Validators.required]],
        numeroExt: ['', [Validators.required]],
        numeroInt: [''],
        municipioDelegacion: ['', [Validators.required]],
        coloniaBarrio: ['', [Validators.required]],
        cp: [''],
        estado: ['', [Validators.required]],
        pais: ['', [Validators.required]],
        comoLlegar: [''],
        lat: [''],
        long: [''],
        salon: [this.form.value.salon, [Validators.required]],

        img: [''],
        activated: [false],
        dateCreated: [this.today],
        lastEdited: [this.today],
      })
      return
    }
    this.form = this.fb.group({
      nombre: [this.form.value.nombre, [Validators.required, Validators.minLength(3)]],
      evento: [this.form.value.evento, [Validators.required]],
      cantidad: [this.form.value.cantidad, [Validators.required]],
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
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  back() {
    this.functionsService.navigateTo('core/fiestas/vista-fiestas')
  }

  calcularItems(items) {
    this.cantidadGalerias = 0
    items.forEach((compra, i) => {
      compra.uso.forEach(us => {
        this.paquetes.forEach(paq => {
          if (paq.uid == us.infoPaq._id) {
            if (paq.tipo != 'eventos') {
              this.cantidadGalerias += (Number(us.cantidad))
              this.cantidadGalerias -= Number(us.cantidadUsada)
            }
          }
        });
      });
    });
    setTimeout(() => {
      this.cantidadGalerias = this.cantidadGalerias
    }, 500);
  }
  restarItems(items, galeria: boolean) {

    this.cantidadGalerias = 0
    var restadoE = false
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
}
