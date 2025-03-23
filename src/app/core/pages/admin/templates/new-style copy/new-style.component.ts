
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import * as $ from 'jquery';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { PushsService } from 'src/app/core/services/push.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-new-style',
  templateUrl: './new-style.component.html',
  styleUrls: ['./new-style.component.css']
})
export class NewStyleComponent {
  loading = false
  presentacionView = false
  invitacionView = true
  tUrl = environment.text_url
  play: any = true
  respuesta: any
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  url = environment.base_url
  today = this.functionsService.getToday()
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  copy = false
  date: number = this.today + 199456789
  res: number
  formCheck: boolean = false
  qrOk = false
  rol = this.functionsService.getLocal('role')
  USR = environment.user_role
  fiestaId: string = undefined
  fiesta: Fiesta
  boletoId: string = undefined
  copyId: string = ''
  boleto: Boleto
  cPrincipal: 'pink'
  ind = 0
  salon: Salon
  invitadoId: any
  invitado: any
  idx: any
  editBoleto = false
  invitacion: any
  f: any = {}
  state: any = undefined
  count = 0
  btnBack = false
  itinerarios = []
  notas = []
  padres = []
  padrinos = []
  chambelanes = []
  menu = []
  musica = []
  musicaInvitacion = ''
  donde1Check: boolean
  donde2Check: boolean
  donde3Check: boolean
  croquisOk: boolean
  chambelanesCheck: boolean
  codigoVestimentaCheck: boolean
  padresCheck: boolean
  isMusic: boolean
  musicRepit: boolean
  padrinosCheck: boolean
  menuCheck: boolean
  musicaCheck: boolean
  mesaRegalosCheck: boolean
  confirmacionCheck: boolean
  itinerarioCheck: boolean
  generalCheck: boolean
  notaCheck: boolean
  checking: boolean
  hospedajeCheck: boolean
  vistaTemp: boolean
  pushOk: boolean = false
  dataPrincipal: any
  dataInvitacionCard: any
  dataMensajeCard: any
  dataListasCard: any
  dataDondeCard: any

  constructor(
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private route: ActivatedRoute,
    private boletosService: BoletosService,
    private swPush: SwPush,
    private pushsService: PushsService,
    private readonly _modalService: ModalService,
    private metaService: MetaService,
    private title: Title,

  ) {
    this.loading = true
    setTimeout(() => {
      this.loading = false

    }, 500);


  }





  closePresentacion(close) {

    document.getElementById('presentacion').classList.add('animate__bounceOutUp');


    setTimeout(() => {
      this.presentacionView = false
      this.invitacionView = true

      setTimeout(() => {
        document.getElementById('invitacion').classList.remove('dn');
        document.getElementById('invitacion').classList.add('animate__fadeIn');

      }, 10);
    }, 2500);


  }
}
