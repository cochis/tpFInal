import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarRoles, CargarSalons, CargarTipoCantidades } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
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
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  ESLTC = environment.ESLTC
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  loading = false
  salones: Salon[]
  roles: Role[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  paquetes: TipoCantidad[] = []
  paqueteSeleccionado: TipoCantidad


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private tipoCantidadesService: TipoCantidadesService
  ) {
    this.loading = true
    // console.log(this.rol)
    // console.log(this.SLN)
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  getCatalogos() {

    this.loading = true
    if ((this.rol === this.ADM)) {

      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)


      },
        (error: any) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false


        })
      this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
        this.roles = this.functionsService.getActivos(resp.roles)

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false


        })
    } else {

      this.rolesService.cargarRolesSalon().subscribe((resp: CargarRoles) => {
        this.roles = this.functionsService.getActivos(resp.roles)

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false


        })
      let mail = this.functionsService.getLocal('email')
      this.salonesService.cargarSalonByMail(mail).subscribe((resp: CargarSalons) => {
        this.salones = this.functionsService.getActivos(resp.salons)


      },
        (error: any) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false


        })
    }
    this.tipoCantidadesService.cargarTipoCantidadesAll().subscribe((resp: CargarTipoCantidades) => {
      this.paquetes = this.functionsService.getActivos(resp.tipoCantidades)
      // console.log('   this.paquetes::: ', this.paquetes);

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Paquetes')
        this.loading = false


      })


  }

  get errorControl() {
    return this.form.controls;
  }
  selectPaquete(event) {
    this.paquetes.forEach(paquete => {
      if (paquete.uid == event) {
        this.paqueteSeleccionado = paquete
      }
    });
    this.form.patchValue({
      cantidadFiestas: this.paqueteSeleccionado.value
    })
  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
      apellidoMaterno: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(".{6,}")]],
      cantidadFiestas: [''],
      paqueteActual: ['',],
      img: [''],
      role: ['', [Validators.required]],
      salon: ['',],
      google: [false],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true

    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase()
      this.form.value.apellidoPaterno = this.form.value.apellidoPaterno.toUpperCase()
      this.form.value.apellidoMaterno = this.form.value.apellidoMaterno.toUpperCase()
      this.form.value.email = this.form.value.email.toLowerCase()
      let usuarioCreated = []
      usuarioCreated.push(this.form.value.usuarioCreated)
      if (this.form.value.salon === '') { this.form.value.salon = undefined }
      let obj = {
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      if (this.rol === this.SLN) {
        this.usuariosService.crearUsuarioSalon(obj, this.uid).subscribe((resp: any) => {

          //Message
          this.functionsService.navigateTo('core/usuarios/vista-usuarios')
          this.loading = false
        },
          (error) => {
            //Message
            this.loading = false
            if (error.error.msg) {
              this.functionsService.alert('Usuarios', error.error.msg, 'error')
            }
            this.functionsService.alertError(error, 'Usuarios')

          })
      } else {

        this.usuariosService.crearUsuario(obj).subscribe((resp: any) => {

          //Message
          this.functionsService.navigateTo('core/usuarios/vista-usuarios')
          this.loading = false
        },
          (error) => {
            //Message
            this.loading = false
            if (error.error.msg) {
              this.functionsService.alert('Usuarios', error.error.msg, 'error')
            }
            this.functionsService.alertError(error, 'Usuarios')

          })
      }
    } else {

      //Message
      this.loading = false
      return // console.log('Please provide all the required values!');
    }






  }

  back() {
    this.functionsService.navigateTo('core/usuarios/vista-usuarios')
  }

}
