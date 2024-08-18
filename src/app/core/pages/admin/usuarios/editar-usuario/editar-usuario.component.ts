import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarSalons, CargarTipoCentros, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { TipoCentro } from 'src/app/core/models/tipoCentro.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoCentrosService } from 'src/app/core/services/tipoCentros.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  salones: Salon[]
  roles: Role[]
  tipoCentros: TipoCentro[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private tipoCentrosService: TipoCentrosService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getCatalogos()
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.usuariosService.cargarUsuarioById(id).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
      setTimeout(() => {
        this.setForm(this.usuario)
      }, 500);
    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Usuarios')
      })
  }
  getCatalogos() {
    this.loading = true
    if ((this.rol === this.ADM)) {
      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = resp.salons
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
        })
      this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
        this.roles = resp.roles
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
        })
      this.tipoCentrosService.cargarTipoCentrosAll().subscribe((resp: CargarTipoCentros) => {
        this.tipoCentros = this.functionsService.getActives(resp.tipoCentros)
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Tipo de centros de eventos')
          this.loading = false
        })


    } else {
      this.rolesService.cargarRolesSalon().subscribe((resp: CargarRoles) => {
        this.roles = resp.roles
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
        })
      let mail = this.functionsService.getLocal('email')
      this.salonesService.cargarSalonByMail(mail).subscribe((resp: CargarSalons) => {
        this.salones = resp.salons
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
        })
      this.tipoCentrosService.cargarTipoCentrosAll().subscribe((resp: CargarTipoCentros) => {
        this.tipoCentrosService.cargarTipoCentrosAll().subscribe((resp: CargarTipoCentros) => {
          this.tipoCentros = this.functionsService.getActives(resp.tipoCentros)
        },
          (error: any) => {
            console.error('Error', error)
            this.functionsService.alertError(error, 'Tipo de centros de eventos')
            this.loading = false
          })
      },
        (error: any) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Tipo de centros de eventos')
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
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
      apellidoMaterno: [''],
      email: ['', [Validators.required, Validators.email]],
      img: [''],
      cantidadFiestas: [0],
      cantidadGalerias: [0],
      role: ['', [Validators.required, Validators.minLength(3)]],
      tipoCentro: ['', [Validators.required, Validators.minLength(3)]],
      google: [false],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(usuario: Usuario) {


    this.loading = true
    let usr: any = usuario
    var role = (this.edit === 'false') ? usr.role.nombre : usr.role._id

    var tipoCentro = (usr.tipoCentro) ? (this.edit === 'false') ? usr.tipoCentro.nombre : usr.tipoCentro._id : ''
    setTimeout(() => {
      this.form = this.fb.group({
        nombre: [usuario.nombre, [Validators.required, Validators.minLength(3)]],
        apellidoPaterno: [usuario.apellidoPaterno, [Validators.required, Validators.minLength(3)]],
        apellidoMaterno: [usuario.apellidoMaterno],
        email: [usuario.email, [Validators.required, Validators.email]],
        cantidadFiestas: [usuario.cantidadFiestas],
        cantidadGalerias: [usuario.cantidadGalerias],
        role: [role, [Validators.required]],
        tipoCentro: [tipoCentro, [Validators.required]],
        google: [usuario.google],
        activated: [usuario.activated],
        dateCreated: [usuario.dateCreated],
        lastEdited: [this.today],
      })
      this.loading = false
    }, 1500);
  }
  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.usuario = {
        ...this.usuario,
        ...this.form.value,
      }
      this.usuario.email = this.usuario.email.toLowerCase()
      this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Usuarios')
        this.functionsService.navigateTo('core/usuarios/vista-usuarios')
        this.loading = false
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'Usuarios')
        })
    } else {
      this.loading = false
      return console.info('Please provide all the required values!');
    }
  }
  cambiarImagen(file: any) {
    this.loading = true
    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null
      this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
      this.loading = false
    } else {
      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result
      }
      this.subirImagen()
    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then(
        (img) => {
          this.usuario.img = img
          this.loading = false
          this.functionsService.alertUpdate('Usuarios')
        },
        (err) => {
          console.error('Error', err)
          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }
  back() {
    this.functionsService.navigateTo('core/usuarios/vista-usuarios')
  }
  getCatalog(tipo: string, id: string) {
    if (id) {
      switch (tipo) {
        case 'salon':
          return this.functionsService.getValueCatalog(id, 'nombre', this.salones).toString()
          break;
      }
    } else {
      return ''
    }
  }
}
