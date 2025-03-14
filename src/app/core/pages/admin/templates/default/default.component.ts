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
import { ImgTemplate } from 'src/app/core/models/img.model';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { ImagenComponent } from 'src/app/shared/components/modals/imagen/imagen.component';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  tUrl = environment.text_url
  play: any = true
  respuesta: any
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  loading = false
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
    this.fiestaId = this.route.snapshot.params['fiesta']
    this.copyId = this.route.snapshot.params['copy']
    this.boletoId = this.route.snapshot.params['boleto']
    if (this.fiestaId && this.boletoId) {
      this.boletosService.cargarBoletoById(this.boletoId).subscribe((resp: any) => {
        this.boleto = resp.boleto


        if (!this.boleto.activated) {
          this.functionsService.alert('Boleto eliminado', 'Contactar con el anfitrion', 'info')
          this.functionsService.navigateTo('/core/inicio')
        }
        this.boleto.vista = true
        this.boletosService.registrarPushNotification(this.boleto).subscribe((resp: any) => {
          this.boletosService.isVistaBoleto(this.boleto).subscribe((resp2: any) => {
            this.boleto = resp.boletoActualizado


            this.subscribeNotification()
          })
        })
      }, (error) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Boletos')
      })
      this.fiestasService.cargarFiestaById(this.fiestaId).subscribe((resp: any) => {
        this.fiesta = resp.fiesta





        this.checking = this.fiesta.checking
        this.invitacionsService.cargarInvitacionByFiesta(this.fiestaId).subscribe(async (resp: any) => {
          this.invitacion = resp.invitacion.data




          setTimeout(() => {

            let t: string = `My Ticket Party | ${this.fiesta.nombre}  -  ${this.functionsService.numberToDate(Number(this.fiesta.fecha))} - para ${this.boleto.grupo} `;
            this.title.setTitle(t.toUpperCase());
            let data = {
              title: t.toUpperCase(),
              description:
                `${this.dataDondeCard.mensaje1} `,
              keywords:
                'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
              slug: 'core/templates/default',
              colorBar: '#13547a',
              image: `${this.url}/upload/invitaciones/${this.invitacion.img1}`

            }
            this.metaService.generateTags(data)

          }, 500);
          this.restParty()
          this.invitacion = await this.dateToNumber(this.invitacion)
          this.invitacion.mesa = this.boleto.mesa
          this.date = !this.fiesta.example ? this.fiesta.fecha : this.today + 30000

          this.invitacion.cantidad = this.boleto.cantidadInvitados
          this.invitacion.invitado = this.boleto.nombreGrupo
          this.donde1Check = this.invitacion.donde1Check
          this.donde2Check = this.invitacion.donde2Check
          this.donde3Check = this.invitacion.donde3Check
          this.hospedajeCheck = this.invitacion.hospedajeCheck
          this.mesaRegalosCheck = this.invitacion.mesaRegalosCheck
          this.confirmacionCheck = this.invitacion.confirmacionCheck
          this.generalCheck = this.invitacion.generalCheck
          this.itinerarios = this.invitacion.itinerarios
          this.notas = this.invitacion.notas
          this.padres = this.invitacion.padres
          this.padresCheck = this.invitacion.padresCheck
          this.isMusic = this.invitacion.isMusic
          this.musicRepit = this.invitacion.musicRepit
          this.padrinos = this.invitacion.padrinos
          this.padrinosCheck = this.invitacion.padrinosCheck
          this.chambelanes = this.invitacion.chambelanes
          this.chambelanesCheck = this.invitacion.chambelanesCheck
          this.codigoVestimentaCheck = this.invitacion.codigoVestimentaCheck
          this.menu = this.invitacion.menu
          this.menuCheck = this.invitacion.menuCheck
          this.musica = this.invitacion.musica
          this.musicaCheck = this.invitacion.musicaCheck
          this.musicaInvitacion = this.invitacion.musicaInvitacion

          this.dataPrincipal = {
            vistaTemp: false,
            type: 'seccionInicial',
            size: 'sm',
            cPrincipal: this.invitacion.cPrincipal,
            cSecond: this.invitacion.cSecond,
            imgWidth: this.invitacion.imgWidth,
            cWhite: this.invitacion.cWhite,
            img1: this.invitacion.img1,
            efectoImg1: this.invitacion.efectoImg1,
            repEfectoImg1: this.invitacion.repEfectoImg1,
            xImg1: this.invitacion.xImg1,
            yImg1: this.invitacion.yImg1,
            generalCheck: this.invitacion.generalCheck,
            generalTexto: this.invitacion.generalTexto,
            generalSize: this.invitacion.generalSize ? this.invitacion.generalSize : 15,
            nombreFiesta: this.invitacion.nombreFiesta,
            nombreSize: this.invitacion.nombreSize,
            nombreFont: this.invitacion.nombreFont,
            nombreEfecto: this.invitacion.nombreEfecto,
            nombreEfectoRep: this.invitacion.nombreEfectoRep,
            topTitle: this.invitacion.topTitle,
            tipoFiesta: this.invitacion.tipoFiesta,
            tipoSize: this.invitacion.tipoSize,
            tipoFont: this.invitacion.tipoFont,
            tipoEfecto: this.invitacion.tipoEfecto,
            tipoEfectoRep: this.invitacion.tipoEfectoRep,
            topDate: this.invitacion.topDate,
            mensajeFont: this.invitacion.mensajeFont,
            inicialTFont: this.invitacion.inicialTFont,
            finalTFont: this.invitacion.finalTFont,
            inviFont: this.invitacion.inviFont,
            inviFont2: this.invitacion.inviFont2,
            inviEfecto: this.invitacion.inviEfecto,
            inviEfectoRep: this.invitacion.inviEfectoRep,
            inicialTSize: this.invitacion.inicialTSize,
            finalTSize: this.invitacion.finalTSize,
            date: this.date
          }



          this.dataInvitacionCard = {
            vistaTemp: false,
            ...this.invitacion
          }
          this.dataMensajeCard = {
            vistaTemp: false,
            ...this.invitacion

          }
          this.dataListasCard = {
            vistaTemp: false,
            ...this.invitacion

          }
          this.dataDondeCard = {
            vistaTemp: false,
            ...this.invitacion

          }



        }, (error) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.functionsService.navigateTo('/core/inicio')
        })
      }, (error) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Fiestas')
        this.functionsService.navigateTo('/core/inicio')
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
          checking: true,
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
          tipoSize: 85,
          topDate: 50,
          nombreFiesta: 'Mariana',
          nombreSize: 87,
          textInvitacionValida: '¡Los esperamos!',
          mensajeImg: '/assets/images/xv/xv3.jpeg',
          mensaje1: 'Tengo el vestido, la ilusión, la felicidad, el lugar y todo lo que se pueda soñar. Sólo me falta que ustedes estén conmigo en este día.',
          mensajeSize: 20,
          generalSize: 15,
          donde1Check: true,
          donde1Img: '/assets/images/xv/xv2.jpg',
          donde1Title: 'Iglesia',
          donde1Text: 'Basilica de Guadalupe',
          donde1Date: 123,
          donde1Icon: 'mt-2 mb-2 text-cente bi bi-map pointer',
          donde1Address: ' Progreso, Yuc., México',
          donde1AddressUbicacion: 'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
          donde2Check: true,
          croquisOk: true,
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
          padres: [
            {
              name: 'Vianney Vicuña',
              texto: 'Madre de la novia',

            },
            {
              name: 'Oscar Ramírez',
              texto: 'Padre de la novia',

            },
            {
              name: 'Mariana Rodríguez',
              texto: 'Madre del novio',

            },
            {
              name: 'Alejandro Gómez',
              texto: 'Padre del novio',

            },
          ],
          padrinos: [
            { name: 'Mayra Rendon' },
            { name: 'Christian Daniel Bonilla' },
          ],
          musica: [
            { name: 'Banda MS' },
            { name: 'Sonora Dinamita' },
          ],
          menu: [
            { tipo: '1er tiempo', name: 'Ensalada Cesar' },
            { tipo: '2do tiempo', name: 'Sopa gratinada' },
            { tipo: '3er tiempo', name: 'Cordón Blue' },

          ],
          colorQr: '#ffffff',
          colorBGQr: '#f82525',
          imgWidth: 100
        }
        this.itinerarios = this.invitacion.itinerarios
        this.notas = this.invitacion.notas
        this.padres = this.invitacion.padres
        this.padrinos = this.invitacion.padrinos
        this.chambelanes = this.invitacion.chambelanes
        this.menu = this.invitacion.menu
        this.musica = this.invitacion.musica
      } else {
        this.vistaTemp = false
        this.itinerarios = JSON.parse(this.state.itinerarios)
        this.notas = JSON.parse(this.state.notas)
        this.padres = JSON.parse(this.state.padres)
        this.padrinos = JSON.parse(this.state.padrinos)
        this.chambelanes = JSON.parse(this.state.chambelanes)
        this.menu = JSON.parse(this.state.menu)
        this.musica = JSON.parse(this.state.musica)
        this.musicaInvitacion = this.state.musicaInvitacion
        this.donde1Check = (this.state.donde1Check == 'true') ? true : false
        this.donde2Check = (this.state.donde2Check == 'true') ? true : false
        this.donde3Check = (this.state.donde3Check == 'true') ? true : false
        this.croquisOk = (this.state.croquisOk == 'true') ? true : false
        this.codigoVestimentaCheck = (this.state.codigoVestimentaCheck == 'true') ? true : false
        this.chambelanesCheck = (this.state.chambelanesCheck == 'true') ? true : false
        this.padresCheck = (this.state.padresCheck == 'true') ? true : false
        this.isMusic = (this.state.isMusic == 'true') ? true : false
        this.musicRepit = (this.state.musicRepit == 'true') ? true : false
        this.padrinosCheck = (this.state.padrinosCheck == 'true') ? true : false
        this.menuCheck = (this.state.menuCheck == 'true') ? true : false
        this.musicaCheck = (this.state.musicaCheck == 'true') ? true : false
        this.itinerarioCheck = (this.state.itinerarioCheck == 'true') ? true : false
        this.hospedajeCheck = (this.state.hospedajeCheck == 'true') ? true : false
        this.mesaRegalosCheck = (this.state.mesaRegalosCheck == 'true') ? true : false
        this.confirmacionCheck = (this.state.confirmacionCheck == 'true') ? true : false
        this.generalCheck = (this.state.generalCheck == 'true') ? true : false
        this.invitacion = this.state
        this.checking = (this.state.checking == 'true') ? true : false
        this.date = this.invitacion.fiestaDate
        this.croquisOk = (this.state.croquisOk == 'true') ? true : false
        this.btnBack = true
        this.checking = (this.state.checking == 'true') ? true : false
        this.notaCheck = (this.state.notaCheck == 'true') ? true : false
        this.padresCheck = (this.state.padresCheck == 'true') ? true : false


        this.musicRepit = (this.state.musicRepit == 'true') ? true : false






        this.dataPrincipal = {
          vistaTemp: true,
          type: 'seccionInicial',
          size: 'sm',
          cPrincipal: this.state.cPrincipal,
          cSecond: this.state.cSecond,
          imgWidth: this.state.imgWidth,
          cWhite: this.state.cWhite,
          img1: this.state.img1,
          efectoImg1: this.state.efectoImg1,
          repEfectoImg1: this.state.repEfectoImg1,
          xImg1: this.state.xImg1,
          yImg1: this.state.yImg1,
          generalCheck: this.state.generalCheck,
          generalTexto: this.state.generalTexto,
          generalSize: this.state.generalSize ? this.state.generalSize : 15,
          nombreFiesta: this.state.nombreFiesta,
          nombreSize: this.state.nombreSize,
          nombreFont: this.state.nombreFont,
          nombreEfecto: this.state.nombreEfecto,
          nombreEfectoRep: this.state.nombreEfectoRep,
          topTitle: this.state.topTitle,
          tipoFiesta: this.state.tipoFiesta,
          tipoSize: this.state.tipoSize,
          tipoFont: this.state.tipoFont,
          tipoEfecto: this.state.tipoEfecto,
          tipoEfectoRep: this.state.tipoEfectoRep,
          topDate: this.state.topDate,
          mensajeFont: this.state.mensajeFont,
          inicialTFont: this.state.inicialTFont,
          finalTFont: this.state.finalTFont,
          inviFont: this.state.inviFont,
          inviFont2: this.state.inviFont2,
          inviEfecto: this.state.inviEfecto,
          inviEfectoRep: this.state.inviEfectoRep,
          inicialTSize: this.state.inicialTSize,
          finalTSize: this.state.finalTSize,
        }


        this.dataInvitacionCard = {
          vistaTemp: true,
          inviEfecto: this.state.inviEfecto,
          efectoInvi: this.state.efectoInvi,
          repEfectoInvi: this.state.repEfectoInvi,
          inviEfectoRep: this.state.inviEfectoRep,
          generalCheck: this.state.generalCheck,
          cPrincipal: this.state.cPrincipal,
          cWhite: this.state.cWhite,
          inviFont: this.state.inviFont,
          inviFont2: this.state.inviFont2,
          generalSize: this.state.generalSize,
          nombreGrupo: 'Familia Gonzalez',
          cantidad: this.state.cantidad,
          nombreFont: this.state.nombreFont,
          mesa: '1',
          generalTexto: this.state.generalTexto,
          croquisOk: this.state.croquisOk,
          croquis: this.state.croquis,
          cSecond: this.state.cSecond,
          checking: (this.state.checking == 'true') ? true : false
        }

        this.dataMensajeCard = {
          vistaTemp: true,
          ...this.state
        }
        this.dataListasCard = {
          vistaTemp: true,
          ...this.state,
          chambelanesCheck: this.chambelanesCheck,
          menuCheck: this.menuCheck,
          musicaCheck: this.musicaCheck,
          padresCheck: this.padresCheck,
          isMusic: this.isMusic,
          musicRepit: this.musicRepit,
          padrinosCheck: this.padrinosCheck,
          codigoVestimentaCheck: this.codigoVestimentaCheck,
          itinerarioCheck: this.itinerarioCheck,
          mesaRegalosCheck: this.mesaRegalosCheck,
        }
        this.dataDondeCard = {
          vistaTemp: true,
          ...this.state,
          donde1Check: this.donde1Check,
          donde2Check: this.donde2Check,
          donde3Check: this.donde3Check,
          hospedajeCheck: this.hospedajeCheck,
        }

      }
    }


    if (this.dataDondeCard) {

      setTimeout(() => {

        let t: string = `My Ticket Party | ${this.dataDondeCard.nombreFiesta}  -  ${this.functionsService.numberToDate(Number(this.dataDondeCard.fiestaDate))}`;
        this.title.setTitle(t);
        let data = {
          title: t,
          description:
            `${this.dataDondeCard.mensaje1} `,
          keywords:
            'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
          slug: 'core/templates/default',
          colorBar: '#13547a',
          image: `${this.url}/upload/invitaciones/${this.dataDondeCard.img1}`

        }
        this.metaService.generateTags(data)

      }, 500);
    }




  }
  ngOnInit() { }
  async dateToNumber(data) {
    data.dateCreated = (typeof (data.dateCreated) == 'string') ? this.functionsService.dateToNumber(data.dateCreated) : data.dateCreated
    data.lastEdited = (data.lastEdited != undefined) ? (typeof (data.lastEdited) == 'string') ? this.functionsService.dateToNumber(data.lastEdited) : data.lastEdited : ''
    data.donde1Date = (typeof (data.donde1Date) == 'string') ? this.functionsService.dateToNumber(data.donde1Date) : data.donde1Date
    data.donde2Date = (typeof (data.donde2Date) == 'string') ? this.functionsService.dateToNumber(data.donde2Date) : data.donde2Date
    data.donde3Date = (typeof (data.donde3Date) == 'string') ? this.functionsService.dateToNumber(data.donde3Date) : data.donde3Date
    data.donde1Check = (data.donde1Check == 'true' || data.donde1Check == true) ? true : false
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false
    data.croquisOk = (data.croquisOk == 'true' || data.croquisOk == true) ? true : false
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
    data.croquisOk = (data.croquisOk == 'true' || data.croquisOk == true) ? true : false
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
    }, 2000);
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
      this.boleto.requeridos = 0
      this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
        this.functionsService.alert('Invitación', 'Se quito la confirmación', 'success')
        this.loading = false
      })
    } else {
      this.boleto.fechaConfirmacion = this.today
      if (this.fiesta.checking) {
        Swal.fire({
          title: '¿Cuantas personas asistiran?',
          html: `<input type="number" class="form-control" value="${(this.boleto.cantidadInvitados) ? this.boleto.cantidadInvitados : '0'}" step="1"id="range-value"  class="form-control">`,
          input: 'range',
          confirmButtonColor: "#13547a",
          inputValue: (this.boleto.cantidadInvitados) ? this.boleto.cantidadInvitados : '0',
          inputAttributes: {
            min: '0',
            max: '20',
            step: '1',
          },
          didOpen: () => {
            const inputRange = Swal.getInput()!
            const inputNumber = Swal.getPopup()!.querySelector('#range-value') as HTMLInputElement
            // remove default output
            Swal.getPopup()!.querySelector('output')!.style.display = 'none'
            inputRange.style.width = '100%'
            // sync input[type=number] with input[type=range]
            inputRange.addEventListener('input', () => {
              inputNumber.value = inputRange.value
            })
            // sync input[type=range] with input[type=number]
            inputNumber.addEventListener('change', () => {
              inputRange.value = inputNumber.value
            })
          },
        }).then((result) => {
          this.boleto.requeridos = Number(result.value)
          this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
            this.boleto.cantidadInvitados
            this.loading = false
            this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
          })
        });
      } else {
        this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
          this.boleto.cantidadInvitados
          this.loading = false
          this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
        })
      }
      Swal.fire({
        title: '¿Cuantas personas asistiran?',
        html: `<input type="number" value="${this.boleto.cantidadInvitados}" step="1"id="range-value">`,
        input: 'range',
        confirmButtonColor: "#13547a",
        inputValue: this.boleto.cantidadInvitados.toString(),
        inputAttributes: {
          min: '0',
          max: '20',
          step: '1',
        },
        didOpen: () => {
          const inputRange = Swal.getInput()!
          const inputNumber = Swal.getPopup()!.querySelector('#range-value') as HTMLInputElement
          // remove default output
          Swal.getPopup()!.querySelector('output')!.style.display = 'none'
          inputRange.style.width = '100%'
          // sync input[type=number] with input[type=range]
          inputRange.addEventListener('input', () => {
            inputNumber.value = inputRange.value
          })
          // sync input[type=range] with input[type=number]
          inputNumber.addEventListener('change', () => {
            inputRange.value = inputNumber.value
          })
        },
      }).then((result) => {
        this.boleto.requeridos = Number(result.value)
        this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
          this.boleto.cantidadInvitados
          this.loading = false
          this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
        })
      });
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
        this.pushsService.crearPush(respuesta).subscribe((resp: any) => {
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
          })
        })
      })
      .catch(err => {
        console.error('Error', err)
        return {
          ok: false,
          err
        }
      })
  }
  typeOf(val) {
    return typeof (val)
  }
  viewCroquis(type, img) {
    this._modalService.show<ImgTemplate>(ImagenComponent, {
      title: 'Ver croquis salon',
      size: 3,
      model: { type: type, img: img },
      mode: 'default'
    })
  }
  regresar() {
    let back = this.functionsService.getLocal('viewTemplate')
    this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
    this.functionsService.removeItemLocal('viewTemplate')
    this.functionsService.removeItemLocal('invitacion')
  }
  copiarInvitacion(data) {
    if (this.functionsService.getLocal('tipoInvitacion') && this.functionsService.getLocal('tipoInvitacion') == 'default') {
      this.functionsService.setLocal('invitacion', data)
      let back = this.functionsService.getLocal('viewTemplate')
      this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
      this.functionsService.removeItemLocal('viewTemplate')
    } else {
      this.functionsService.alert('Alerta', 'El tipo de invitacion no es la dinámica', 'warning')
      let back = this.functionsService.getLocal('viewTemplate')
      this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
      this.functionsService.removeItemLocal('viewTemplate')
    }
  }
  playStop() {
    var v = document.getElementsByTagName("audio")[0];
    var sound = false;
    var boton = document.getElementById("boton");
    boton.addEventListener("click", function () {
      if (v.paused) {
        v.play();
        v.play();
        v.play();
        v.play();
        this.innerHTML = ' <span  ><i class="bi bi-stop"></i></span>';
      } else {
        v.pause();
        v.pause();
        v.pause();
        v.pause();
        v.pause();
        this.innerHTML = ' <span  ><i class="bi bi-play"></i></span>';
      }
    });
  }
}