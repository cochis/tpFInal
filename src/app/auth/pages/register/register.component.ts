import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { environment } from 'src/environments/environment';
import { RolesService } from 'src/app/core/services/roles.service';
import { CargarRole, CargarRoles, CargarTipoCantidad } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { error } from 'jquery';
import { Role } from 'src/app/core/models/role.model';
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';
import { SwPush } from '@angular/service-worker';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  today = this.functionsService.getToday()
  loading = false
  vieWPass = false
  EVTRGL = environment.EVTRGL
  tipoCantidad: TipoCantidad
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  slnRole: Role
  usrRole: Role
  anfRole: Role
  roles: Role[]
  submited = false
  respuesta: any = undefined
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
    apellidoMaterno: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(".{6,}")]],
    role: ['', [Validators.required]],
    google: [false],
    activated: [false],
    dateCreated: [this.today],
    lastEdited: [this.today],
    uid: [''],
  });
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private functionsService: FunctionsService,
    private tipoCantidadesService: TipoCantidadesService,
    private swPush: SwPush
  ) {
    this.getCatalogos()
    Swal.fire({
      title: "Aceptar las notificaciones para estar mas enterado del evento",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#13547a",
      denyButtonText: `Cancelar`,
      denyButtonColor: "#81d0c7"
    }).then((result) => {
      if (result.isConfirmed) {
        this.swPush.requestSubscription(
          {
            serverPublicKey: this.VAPID_PUBLIC_KEY
          }
        )
          .then(respuesta => {
            this.respuesta = respuesta
            this.submited = true
            if (!this.form.valid) {
              this.loading = false
              return
            }
          })
          .catch(err => {
            this.functionsService.alertError(err, 'Error')
          })
      } else if (result.isDenied) {
        this.submited = true
        if (!this.form.valid) {
          this.loading = false
          return
        }
      }
    });
  }
  get errorControl() {
    return this.form.controls;
  }
  async submit(): Promise<void> {
    this.loading = true
    if (this.respuesta) {
      this.register(this.respuesta)
    } else {
      this.register()
    }
  }
  verPass() {
    this.vieWPass = !this.vieWPass;
  }
  resetPassword(): void {
    this.router.navigateByUrl('auth/reset-password', { replaceUrl: true });
  }
  login(): void {
    this.router.navigateByUrl('auth/login', { replaceUrl: true });
  }
  getCatalogos() {
    this.rolesService.cargarRolesInit().subscribe((resp: CargarRoles) => {
      this.roles = resp.roles
    },
      (error) => {
        this.functionsService.alertError(error, 'Registro')
      })
    this.tipoCantidadesService.cargarTipoCantidadByClave(this.EVTRGL).subscribe((resp: CargarTipoCantidad) => {
      this.tipoCantidad = resp.tipoCantidad
    },
      (error) => {
        this.functionsService.alertError(error, 'Paquetes')
      })
  }

  subscribeNotification() {
    this.swPush.requestSubscription(
      {
        serverPublicKey: this.VAPID_PUBLIC_KEY
      }
    )
      .then(async respuesta => {
        return await {
          ok: true,
          respuesta
        }
      })
      .catch(err => {
        return {
          ok: false,
          err
        }
      })
  }
  register(push?: object) {
    this.form.value.email = this.form.value.email.toLowerCase()
    this.form.value.nombre = this.form.value.nombre.toUpperCase()
    this.form.value.apellidoPaterno = this.form.value.apellidoPaterno.toUpperCase()
    this.form.value.apellidoMaterno = this.form.value.apellidoMaterno.toUpperCase()
    if (
      this.form.value.email == '' ||
      this.form.value.nombre == '' ||
      this.form.value.apellidoPaterno == '' ||
      this.form.value.apellidoMaterno == '' ||
      this.form.value.password == '' ||
      this.form.value.role == ''
    ) {
      this.loading = false
      this.functionsService.alertForm('Registro')
      return
    }
    let user = {
      ...this.form.value,
      cantidadFiestas: this.tipoCantidad.value,
      paqueteActual: this.tipoCantidad.uid,
      pushNotification: (push) ? push : null
    }
    this.usuariosService.crearUsuario(user).subscribe((resp: any) => {
      setTimeout(() => {
        this.loading = false
        let usr = resp.usuario
        this.functionsService.setLocal('token', resp.token)
        usr.usuarioCreated = usr.uid
        this.usuariosService.actualizarUsuario(usr).subscribe((resp: any) => {
          this.functionsService.navigateTo('auth/login')
        })
      }, 1500);
      this.functionsService.alert('Usuario', 'Creado', 'success')
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Registro')
        this.loading = false
      })
  }
}