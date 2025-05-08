import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarSalons, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  salones: Salon[]
  roles: Role[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id = this.functionsService.getLocal('uid')
  edit!: string
  url = environment.base_url
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.edit = 'false'
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
        this.functionsService.alertError(error, 'Perfil')
      })
  }
  getCatalogos() {
    this.loading = true
    if ((this.rol === this.ADM)) {
      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = resp.salons
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Perfil')
          this.loading = false
        })
      this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
        this.roles = resp.roles
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Perfil')
          this.loading = false
        })
    } else {
      this.rolesService.cargarRolesSalon().subscribe((resp: CargarRoles) => {
        this.roles = resp.roles
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Perfil')
          this.loading = false
        })
      let mail = this.functionsService.getLocal('email')
      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = resp.salons
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Perfil')
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
      telefono: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      img: [''],
      role: ['', [Validators.required, Validators.minLength(3)]],
      salon: [''],
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
    var salon = ''
    usuario.salon.forEach((element: any) => {
      salon = salon + element.nombre + ', '
    });
    salon.substring(salon.length - (salon.length + 1))
    setTimeout(() => {
      this.form = this.fb.group({
        nombre: [usuario.nombre, [Validators.required, Validators.minLength(3)]],
        apellidoPaterno: [usuario.apellidoPaterno, [Validators.required, Validators.minLength(3)]],
        apellidoMaterno: [usuario.apellidoMaterno],
        email: [usuario.email, [Validators.required, Validators.email]],
        telefono: [(usuario.telefono) ? usuario.telefono : '', Validators.required],
        password: [usuario.password, [Validators.required]],
        newPassword: [usuario.password, [Validators.required]],
        role: [role, [Validators.required]],
        salon: [salon.substring(0, (salon.length - 2)), [Validators.required]],
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
        this.form.reset()
        this.functionsService.alertUpdate('Usuarioss')
        this.functionsService.navigateTo('core/usuarios/vista-usuarios')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
          this.functionsService.alertError(error, 'Perfil')
        })
    } else {
      this.loading = false
      return console.info('Please provide all the required values!');
    }
  }
  cambiarImagen(file: any) {

    if (file.target.files[0].type.includes('image')) {
      if (file.target.files[0].size > 1048576) {
        this.functionsService.alert('Media', 'El tamaño maximo del archivo que tiene que ser la imagen  tiene que ser de 1 MB', 'warning')
      }
    } else if (file.target.files[0].type.includes('video')) {
      if (file.target.files[0].size > 5242880) {
        this.functionsService.alert('Media', 'El tamaño maximo del archivo que tiene que ser la imagen  tiene que ser de  5 MB', 'warning')
      }
    } else if (file.target.files[0].type.includes('audio')) {
      if (file.target.files[0].size > 3621440) {
        this.functionsService.alert('Media', 'El tamaño maximo del archivo que tiene que ser la imagen  tiene que ser de  3 MB', 'warning')
      }
    }
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
          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }
  back() {
    this.functionsService.navigateTo("/core/inicio")
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
  updatePass(newPass: string) {
    this.usuario.password = newPass
    setTimeout(() => {
      this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Usuarios')
        this.loading = false
        this.modalService.dismissAll();
      },
        (error) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false
        })
    }, 500);
    return
  }
  changePass(content) {
    this.modalService.open(content);
  }
}
