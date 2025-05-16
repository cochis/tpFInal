import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { environment } from 'src/environments/environment';
import { RolesService } from 'src/app/core/services/roles.service';
import { CargarRole, CargarRoles, CargarPaquete, CargarTipoCentros } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { error } from 'jquery';
import { Role } from 'src/app/core/models/role.model';

import { SwPush } from '@angular/service-worker';
import Swal from 'sweetalert2';
import { MetaService } from 'src/app/core/services/meta.service';
import { TipoCentrosService } from 'src/app/core/services/tipoCentros.service';
import { TipoCentro } from 'src/app/core/models/tipoCentro.model';
import { PushsService } from 'src/app/core/services/push.service';
import { Paquete } from 'src/app/core/models/paquete.model';
import { PaquetesService } from 'src/app/core/services/paquete.service';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { Template } from 'src/app/core/models/template.model';
import { TerminosYCondicionesComponent } from 'src/app/core/pages/terminos-y-condiciones/terminos-y-condiciones.component';
import { PoliticaDePrivacidadComponent } from 'src/app/core/pages/politica-de-privacidad/politica-de-privacidad.component';
import { ParametrosService } from 'src/app/core/services/parametro.service';
import { Parametro } from 'src/app/core/models/parametro.model';
import { validateHeaderValue } from 'http';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  today = this.functionsService.getToday()
  loading = false
  vieWPass = false
  EVTRGL = environment.EVTRGL
  paquete: Paquete
  ADM = environment.admin_role
  SLN = environment.salon_role
  PRV = environment.prv_role
  URS = environment.user_role
  ANF = environment.anf_role
  PCANFI = environment.CANTIDADFIESTAS
  PCANGA = environment.CANTIDADGALERIAS
  parCantFi: Parametro
  parCantGa: Parametro
  slnRole: Role
  usrRole: Role
  anfRole: Role
  roles: Role[]
  NA = environment.noAplica
  tipoCentros: TipoCentro[]
  submited = false
  respuesta: any = undefined
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  form: FormGroup = this.fb.group({
    tipoCentro: ['', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
    apellidoMaterno: [''],
    telefono: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(".{6,}")]],
    role: ['', [Validators.required]],
    google: [false],
    aceptoTerminos: [''],
    aceptoPolitica: [''],
    activated: [false],
    lastEdited: [this.today],
    uid: [''],
  });
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private parametrosService: ParametrosService,
    private functionsService: FunctionsService,
    private pushsService: PushsService,
    private paquetesService: PaquetesService,
    private tipoCentrosService: TipoCentrosService,
    private swPush: SwPush,
    private metaService: MetaService,
    private readonly _modalService: ModalService,
    private title: Title,
  ) {


    let t: string = 'My Ticket Party | Login';
    this.title.setTitle(t);
    let data = {
      title: 'Ticket Party | Login ',
      description:
        'Ingresa a nuestra aplicación con usuario y contraseña',
      keywords:
        'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'auth/login',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.svg',
    }
    this.metaService.generateTags(data)
    this.getParams()

    this.getCatalogos()

  }
  get errorControl() {
    return this.form.controls;
  }
  async submit(): Promise<void> {
    this.submited = true
    if (this.form.invalid) {
      this.functionsService.alert('Registro', 'Favor de revisar el formulario', 'info')
      return
    }

    if (this.form.value.aceptoPolitica == false) {
      this.functionsService.alert('Registro', 'Debe de aceptar  politica de privacidad', 'info')

      return
    } else {
      this.form.value.aceptoPolitica = true
    }
    if (this.form.value.aceptoTerminos == false) {
      this.functionsService.alert('Registro', 'Debe de aceptar terminos y condiciones', 'info')
      return
    } else {
      this.form.value.aceptoTerminos = true
    }
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
        ;
    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Registro')
      })
    this.paquetesService.cargarPaqueteByClave(this.EVTRGL).subscribe((resp: CargarPaquete) => {
      this.paquete = resp.paquete
    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Paquetes')
      })
    this.tipoCentrosService.cargarTipoCentrosAll().subscribe((resp: CargarTipoCentros) => {
      this.tipoCentros = resp.tipoCentros.filter(res => {

        return res.clave != this.NA
      })


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de centros de eventos')
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
        console.error('error::: ', err);
        return {
          ok: false,
          err
        }
      })
  }

  setPhone(tel) {
    tel = tel.replace(/ /g, "")
    var regex = /(\d+)/g;
    this.form.patchValue({
      telefono: tel.match(regex)
    })
  }
  register(push?: object) {

    this.form.value.telefono = Number(this.form.value.telefono[0])


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
      this.submited = true
      this.functionsService.alertForm('Registro')

    }

    let user = {
      ...this.form.value,
      tipoCentro: (this.form.value.tipoCentro == '') ? undefined : this.form.value.tipoCentro,
      cantidadFiestas: this.functionsService.getParametro(this.parCantFi),

      cantidadGalerias: this.functionsService.getParametro(this.parCantGa),
      pushNotification: (push) ? push : null
    }





    this.usuariosService.crearUsuario(user).subscribe((resp: any) => {

      setTimeout(() => {
        this.loading = false
        let usr = resp.usuario
        this.functionsService.setLocal('token', resp.token)


        usr.usuarioCreated = usr.uid
        this.usuariosService.actualizarUsuario(usr).subscribe((resp: any) => {

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

                  this.pushsService.crearPush(respuesta).subscribe((res: any) => {
                    var bl: any
                    let usr = {
                      ...resp.usuarioActualizado,
                      pushNotification: (res.pushDB) ? res.pushDB.uid : res.push.uid
                    }
                    this.usuariosService.actualizarUsuario(usr).subscribe(resA => {
                      this.loading = false
                      this.functionsService.alertUpdate('Revisa tu correo , puede haber llegado a SPAM')
                      this.functionsService.navigateTo('auth/login')
                    },
                      (err) => {
                        console.error('err::: ', err);

                        this.loading = false
                      })
                  })

                })
                .catch(err => {
                  console.error('err::: ', err);

                  this.functionsService.navigateTo('auth/login')
                })
            } else if (result.isDenied) {
              this.submited = true

              this.loading = false
              this.functionsService.navigateTo('auth/login')

            }
          });

        })
      }, 3500);
      this.functionsService.alert('Ticket Party', 'Se ha enviado un correo  para la validación de tu correo', 'success')
    },
      (error: any) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Registro')
        this.loading = false
      })
  }
  uncheck(value) {

    if (value == 'on') {
      this.form.value.aceptoTerminos == 'off'
    }


  }


  viewInfo(value) {

    if (value == 'terminos') {
      this._modalService.show<Template>(TerminosYCondicionesComponent, {
        title: 'Términos y condiciones',
        size: 1,
        model: value,
        mode: 'default'
      })
    } else {
      this._modalService.show<Template>(PoliticaDePrivacidadComponent, {
        title: 'Política de privacidad',
        size: 1,
        model: value,
        mode: 'default'
      })
    }

  }


  getParams() {
    this.parametrosService.cargarParametrosByClave(this.PCANFI).subscribe(resp => {
      this.parCantFi = resp.parametro

    },
      (error) => {
        this.functionsService.alertError(error, 'Parametros')
        console.error(error)
      })
    this.parametrosService.cargarParametrosByClave(this.PCANGA).subscribe(resp => {
      this.parCantGa = resp.parametro

    },
      (error) => {
        this.functionsService.alertError(error, 'Parametros')
        console.error(error)
      })
  }
}