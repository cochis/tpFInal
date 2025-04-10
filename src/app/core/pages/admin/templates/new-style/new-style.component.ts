
import { Component, Inject, OnInit } from '@angular/core';
import { SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import * as $ from 'jquery';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Fondo } from 'src/app/core/models/fondo.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FondosService } from 'src/app/core/services/fondo.service';
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
export class NewStyleComponent implements OnInit {
  loading = false
  presentacionView = true
  invitacionView = false
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
  public qrCodeDownloadLink: SafeUrl = "";
  allItems: number[] = [];  // Lista completa de elementos
  visibleItems: number[] = []; // Lista de elementos visibles
  itemsPerLoad = 10; // Cantidad de elementos a mostrar por scroll
  bgs: any = []
  frames: any = []
  items = [
    'timer',
    'dondeCuando',
    'galery',
    'padrinos',
    'chambelanes',
    'programa',
    'menu',
    'mesa-regalos',
    'hospedaje',
    'qr',
    'confirmacion',
    'galeriaFiesta',
    'notas',
    'codigoVestimenta'
  ]
  bgsframes: Fondo[]
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
    private fondosService: FondosService
  ) {

    this.loading = true
    this.fondosService.cargarFondosAll().subscribe(resp => {
      this.bgsframes = this.functionsService.getActives(resp.fondos)


      this.frames = this.bgsframes.filter(bgf => { return bgf.tipo == 'FRAME' })


      this.bgs = this.bgsframes.filter(bgf => { return bgf.tipo == 'BG' })

    })
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

            efectoCount: this.invitacion.efectoCount,
            efectoRepCount: this.invitacion.efectoRepCount,
            mensajeFont: this.invitacion.mensajeFont,
            inicialTFont: this.invitacion.inicialTFont,
            finalTFont: this.invitacion.finalTFont,
            inviFont: this.invitacion.inviFont,
            inviFont2: this.invitacion.inviFont2,
            inviEfecto: this.invitacion.inviEfecto,
            inviEfectoRep: this.invitacion.inviEfectoRep,
            inicialTSize: this.invitacion.inicialTSize,
            finalTSize: this.invitacion.finalTSize,
            cabeceraFont: this.invitacion.cabeceraFont,
            cabeceraSize: this.invitacion.cabeceraSize,
            date: this.fiesta.fecha,
            typeCount: this.invitacion.typeCount,

          }


          this.dataInvitacionCard = {
            ...this.invitacion,
            inviEfecto: this.invitacion.inviEfecto,
            inviEfectoRep: this.invitacion.inviEfectoRep,
            generalCheck: resp.invitacion.data.generalCheck,
            cPrincipal: this.invitacion.cPrincipal,
            cWhite: this.invitacion.cWhite,
            inviFont: this.invitacion.inviFont,
            inviFont2: this.invitacion.inviFont2,
            generalSize: this.invitacion.generalSize,
            nombreGrupo: this.boleto.nombreGrupo,
            cantidad: this.boleto.cantidadInvitados,
            nombreFont: this.invitacion.nombreFont,
            mesa: this.invitacion.mesa,
            generalTexto: this.invitacion.generalTexto,
            croquisOk: this.fiesta.croquisOk,
            croquis: this.fiesta.croquis,
            cSecond: this.invitacion.cSecond,
            checking: this.fiesta.checking,
            cabeceraFont: this.invitacion.cabeceraFont,
            cabeceraSize: this.invitacion.cabeceraSize,
            vistaTemp: false,


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


          setTimeout(() => {

            this.loading = false
          }, 1500);
          this.presentacionView = true

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

          efectoCount: '',
          efectoRepCount: '',
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
          donde3Title: 'Lugar del evento',
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
          efectoCount: this.state.efectoCount,
          efectoRepCount: this.state.efectoRepCount,
          mensajeFont: this.state.mensajeFont,
          inicialTFont: this.state.inicialTFont,
          finalTFont: this.state.finalTFont,
          inviFont: this.state.inviFont,
          inviFont2: this.state.inviFont2,
          inviEfecto: this.state.inviEfecto,
          inviEfectoRep: this.state.inviEfectoRep,
          inicialTSize: this.state.inicialTSize,
          finalTSize: this.state.finalTSize,
          cabeceraFont: this.state.cabeceraFont,
          cabeceraSize: this.state.cabeceraSize,
          typeCount: this.state.typeCount,
          date: JSON.parse(this.state.fiesta).fecha,
          example: JSON.parse(this.state.fiesta).example
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
          cabeceraFont: this.state.cabeceraFont,
          cabeceraSize: this.state.cabeceraSize,
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

        setTimeout(() => {

          this.loading = false
        }, 1500);
        this.presentacionView = true



      }
    }



  }


  ngOnInit() {


  }

  onScroll(event: any) {
    const element = event.target;

    this.items.forEach((item, i) => {
      const element = document.getElementById(`${item}`);
      let visibleItem = '';

      if (element) {
        const rect = element.getBoundingClientRect();
        if (((rect.top) <= window.innerHeight) || i == this.items.length) {

          visibleItem = `Item ${item}`;

          element.classList.remove('noVisible');
          element.classList.add('animate__fadeIn');
          ;
        }
        else {
          element.classList.add('noVisible');
          element.classList.remove('animate__fadeIn');

        }
      }
    });
  }


  closePresentacion(close) {


    document.getElementById('presentacion').classList.add('animate__bounceOutUp');


    setTimeout(() => {
      this.presentacionView = false
      this.invitacionView = true

      setTimeout(() => {

        document.getElementById('invitacion').classList.add(this.invitacion.invitacionEfecto);
      }, 10);

      setTimeout(() => {
        document.getElementById('invitacion').classList.remove('dn');


      }, 4000);
    }, 2500);


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
  getQr(boleto?) {
    if (boleto) {

      var qr: any = {

        uid: boleto.uid,
        fiesta: boleto.fiesta,
        grupo: boleto.grupo,
        salon: boleto.salon,

        activated: boleto.activated
      }
      qr = JSON.stringify(qr)



      return qr
    } else {
      return { url: 'https://myticketparty.com' }
    }

  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
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
}

