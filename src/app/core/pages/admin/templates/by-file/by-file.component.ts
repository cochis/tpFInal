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

import { PushsService } from 'src/app/core/services/push.service';
import { Push } from 'src/app/core/models/push.model';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-by-file',
  templateUrl: './by-file.component.html',
  styleUrls: ['./by-file.component.scss']
})
export class ByFileComponent implements OnInit {
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
  copyId: string = ''
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
  padres = []
  padrinos = []
  chambelanes = []
  menu = []
  musica = []
  repitVideo: boolean
  donde1Check: boolean
  donde2Check: boolean
  donde3Check: boolean
  mesaRegalosCheck: boolean
  codigoVestimentaCheck: boolean
  confirmacionCheck: boolean
  generalCheck: boolean
  checking: boolean
  hospedajeCheck: boolean
  chambelanesCheck: boolean
  padresCheck: boolean
  menuCheck: boolean
  musicaCheck: boolean
  padrinosCheck: boolean
  vistaTemp: boolean
  pushOk: boolean = false
  isMusic: boolean
  musicaInvitacion = ''
  musicRepit = ''
  mesaOk = true
  items = [
    'invitacion',
    'padres',
    'padrinos',
    'chambelanes',
    'donde',
    'hospedaje',
    'menu',
    'musica',
    'codigo',
    'mesa',
    'itinerarios',
    'boleto',
    'notas',
  ]
  icon = 'bi bi-volume-mute-fill'
  playMusic = true
  constructor(
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private route: ActivatedRoute,
    private boletosService: BoletosService,
    private swPush: SwPush,
    private pushsService: PushsService,
    private title: Title,
    private meta: Meta,
    private titleService: Title
  ) {
    this.functionsService.quitarChatShared()

    this.loading = true
    this.fiestaId = this.route.snapshot.params['fiesta']
    this.copyId = this.route.snapshot.params['copy']

    this.boletoId = this.route.snapshot.params['boleto']
    if (this.fiestaId && this.boletoId) {
      this.boletosService.cargarBoletoById(this.boletoId).subscribe((resp: any) => {
        this.boleto = resp.boleto

        if (!this.boleto.activated) {
          this.functionsService.alert('Boleto eliminado', 'Contactar con el anfitrion', 'info')
          this.functionsService.navigateTo("/core/inicio")
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

      // Se carga la fiesta por ID  
      this.fiestasService.cargarFiestaById(this.fiestaId).subscribe((resp: any) => {
        this.fiesta = resp.fiesta
        this.checking = this.fiesta.checking
        this.invitacionsService.cargarInvitacionByFiesta(this.fiestaId).subscribe(async (resp: any) => {
          this.invitacion = { ...resp.invitacion.data, byFile: true }
          let t: string = `My Ticket Party | ${this.fiesta.nombre}  -  ${this.functionsService.numberToDate(Number(this.fiesta.fecha))} `;

          this.invitacion.byFile = true
          this.restParty()
          this.invitacion = await this.dateToNumber(this.invitacion)
          this.invitacion.mesa = this.boleto.mesa
          this.date = this.vistaTemp ? this.today + 15000 : this.fiesta.fecha
          this.invitacion.cantidad = this.boleto.cantidadInvitados
          this.invitacion.invitado = this.boleto.nombreGrupo
          this.repitVideo = this.invitacion.repitVideo
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
          this.padrinos = this.invitacion.padrinos
          this.padrinosCheck = this.invitacion.padrinosCheck
          this.chambelanes = this.invitacion.chambelanes
          this.chambelanesCheck = this.invitacion.chambelanesCheck
          this.codigoVestimentaCheck = this.invitacion.codigoVestimentaCheck
          this.menu = this.invitacion.menu
          this.menuCheck = this.invitacion.menuCheck
          this.musica = this.invitacion.musica
          this.musicaCheck = this.invitacion.musicaCheck
          this.isMusic = this.invitacion.isMusic
          this.musicaInvitacion = this.invitacion.musicaInvitacion
          this.musicRepit = this.invitacion.musicRepit

        }, (error) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Fiestas')
          this.functionsService.navigateTo("/core/inicio")
        })
      }, (error) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Fiestas')
        this.functionsService.navigateTo("/core/inicio")
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
          example: true,
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
          donde1Check: true,
          repitVideo: true,
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
          colorQr: '#ffffff',
          colorBGQr: '#f82525',
          mesaOk: true
        }
        this.itinerarios = this.invitacion.itinerarios
        this.notas = this.invitacion.notas
      } else {
        this.restParty()
        this.vistaTemp = false
        this.itinerarios = JSON.parse(this.state.itinerarios)
        this.notas = JSON.parse(this.state.notas)
        this.padres = JSON.parse(this.state.padres)
        this.padrinos = JSON.parse(this.state.padrinos)
        this.chambelanes = JSON.parse(this.state.chambelanes)
        this.menu = JSON.parse(this.state.menu)
        this.musica = JSON.parse(this.state.musica)
        this.donde1Check = (this.state.donde1Check == 'true') ? true : false
        this.repitVideo = (this.state.repitVideo == 'true') ? true : false
        this.donde2Check = (this.state.donde2Check == 'true') ? true : false
        this.donde3Check = (this.state.donde3Check == 'true') ? true : false
        this.mesaRegalosCheck = (this.state.mesaRegalosCheck == 'true') ? true : false
        this.confirmacionCheck = (this.state.confirmacionCheck == 'true') ? true : false
        this.generalCheck = (this.state.generalCheck == 'true') ? true : false
        this.hospedajeCheck = (this.state.hospedajeCheck == 'true') ? true : false
        this.invitacion = this.state


        this.codigoVestimentaCheck = (this.state.codigoVestimentaCheck == 'true') ? true : false
        this.chambelanesCheck = (this.state.chambelanesCheck == 'true') ? true : false
        this.padresCheck = (this.state.padresCheck == 'true') ? true : false
        this.padrinosCheck = (this.state.padrinosCheck == 'true') ? true : false
        this.menuCheck = (this.state.menuCheck == 'true') ? true : false
        this.musicaCheck = (this.state.musicaCheck == 'true') ? true : false
        this.hospedajeCheck = (this.state.hospedajeCheck == 'true') ? true : false
        this.date = this.invitacion.fiestaDate

        this.date = this.vistaTemp ? this.today + 15000 : this.invitacion.fiestaDate


        this.btnBack = true
        this.checking = (this.state.checking == 'true') ? true : false
        this.isMusic = (this.state.isMusic == 'true') ? true : false
        this.musicaInvitacion = this.state.musicaInvitacion
        this.musicRepit = this.state.musicRepit
        this.mesaOk = this.state.mesaOk


      }

    }


  }
  ngOnInit() {
    const titulo = `My Ticket Party | ${this.state.nombreFiesta}  -  ${this.functionsService.numberToDate(Number(this.state.fiestaDate))}  `;;
    const descripcion = `${this.state.nombreFiesta} | MyTicketParty `
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('twitter:card');
    this.meta.removeTag('twitter:title');
    this.meta.removeTag('twitter:description');
    this.meta.removeTag('twitter:image');
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: `${this.url}/upload/invitaciones/${this.state.byFileInvitacion}` },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/inicio' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: `${this.url}/upload/invitaciones/${this.state.byFileInvitacion}` },
      { name: 'slug', content: 'core/inicio' },
      { name: 'colorBar', content: '#13547a' },
    ]);
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

  async dateToNumber(data) {
    data.dateCreated = (typeof (data.dateCreated) == 'string') ? this.functionsService.dateToNumber(data.dateCreated) : data.dateCreated
    data.lastEdited = (data.lastEdited != undefined) ? (typeof (data.lastEdited) == 'string') ? this.functionsService.dateToNumber(data.lastEdited) : data.lastEdited : ''
    data.donde1Date = (typeof (data.donde1Date) == 'string') ? this.functionsService.dateToNumber(data.donde1Date) : data.donde1Date
    data.donde2Date = (typeof (data.donde2Date) == 'string') ? this.functionsService.dateToNumber(data.donde2Date) : data.donde2Date
    data.donde3Date = (typeof (data.donde3Date) == 'string') ? this.functionsService.dateToNumber(data.donde3Date) : data.donde3Date
    data.repitVideo = (data.repitVideo == 'true' || data.repitVideo == true) ? true : false
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
    data.repitVideo = (data.repitVideo == 'true' || data.repitVideo == true) ? true : false
    data.donde1Check = (data.donde1Check == 'true' || data.donde1Check == true) ? true : false
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false
    return await data
  }
  setData(fiesta, boleto) {

    /* 
        this.metaService.generateTags({
          title: `${fiesta.nombre} -  ${this.functionsService.datePush(fiesta.fecha)}  `,
          description:
            `Hola ${boleto.nombreGrupo} te invito tienes  ${boleto.cantidadInvitados} boletos`,
          keywords:
            'No faltes, te espero ',
          slug: `core/templates/default/${fiesta.uid}/${boleto.uid}`,
          colorBar: '#13547a',
          image:
            this.url + '/upload/invitaciones/' + this.invitacion.img1,
        }); */
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
          html: `<input type="number" value="${(this.boleto.cantidadInvitados) ? this.boleto.cantidadInvitados : '0'}" step="1"id="range-value"  class="form-control">`,
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
  regresar() {
    let back = this.functionsService.getLocal('viewTemplate')
    this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
    this.functionsService.removeItemLocal('viewTemplate')
    this.functionsService.removeItemLocal('invitacion')
  }
  copiarInvitacion(data) {

    if (this.functionsService.getLocal('tipoInvitacion') && this.functionsService.getLocal('tipoInvitacion') == 'byFile') {


      this.functionsService.setLocal('invitacion', data)
      let back = this.functionsService.getLocal('viewTemplate')
      this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
      this.functionsService.removeItemLocal('viewTemplate')
    } else {

      this.functionsService.alert('Alerta', 'El tipo de invitacion no es por archivo', 'warning')
      let back = this.functionsService.getLocal('viewTemplate')
      this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
      this.functionsService.removeItemLocal('viewTemplate')
    }

  }
  playStop() {
    var v = document.getElementsByTagName("audio")[0];
    this.playMusic = !this.playMusic;

    if (this.playMusic) {
      this.icon = 'bi bi-volume-mute-fill'
    } else {
      this.icon = 'bi bi-play-fill'
    }

  }
}