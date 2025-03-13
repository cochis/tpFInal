import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CargarEvento, CargarEventos, CargarFiesta, CargarPaquetes, CargarRoles, CargarSalons, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Evento } from 'src/app/core/models/evento.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Paquete } from 'src/app/core/models/paquete.model';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
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
  selector: 'app-single-fiesta',
  templateUrl: './single-fiesta.component.html',
  styleUrls: ['./single-fiesta.component.css']
})
export class SingleFiestaComponent implements OnInit, OnDestroy {
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  loading = false
  src1 = interval(10000);
  obs1: Subscription;
  public imagenSubir!: File
  public imgTemp: any = undefined
  today = this.functionsService.getToday()
  salon: Salon
  eventos: Evento[]
  boletos: any = []
  fiesta: Fiesta
  usuarios: Usuario[]
  usuario: Usuario
  submited: boolean = false
  roles: Role[]
  public form!: FormGroup

  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  cantidadGalerias = 0
  p: any;

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private boletosService: BoletosService,
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

    this.getId(this.id)

    setTimeout(() => {

      this.loading = false
    }, 2000);
  }
  ngOnInit(): void {
    this.obs1 = this.src1.subscribe((value: any) => {
      this.loading = true
      this.boletos = []
      this.getId(this.id)
    });
  }
  getId(id: string) {


    this.fiestasServices.cargarFiestaById(id).subscribe((resp: CargarFiesta) => {

      this.fiesta = resp.fiesta
      this.salon = this.fiesta.salon

      this.boletosService.cargarBoletoByFiesta(this.fiesta.uid).subscribe((res: any) => {
        this.boletos = this.functionsService.getActivos(res.boleto)


      })
    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Fiestas')
      })
  }

  gettotal(invitados, type: string) {
    var total = 0
    switch (type) {
      case 'ocupados':
        invitados.forEach(invitado => {
          if (invitado.activated) {
            total = total + invitado.cantidadInvitados
          }
        });
        break;
      default:
        break;
    }
    invitados.forEach((c: any) => {
    });
    return total
  }
  getConfirmados(invitados) {
    var total = 0
    invitados.forEach((c: any) => {
      if (c.confirmado) {
        total = total + 1
      }
    });
    return total
  }
  getOnParty(invitados) {
    var total = 0
    invitados.forEach((c: any) => {
      if (c.ocupados && c.activated) {
        total = total + c.ocupados
      }
    });
    return total
  }
  getActivas(invitados) {
    var total = 0
    invitados.forEach((c: any) => {
      if (c.activated) {
        total = total + 1
      }
    });
    return total
  }

  back() {
    this.functionsService.navigateTo('/core/mis-fiestas')
  }

  typeOf(val) {
    return typeof (val)
  }
  getCatalog(tipo: string, id: string) {
    if (id === undefined) return
    switch (tipo) {
      case 'fiesta':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.fiesta)
        break;
      case 'salon':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.salon)
        break;
      default:
        return " No se encontró"
        break
    }
  }
  ngOnDestroy(): void {
    this.boletos = []
    if (this.obs1) this.obs1.unsubscribe();
  }
  ajuste(boleto) {

    if ((this.gettotal(this.boletos, 'ocupados') + boleto.requeridos) > this.fiesta.cantidad) {
      this.functionsService.alert('Boletos', 'La cantidad de boletos en el ajuste sobrepasa su cupo', 'error')
    } else {

      boleto.cantidadInvitados = boleto.requeridos
      boleto.vista = true
      boleto.invitacionEnviada = true
      boleto.requeridos = 0
      this.boletosService.actualizarBoleto(boleto).subscribe(res => {
        this.functionsService.alertUpdate('Boleto ajustado')
      })
    }



  }
}
