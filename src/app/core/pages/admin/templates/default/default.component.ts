import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { SwPush } from '@angular/service-worker';
import Swal from 'sweetalert2';
import { MetaService } from 'src/app/core/services/meta.service';
import { PushsService } from 'src/app/core/services/push.service';
import { Push } from 'src/app/core/models/push.model';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  tUrl = environment.text_url
  respuesta: any
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  loading = false
  url = environment.base_url
  today = this.functionsService.getToday()
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  date: number = this.today + 199456789
  res: number
  formCheck: boolean = false
  qrOk = false
  rol = this.functionsService.getLocal('role')
  fiestaId: string = undefined
  fiesta: Fiesta
  boletoId: string = undefined
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
  donde1Check: boolean
  donde2Check: boolean
  donde3Check: boolean
  hospedajeCheck: boolean
  vistaTemp: boolean
  pushOk: boolean = false
  constructor(
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private route: ActivatedRoute,
    private boletosService: BoletosService,
    private swPush: SwPush,
    private metaService: MetaService,
    private pushsService: PushsService
  ) {
    this.loading = true
    this.fiestaId = this.route.snapshot.params['fiesta']
    this.boletoId = this.route.snapshot.params['boleto']
    if (this.fiestaId && this.boletoId) {
      this.boletosService.cargarBoletoById(this.boletoId).subscribe((resp: any) => {
        this.boleto = resp.boleto
        if (!this.boleto.activated) {
          this.functionsService.alert('Boleto eliminado', 'Contactar con el anfitrion', 'info')
          this.functionsService.navigateTo('/')
        }
        this.boleto.vista = true
        this.boletosService.actualizarBoleto(this.boleto).subscribe((resp:any)=>{
          console.log('resp', resp)
          this.boleto = resp.boletoActualizado
          this.subscribeNotification()

        })



      }, (error) => {
        this.functionsService.alertError(error, 'Boletos')
      })

      // Se carga la fiesta por ID  

      console.log('this.fiestaId::: ', this.fiestaId);
      this.fiestasService.cargarFiestaById(this.fiestaId).subscribe((resp: any) => {
        this.fiesta = resp.fiesta
        console.log('this.fiesta::: ', this.fiesta);

        this.invitacionsService.cargarInvitacionByFiesta(this.fiestaId).subscribe(async (resp: any) => {
          console.log('resp::: ', resp);
          this.invitacion = resp.invitacion.data
          this.restParty()
          this.invitacion = await this.dateToNumber(this.invitacion)
          this.invitacion.mesa = this.boleto.mesa
          this.date = this.fiesta.fecha
          this.invitacion.cantidad = this.boleto.cantidadInvitados
          this.invitacion.invitado = this.boleto.nombreGrupo
          this.donde1Check = this.invitacion.donde1Check
          this.donde2Check = this.invitacion.donde2Check
          this.donde3Check = this.invitacion.donde3Check
          this.hospedajeCheck = this.invitacion.hospedajeCheck
          this.itinerarios = this.invitacion.itinerarios
          this.notas = this.invitacion.notas
        }, (error) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.functionsService.navigateTo('/')
        })
      }, (error) => {
        this.functionsService.alertError(error, 'Fiestas')
        this.functionsService.navigateTo('/')
      })
    } else {
      this.restParty()
      this.state = this.route.snapshot.queryParams
      for (let key in this.state) {
        ++this.count;
      }
      if (this.count == 0) {
        this.vistaTemp = true
        this.invitacion = {
          cPrincipal: 'pink',
          cSecond: '#c51132',
          cWhite: 'white',
          img1: '/assets/images/xv/xv3.jpeg',
          xImg1: 76,
          topTitle: 40,
          invitado: 'Familia Ramírez',
          mesa: '1 y 2 ',
          cantidad: 5,
          tipoFiesta: 'Mis XV',
          topDate: 50,
          nombreFiesta: 'Mariana',
          textInvitacionValida: '¡Los esperamos!',
          mensajeImg: '/assets/images/xv/xv3.jpeg',
          mensaje1: 'Tengo el vestido, la ilusión, la felicidad, el lugar y todo lo que se pueda soñar. Sólo me falta que ustedes estén conmigo en este día.',
          donde1Check: true,
          donde1Img: '/assets/images/xv/xv2.jpg',
          donde1Title: 'Iglesia',
          donde1Text: 'Basilica de Guadalupe',
          donde1Date: 123,
          donde1Icon: 'mt-2 mb-2 text-cente bi bi-map pointer',
          donde1Address: ' Progreso, Yuc., México',
          donde1AddressUbicacion: 'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
          donde2Check: true,
          donde2Img: '/assets/images/xv/xv4.jpg',
          donde2Title: 'Civil',
          donde2Text: 'Registro',
          donde2Date: 789456123,
          donde2Icon: 'mt-2 mb-2 text-cente bi bi-map pointer',
          donde2Address: ' Progreso, Yuc., México',
          donde2AddressUbicacion: 'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
          donde3Check: true,
          donde3Img: '/assets/images/xv/xv3.jpeg',
          donde3Title: 'Fiesta',
          donde3Text: 'Registro',
          donde3Date: 789456123,
          donde3Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
          donde3Address: ' Progreso, Yuc., México',
          donde3AddressUbicacion: 'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
          hospedajeCheck: true,
          hospedajeImg: '/assets/images/xv/hotel.jpg',
          hospedajeName: 'Camino real',
          hospedajeIcon: 'mt-2 mb-2 text-center  bi-info-circle pointer',
          hospedajeAddress: 'Centro Comercial City, Av. Andrés García Lavín 298-32, Fundura Montebello, 97113 Mérida, Yuc., México.',
          hospedajeUbicacion: 'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846441,-99.1174072,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
          hospedajeUrl: 'https://www.caminoreal.com/',
          hospedajePhone: '529996893000',
          itinerarioCheck: true,
          ItinerarioName: 'Mariana´s Party',
          itinerarios: [
            {
              name: 'Misa',
              hr: '15:00 hrs'
            },
            {
              name: 'Registro civil',
              hr: '17:00 hrs'
            },
            {
              name: 'Ceremonia',
              hr: '18:30 hrs'
            }
          ],
          notaCheck: true,
          notas: [
            {
              texto: 'Tu Presencia sera el mejor regalo',

            },
            {
              texto: 'No olvides tener cuidado de tus hijos',

            }
          ],
          colorQr: '#ffffff',
          colorBGQr: '#f82525',
        }
        this.itinerarios = this.invitacion.itinerarios
        this.notas = this.invitacion.notas
      } else {
        this.vistaTemp = false
        this.itinerarios = JSON.parse(this.state.itinerarios)
        this.notas = JSON.parse(this.state.notas)
        this.donde1Check = (this.state.donde1Check == 'true') ? true : false
        this.donde2Check = (this.state.donde2Check == 'true') ? true : false
        this.donde3Check = (this.state.donde3Check == 'true') ? true : false
        this.hospedajeCheck = (this.state.hospedajeCheck == 'true') ? true : false
        this.invitacion = this.state
        this.date = this.invitacion.fiestaDate
        this.btnBack = true
      }
    }
  }
  ngOnInit() {
    this.metaService.createCanonicalURL();
  }

  async dateToNumber(data) {
    data.dateCreated = (typeof (data.dateCreated) == 'string') ? this.functionsService.dateToNumber(data.dateCreated) : data.dateCreated
    data.lastEdited = (data.lastEdited != undefined) ? (typeof (data.lastEdited) == 'string') ? this.functionsService.dateToNumber(data.lastEdited) : data.lastEdited : ''
    data.donde1Date = (typeof (data.donde1Date) == 'string') ? this.functionsService.dateToNumber(data.donde1Date) : data.donde1Date
    data.donde2Date = (typeof (data.donde2Date) == 'string') ? this.functionsService.dateToNumber(data.donde2Date) : data.donde2Date
    data.donde3Date = (typeof (data.donde3Date) == 'string') ? this.functionsService.dateToNumber(data.donde3Date) : data.donde3Date
    data.donde1Check = (data.donde1Check == 'true' || data.donde1Check == true) ? true : false
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false
    data.fiestaDate = (typeof (data.donde3Date) == 'string') ? this.functionsService.dateToNumber(data.donde3Date) : data.donde3Date
    return await data
  }
  async numberToData(data) {
    data.dateCreated = (typeof (data.dateCreated) == 'number') ? this.functionsService.numberToDate(data.dateCreated) : data.dateCreated
    data.donde1Date = (typeof (data.donde1Date) == 'number') ? this.functionsService.numberDateTimeLocal(data.donde1Date) : data.donde1Date
    data.donde2Date = (typeof (data.donde2Date) == 'number') ? this.functionsService.numberDateTimeLocal(data.donde2Date) : data.donde2Date
    data.donde3Date = (typeof (data.donde3Date) == 'number') ? this.functionsService.numberDateTimeLocal(data.donde3Date) : data.donde3Date
    data.lastEdited = (typeof (data.lastEdited) == 'number') ? this.functionsService.numberDateTimeLocal(data.lastEdited) : data.lastEdited
    data.donde1Check = (data.donde1Check == 'true' || data.donde1Check == true) ? true : false
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false
    return await data
  }
  setData(fiesta, boleto) {
    this.metaService.generateTags({
      title: `${fiesta.nombre} -  ${this.functionsService.datePush(fiesta.fecha)}  `,
      description:
        `Hola ${boleto.nombreGrupo} te invito tienes  ${boleto.cantidadInvitados} boletos`,
      keywords:
        'No faltes, te espero ',
      slug: `core/templates/default/${fiesta.uid}/${boleto.uid}`,
      colorBar: this.invitacion.cPrincipal,
      image:
        this.url + '/upload/invitaciones/' + this.invitacion.img1,
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.boleto && this.fiesta) {
        this.setData(this.fiesta, this.boleto)
      }
      this.loading = false
    }, 1500);
  }
  getDate(date) {
    this.date = new Date(date).getTime()
  }
  confirmar(data) {
    this.loading = true
    data = JSON.parse(data)
    this.boleto.confirmado = !this.boleto.confirmado
    if (!this.boleto.confirmado) {
      this.boleto.fechaConfirmacion = undefined
    } else {
      this.boleto.fechaConfirmacion = this.today
    }
    this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
      if (res.boletoActualizado.confirmado) {
        this.functionsService.alert('Invitacion', 'Confirmada', 'success')
      } else {
        this.functionsService.alert('Invitacion', 'Se quito la confirmación', 'success')
      }
      this.loading = false
    })
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
  getQr(invitado?) {
    var qr
    if (invitado) {
      qr = {
        uid: this.boleto.uid,
        fiesta: this.boleto.fiesta,
        grupo: this.boleto.grupo,
        salon: this.boleto.salon,

      }
    } else {
      qr = {
        uid: '0000000000',
        fiesta: 'Muestra',
        grupo: 'Muestra',
        salon: 'Muestra',
        nombreGrupo: 'Muestra',
        whatsapp: 'Muestra',
        email: 'Muestra',
        cantidadInvitados: 'Muestra',
        ocupados: 'Muestra',
        confirmado: 'Muestra',
        invitacionEnviada: 'Muestra',
        fechaConfirmacion: 'Muestra',
        activated: true

      }
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
        console.log('respuesta', respuesta)
        this.pushsService.crearPush(respuesta).subscribe((resp: any) => {
          console.log('resp', resp)
          console.log('this.boleto.pushNotification', this.boleto.pushNotification)
          this.functionsService.setLocal("pushService", resp)

          var bl: any

          this.boleto.pushNotification.forEach((b) => {
            if (b == resp.pushDB.uid) {
              bl = true
            }
          });

          if (!bl) {
            this.boleto.pushNotification.push(resp.pushDB.uid)
          }
          this.boletosService.registrarPushNotification(this.boleto).subscribe((res) => {
            console.log('res', res)
          })
        })
      })
      .catch(err => {

        return {
          ok: false,
          err
        }
      })
  }
  typeOf(val) {
    return typeof (val)
  }
}