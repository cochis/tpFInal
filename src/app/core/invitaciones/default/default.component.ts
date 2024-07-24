import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarBoleto, CargarFiesta } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TokenPushsService } from 'src/app/core/services/tokenPush.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { SwPush } from '@angular/service-worker';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent {
  loading = false
  formActive: Boolean = false
  today = this.functionsService.getToday()
  tamanoDispositivo = 1024
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  bgX = 50
  bgY = 50
  date: number = this.today + 123456789
  res: number
  formCheck: boolean = false
  qrOk = false

  form: FormGroup
  url = environment.base_url
  nombre
  nombreEvento = []
  initNombre = []
  cNombreEvento = 0
  fiestaid: string = ''
  fiesta: Fiesta
  boletoid: string = ''
  boleto: Boleto

  salon: Salon
  invitadoId: any
  invitado: any
  idx: any
  editBoleto = false
  respuesta: any
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  constructor(
    private functionsService: FunctionsService,
    private route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private boletosService: BoletosService,
    private salonsService: SalonsService,
    private fiestasService: FiestasService,
    private tokenPushService: TokenPushsService,
    private swPush: SwPush
  ) {
    this.subscribeNotification()
    this.init()
    this.restParty()

  }
  init() {
    this.createForm()
    this.loading = true
    this.fiestaid = this.route.snapshot.params['fiesta']
    this.boletoid = this.route.snapshot.params['boleto']
    this.invitadoId = Number(this.route.snapshot.params['invitado'])
    this.boletosService.cargarBoletoById(this.boletoid).subscribe((resp: CargarBoleto) => {
      this.boleto = resp.boleto
      this.subscribeNotification()
    })
    this.fiestasService.cargarFiestaById(this.fiestaid).subscribe((resp: CargarFiesta) => {
      this.fiesta = resp.fiesta
      this.date = this.fiesta.fecha
      this.salon = this.fiesta.salon
      this.nombre = this.fiesta.nombre.split(' ')
      this.cNombreEvento = this.nombre.length
      this.nombre.forEach(ele => {
        if (ele[0] !== undefined) {
          this.initNombre.push(ele[0])
          this.nombreEvento.push(ele.slice(1, ele.length))
        }
      });
    })
    setTimeout(() => {
      this.loading = false
      this.qrOk = true
      this.setForm(this.fiesta, this.boleto, this.fiestaid)
    }, 1000);
  }
  createForm() {
    this.form = this.fb.group({
      tamano: [],
      checkForm: [],
      imgInit: [],
      bgPositionX: [],
      bgPositionY: [],
      esposo: [],
      esposa: [],
      evento: ['Mis XV años'],
      fecha: [this.date],
      mensaje: ['Hoy empieza la mejor historia de nuestra vida'],
      checkIglesia: [false],
      titleIglesia: [],
      nombreIglesia: [],
      direccionIglesia: [],
      fechaIglesia: [],
      checkCivil: [false],
      titleCivil: [],
      nombreCivil: [],
      direccionCivil: [],
      fechaCivil: [],
      checkRecepccion: [true],
      titleRecepccion: [],
      nombreRecepccion: [],
      direccionRecepccion: [],
      fechaRecepccion: [],
      checkHospedaje: [false]
    });
  }
  setForm(fiesta, boleto, id) {
    this.form = this.fb.group({
      tamano: [],
      checkForm: [],
      imgInit: [],
      bgPositionX: [],
      bgPositionY: [],
      esposo: [],
      esposa: [],
      evento: [this.fiesta.nombre],
      fecha: [this.fiesta.fecha],
      mensaje: ['Hoy empieza la mejor historia de nuestra vida'],
      checkIglesia: [false],
      titleIglesia: [],
      nombreIglesia: [],
      direccionIglesia: [],
      fechaIglesia: [],
      checkCivil: [false],
      titleCivil: [],
      nombreCivil: [],
      direccionCivil: [],
      fechaCivil: [],
      checkRecepccion: [true],
      titleRecepccion: ['Salon & Jardin'],
      nombreRecepccion: ['Quinta Alejandra'],
      direccionRecepccion: [this.salon.direccion],
      fechaRecepccion: [this.fiesta.fecha],
      checkHospedaje: [false]
    });
  }
  getDate(date) {
    this.date = new Date(date).getTime()
  }
  confirmar(data) {
    this.loading = true
    data = JSON.parse(data)
    this.boletosService.cargarBoletoByFiesta(data.fiesta).subscribe((res: any) => {
      this.idx = undefined
      this.editBoleto = true
      this.invitado = res.boleto[0].invitados[this.invitadoId]
      this.invitado.confirmado = true
      this.invitado.fechaConfirmacion = this.today
      this.boleto = this.invitado
      this.boletosService.actualizarBoletoRegistro(this.boleto).subscribe(res => {
        this.functionsService.alertUpdate('Boletos')
        Swal.fire({
          title: "Notificaciones",
          text: "¿Quieres que te enviemos notificaciones de la fiesta?",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#13547a",
          cancelButtonColor: "#80d0c7",
          confirmButtonText: "Si",
          cancelButtonText: "No"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Permisos",
              text: "Acepta los permisos de notificaciones",
              icon: "success"
            });
            this.functionsService.subscribeToPush().then(resp => {
            })
          }
        });
      },
        (error) => {
          this.functionsService.alertError(error, 'Confirma asistencia')
        })
    })
    this.loading = false
  }
  changeValue(type: string, value: any) {
    switch (type) {
      case 'bgPositionX':
        this.bgX = value
        break;
      case 'bgPositionY':
        this.bgY = value
        break;
    }
  }
  restParty() {
    let i = 0
    const interval = setInterval((): void => {
      if (this.date > 0) {
        ++i
        let d = (this.date - this.functionsService.getToday()) / 86400000
        this.dias = Math.trunc(d)
        let hr = ((this.date - this.functionsService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)
        let min = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))
        this.minutos = Math.trunc(min / 60000)
        let seg = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))
        this.segundos = Math.trunc(seg / 1000)
      }
    }, 1000);
  }
  verUbicacion() {
    let url = this.salon.ubicacionGoogle
    window.open(url, '_blank')
  }
  getQr(invitado) {
    let qr = {
      salon: this.fiesta.salon._id,
      fiesta: this.boleto.fiesta,
    }
    return JSON.stringify(qr)
  }
  subscribeNotification() {
    this.swPush.requestSubscription(
      {
        serverPublicKey: this.VAPID_PUBLIC_KEY
      }
    )
      .then(respuesta => {
     
      })
      .catch(err => {
        return {
          ok: false,
          err
        }
      })
  }
}