import { Component } from '@angular/core';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { InvitacionsService } from '../../../../services/invitaciones.service';
import { CargarFiesta, CargarInvitacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { DefaultTemplate } from 'src/app/core/models/defaultTemplate.model';
import { FileService } from 'src/app/core/services/file.service';
import { Invitacion } from 'src/app/core/models/invitacion.model';
import { environment } from 'src/environments/environment';
import { MapsService } from 'src/app/shared/services/maps.service';
import { SalonsService } from '../../../../services/salon.service';
import { Salon } from 'src/app/core/models/salon.model';
import { EjemplosService } from 'src/app/core/services/ejemplo.service';
import { Ejemplo } from 'src/app/core/models/ejemplo.model';
import { FondosService } from 'src/app/core/services/fondo.service';
import { Fondo } from 'src/app/core/models/fondo.model';
@Component({
  selector: 'app-editar-invitacion',
  templateUrl: './editar-invitacion.component.html',
  styleUrls: ['./editar-invitacion.component.scss']
})
export class EditarInvitacionComponent {
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  fonts = environment.fonts
  bgs: any = []
  frames: any = []
  examples: any = []
  fiestas: any = []
  loading = false
  typeView = 'seccionInicial'
  public imagenSubir!: File
  public soundSubir!: File
  public imgTemp: any = undefined
  public soundTemp: any = undefined
  url = environment.base_url
  urlT = environment.text_url
  fiesta: Fiesta
  invitacion: any = undefined
  invitacionTemp: Invitacion = undefined
  id: string = 'sm'
  edit: any
  submited: boolean = false
  default: DefaultTemplate
  invitacionId = ''
  typeTemplate = ''
  play = false
  today: Number = this.functionsService.getToday()
  uid = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  usuarioCreated = ''
  public form!: FormGroup
  invi: any
  viewVideo = false
  viewSizeM = ''
  usuarioFiesta = ''
  viewInicial = false
  textUrl: any = environment.text_url
  efectos = environment.efectos
  repEfec = environment.repEfec
  icons = []
  userLocation: any = undefined
  salonLocation: any = undefined
  iglesiaLocation: any = undefined
  registroLocation: any = undefined
  hospedajeLocation: any = undefined
  col: boolean = false
  ima: boolean = false
  tit: boolean = false
  sub: boolean = false
  fec: boolean = false
  inv: boolean = false
  ent: boolean = false
  mus: boolean = false
  cab: boolean = false
  icon: boolean = false

  imgIntro: boolean = false
  textoInvitacion: boolean = false
  fondos: boolean = false
  salon: Salon
  ejemplos: Ejemplo[]
  bgsframes: Fondo[]
  urlLink = ''
  text_url = environment.text_url
  constructor(
    private printService: NgxPrintService,
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private route: ActivatedRoute,
    private fiestasService: FiestasService,
    private ejemplosServices: EjemplosService,
    private invitacionsService: InvitacionsService,
    private router: Router,
    private fileService: FileService,
    private mapService: MapsService,
    private salonsService: SalonsService,
    private fondosService: FondosService

  ) {
    this.fondosService.cargarFondosAll().subscribe(resp => {
      this.bgsframes = this.functionsService.getActives(resp.fondos)


      this.frames = this.bgsframes.filter(bgf => { return bgf.tipo == 'FRAME' })

      this.bgs = this.bgsframes.filter(bgf => { return bgf.tipo == 'BG' })
      this.icons = this.bgsframes.filter(bgf => { return bgf.tipo == 'ICON' })

    })


    setTimeout(() => {
      this.viewInicial = true
    }, 500);
    this.functionsService.alert('Crear invitación', 'Se recomienda realizar la invitación en una computadora para facilitar la edición.', 'info')
    this.functionsService.removeItemLocal('tipoInvitacion')
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    if (this.edit == 'true') {
      this.edit = true
    } else {
      this.edit = false
    }
    this.getInvitacion(this.id)
    this.getFiesta(this.id)
    this.changeSize('sm')
  }
  get errorControl() {
    return this.form.controls;
  }
  async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude]
          resolve(this.userLocation)
        },
        (err) => {
          // console.error('err::: ', err);
          this.functionsService.alertError(err, 'error')
        }
      )
    })
  }
  getFiesta(id) {
    this.loading = true
    this.fiestasService.cargarFiestaById(id).subscribe((resp: CargarFiesta) => {
      this.fiesta = resp.fiesta

      this.salonLocation = [this.fiesta.salon.long, this.fiesta.salon.lat]
      this.usuarioFiesta = this.fiesta.usuarioFiesta._id
      this.invitacionId = this.fiesta.invitacion
      this.functionsService.setLocal('tipoInvitacion', this.fiesta.invitacion)
    },
      (error: any) => {
        // console.error('Error', error)
        this.loading = false
        this.functionsService.alert('Fiesta', 'Por favor intente mas tarde', 'error')
      })
  }

  restaurarAltura() {
    this.form.patchValue({
      cPrincipal: '#ffc1cb',
      cSecond: '#c0354e',
      cWhite: '#ffffff',
      cTexto: '#000',
      xImg1: 50,

      yImg1: 0,
      bxMensajeImg: 50,
      byMensajeImg: 0,
      topTitle: 40,
      typeCount: '',
      noBgColor: false,
      bgCount: '',
      topDate: 50,
      efectoCount: '',
      efectoRepCount: '',
      colorQr: '#c0354e',
      colorBgQr: '#ffffff',
    })
    return
  }
  createForm(fiesta: Fiesta) {


    this.functionsService.numberDateTimeLocal(fiesta.fecha)
    this.form = this.fb.group({
      cPrincipal: ['#ffc0cb'],
      cSecond: ['#c0354e'],
      cWhite: ['#ffffff'],
      cTexto: ['#000'],
      img1: [''],
      img1Size: [''],
      img1Forma: [''],
      iconSize: [],
      img1Height: [''],
      img1Rotate: [''],
      img1Traslate: [''],
      img1Top: [''],
      efectoImg1: [''],
      repEfectoImg1: [''],
      efectoFecha: [''],
      repEfectoFecha: [''],
      efectoInvitacion: [''],
      repEfectoInvitacion: [''],
      imgWidth: [100],
      xImg1: [50],
      yImg1: [0],
      topTitle: [40],
      nombreSize: [20],
      cabeceraFont: ['pacific'],
      textoInvFont: ['pacific'],
      mensajeAlign: ['center'],
      textoInvSize: [20],
      cabeceraSize: [20],
      cabeceraEfecto: [''],
      cabeceraEfectoRep: [''],
      titleSize: [20],
      cantidad: [this.fiesta.cantidad],
      tipoFiesta: [''],
      tipoFont: [''],
      tipoSize: [90],
      tipoTop: [90],
      tipoEfecto: [''],
      tipoEfectoRep: [1],
      typeCount: '',
      noBgColor: false,
      bgCount: '',
      topDate: [50],
      efectoCount: [''],
      efectoRepCount: [''],
      checking: [this.fiesta.checking],
      fiestaDate: [Number(this.fiesta.fecha)],
      nombreFiesta: [''],
      repImgLeft: [''],
      repImgRight: [''],
      efectoImgRight: [''],
      efectoImgleft: [''],
      imgIntroLeftCheck: [''],
      fondoInvitacionCheck: [false],
      marcoFotoCheck: [''],
      fondoInvitacionUp: [''],
      marcoFotoUp: [''],
      bgIntro: [''],
      fuenteMensajeInicial: [''],
      efectoMensajeInicial: [''],
      repEfectoMensajeInicial: [''],
      colorMensajeInicial: [''],
      sizeMensajeInicial: [''],
      tiempoEsperaMensajeInicial: [''],
      imgIntroLeftUp: [''],
      marcoSizeSubtitle: [15],
      marcoSizeTitle: [15],
      mensajeInicial: ['Ve tu invitación'],
      imgIntroRightCheck: [''],
      imgIntroRightUp: [''],
      imgIntroLeft: ['bg7.png'],
      imgIntroRight: ['bg6.png'],
      invitacionEfecto: ['animate__fadeIn'],
      fondoInvitacion: ['bg1.avif'],
      marcoFoto: [''],
      marcoIndex: [''],
      marcoFotoWidth: [150],
      marcoFotoTop: [150],
      nombreFont: ['pacific'],

      cShCab: [''],
      nShCab: [''],
      cShTexto: [''],
      nShTexto: [''],
      cShTit: [''],
      nShTit: [''],
      cShMensaje: [''],
      nShMensaje: [''],
      cShSubTit: [''],
      nShSubTit: [''],
      nombreEfecto: [''],
      nombreEfectoRep: [1],
      nombresSize: [187],
      textInvitacionValida: ['¡Los esperamos!'],
      mensajeCheck: [true],
      mensajeImg: [''],
      mensajeFont: ['pacific'],
      inicialTFont: ['pacific'],
      inicialTSize: [10],
      efectoInvi: [''],
      repEfectoInvi: [''],
      finalTSize: [10],
      musicaInvitacion: [''],
      isMusic: [false],
      musicRepit: [false],
      finalTFont: ['pacific'],
      inviFont: ['pacific'],
      inviFont2: ['pacific'],
      inviEfecto: [''],
      inviEfectoRep: [1],
      mensajeImgWidth: [100],
      alturaMensaje: [25],
      bxMensajeImg: [50],
      byMensajeImg: [0],
      mensaje1: [''],
      mensajeSize: [25],
      mensajeEfecto: [''],
      mensajeEfectoRep: [1],
      donde1Check: [true],
      donde1Img: [''],
      donde1Title: ['Iglesia'],
      galeriaCheck: [false],
      galeriaTitle: ['Momentos'],
      donde1Titulo: [''],
      donde1Text: [''],
      donde1Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde1Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde1AddressUbicacion: [''],
      donde1AddressUbicacionLng: [''],
      donde1AddressUbicacionLat: [''],
      donde1Address: [''],

      donde2Check: [true],
      donde2Img: [''],
      donde2Title: ['Civil'],
      donde2Titulo: [''],
      donde2Text: [''],
      donde2Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde2Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde2AddressUbicacion: [''],
      donde2AddressUbicacionLng: [''],
      donde2AddressUbicacionLat: [''],
      donde2Address: [''],
      donde3Check: [true],
      donde3Img: [this.fiesta.salon.img],
      donde3Title: ['Lugar del evento'],
      donde3Titulo: [''],
      donde3Text: [this.fiesta.salon.nombre],
      donde3Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde3Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde3AddressUbicacion: [this.fiesta.salon.ubicacionGoogle],
      donde3AddressUbicacionLng: [this.fiesta.salon.lng],
      donde3AddressUbicacionLat: [this.fiesta.salon.lat],
      donde3Address: [
        this.fiesta.salon.calle + ' ' + this.fiesta.salon.numeroExt + ' ' +
        this.fiesta.salon.numeroInt + ' ' + this.fiesta.salon.coloniaBarrio + ' ' +
        this.fiesta.salon.cp + ' ' + this.fiesta.salon.cp + ' ' + this.fiesta.salon.estado + ' ' + this.fiesta.salon.pais
      ],
      hospedajeCheck: [true],
      galeria1: [''],
      galeria2: [''],
      galeria3: [''],
      galeria4: [''],
      galeria5: [''],
      galeria6: [''],
      hospedajeImg: [''],
      hospedajeName: [''],
      hospedajeIcon: ['mt-2 mb-2 text-center  bi-info-circle pointer'],
      hospedajeAddress: [''],
      hospedajeUbicacion: [''],
      hospedajeUbicacionLng: [''],
      hospedajeUbicacionLat: [''],
      hospedajePhone: [''],
      mesaRegalosCheck: [true],
      confirmacionCheck: [true],
      recordatorioOk: [true],
      recordatorio: [''],
      ajusteCheck: [true],
      generalCheck: [true],
      generalSize: [15],
      generalTexto: [''],
      startText: [''],
      whereTitle: [''],
      hospedajeTitle: [''],
      mesaTitle: [''],
      itiTitle: [''],
      notasTitle: [''],
      confirmacionTexto: [''],
      confirmacionBotonTexto: [''],
      quitarConfirmacionBotonTexto: [''],
      sinConfBotonTexto: [''],
      questionConfirm: [''],
      galeryTitle: [''],
      galeryButtom: [''],
      galeryText: [''],
      endText: [''],
      dayText: [''],
      hourText: [''],
      minText: [''],
      segText: [''],
      menuTitle: [''],
      dressTitle: [''],
      boletoTitle: [''],
      boletoText: [''],
      mesaText: [''],
      mesaRegalosLugar: [''],
      mesaRegalosLugar2: [''],
      mesaRegalosUrl: [''],
      mesaRegalosUrl2: [''],
      mesaRegalosImg: [''],
      itinerarioCheck: [true],
      itinerarioBG: ['#fff'],
      itinerarioTitle: ['itinerario'],
      itinerarioName: [this.fiesta.nombre],
      itinerarios: this.fb.array([]),
      invitacionTemplate: [false],
      notaCheck: [true],
      notaBG: ['#fff'],
      notaTitle: ['Notas'],
      titlePadres: ['Mis Padres'],
      titlePadrinos: ['Mis Padrinos'],
      notas: this.fb.array([]),
      chambelanesCheck: [true],
      chambelanText: ['Chambelanes'],
      chambelanesImgCheck: [true],
      chambelanes: this.fb.array([]),
      padresCheck: [true],
      padres: this.fb.array([]),
      padrinosCheck: [true],
      padrinos: this.fb.array([]),
      menuCheck: [true],
      menu: this.fb.array([]),
      sobresCheck: [true],
      sobresTitle: ['Sumar Kilómetros a mi Viaje'],
      sobresCuenta: ['000 000 000'],
      sobresBanco: ['Bancomer'],
      sobresClabe: ['000 000 000'],
      sobresFestejadaTitle: ['Mariana'],
      sobresFestejadaNombre: ['Mariana Lopez'],
      sobresFestejadaMensaje: ['O con la tradicional lluvia de sobres. Es la tradición de regalar dinero en efectivo a la Quinceañera en un sobre el día del evento.'],
      musicaCheck: [true],
      musica: this.fb.array([]),
      codigoVestimentaCheck: [true],
      imgQrCheck: [true],
      codigoVestimentaHombre: [''],
      codigoVestimentaHombreImg: [''],
      codigoVestimentaMujer: [''],
      codigoVestimentaMujerImg: [''],

      colorQr: ['#ffffff'],
      colorBgQr: ['#c0354e'],
      usuarioCreated: [this.usuarioFiesta],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
      //byFIle
      typeFile: [''],
      repitVideo: [false],
      byFileColorTx: [''],
      byFileColorBG: [''],
      byFileColorFr: [''],
      byFileColorQr: [''],
      byFileInvitacionType: [''],
      byFileInvitacion: [''],
      byFileUrl: [''],
      byFileWidth: [''],
      byFileHeight: [''],
      byFileFrame: [''],
      byFileFrameWidth: [''],
    })



    this.loading = false
  }
  setForm(fiesta: Fiesta) {


    this.createForm(fiesta)
  }
  getCoords(data) {

    if (data.donde1AddressUbicacion != '') {
      let donde1AddressUbicacionRes = data.donde1AddressUbicacion.replace(this.MAPURL + '?q=', '')
      donde1AddressUbicacionRes = donde1AddressUbicacionRes.replace('&z=' + this.MAPZOOM, '')
      donde1AddressUbicacionRes = donde1AddressUbicacionRes.split(',')
      this.iglesiaLocation = [Number(donde1AddressUbicacionRes[1]), Number(donde1AddressUbicacionRes[0])]
    } else {
      this.mapService.getUserLocation().then(async res => {

        this.iglesiaLocation = await res

      })
    }
    if (data.donde2AddressUbicacion != '') {
      let donde2AddressUbicacionRes = data.donde2AddressUbicacion.replace(this.MAPURL + '?q=', '')
      donde2AddressUbicacionRes = donde2AddressUbicacionRes.replace('&z=' + this.MAPZOOM, '')
      donde2AddressUbicacionRes = donde2AddressUbicacionRes.split(',')
      this.registroLocation = [Number(donde2AddressUbicacionRes[1]), Number(donde2AddressUbicacionRes[0])]
    } else {
      this.mapService.getUserLocation().then(async res => {
        this.registroLocation = await res
      })
    }
    if (data.hospedajeUbicacion != '') {

      let hospedajeUbicacionRes = data.hospedajeUbicacion.replace(this.MAPURL + '?q=', '')
      hospedajeUbicacionRes = hospedajeUbicacionRes.replace('&z=' + this.MAPZOOM, '')
      hospedajeUbicacionRes = hospedajeUbicacionRes.split(',')

      this.hospedajeLocation = [Number(hospedajeUbicacionRes[1]), Number(hospedajeUbicacionRes[0])]
    } else {
      this.mapService.getUserLocation().then(async res => {
        this.hospedajeLocation = await res
      })
    }
  }
  async setFormWithData(invitacion: any) {


    this.getCoords(invitacion.data)
    invitacion.data = await this.numberToData(invitacion.data)
    this.form = this.fb.group({
      cPrincipal: [invitacion.data.cPrincipal],
      cSecond: [invitacion.data.cSecond],
      checking: [invitacion.fiesta.checking],
      cWhite: [invitacion.data.cWhite],
      cTexto: [invitacion.data.cTexto],
      img1: [invitacion.data.img1],
      img1Size: [invitacion.data.img1Size],
      img1Forma: [invitacion.data.img1Forma],
      iconSize: [invitacion.data.iconSize],
      img1Height: [invitacion.data.img1Height],
      img1Rotate: [invitacion.data.img1Rotate],
      img1Traslate: [invitacion.data.img1Traslate],
      img1Top: [invitacion.data.img1Top],
      efectoImg1: [invitacion.data.efectoImg1],
      repEfectoImg1: [invitacion.data.repEfectoImg1],
      efectoFecha: [invitacion.data.efectoFecha],
      repEfectoFecha: [invitacion.data.repEfectoFecha],
      efectoInvitacion: [invitacion.data.efectoInvitacion],
      repEfectoInvitacion: [invitacion.data.repEfectoInvitacion],


      xImg1: [invitacion.data.xImg1],
      yImg1: [invitacion.data.yImg1],
      imgWidth: [invitacion.data.imgWidth],
      topTitle: [invitacion.data.topTitle],

      cantidad: [invitacion.fiesta.cantidad],
      tipoFiesta: [invitacion.data.tipoFiesta],
      tipoSize: [invitacion.data.tipoSize],
      tipoTop: [invitacion.data.tipoTop],
      tipoEfecto: [invitacion.data.tipoEfecto],
      tipoEfectoRep: [invitacion.data.tipoEfectoRep],
      topDate: [invitacion.data.topDate],

      efectoCount: [invitacion.data.efectoCount],
      efectoRepCount: [invitacion.data.efectoRepCount],
      typeCount: [invitacion.data.typeCount],
      bgCount: [invitacion.data.bgCount],
      noBgColor: [invitacion.data.noBgColor],
      fiestaDate: [invitacion.fiesta.fecha],
      nombreFiesta: [invitacion.data.nombreFiesta],
      nombreSize: [invitacion.data.nombreSize],
      cabeceraFont: [invitacion.data.cabeceraFont],
      textoInvFont: [invitacion.data.textoInvFont],
      mensajeAlign: [invitacion.data.mensajeAlign],
      textoInvSize: [invitacion.data.textoInvSize],
      cabeceraSize: [invitacion.data.cabeceraSize],
      cabeceraEfecto: [invitacion.data.cabeceraEfecto],
      cabeceraEfectoRep: [invitacion.data.cabeceraEfectoRep],
      titleSize: [invitacion.data.titleSize],
      textInvitacionValida: [invitacion.data.textInvitacionValida],
      mensajeImg: [invitacion.data.mensajeImg],
      bxMensajeImg: [invitacion.data.bxMensajeImg],
      byMensajeImg: [invitacion.data.byMensajeImg],
      mensaje1: [invitacion.data.mensaje1],
      mensajeSize: [invitacion.data.mensajeSize],
      mensajeEfecto: [invitacion.data.mensajeEfecto],
      mensajeEfectoRep: [invitacion.data.mensajeEfectoRep],
      donde1Check: [invitacion.data.donde1Check],
      donde1Img: [invitacion.data.donde1Img],
      galeriaCheck: [invitacion.data.galeriaCheck],
      galeriaTitle: [invitacion.data.galeriaTitle],
      donde1Title: [invitacion.data.donde1Title],
      donde1Titulo: [invitacion.data.donde1Titulo],
      donde2Titulo: [invitacion.data.donde2Titulo],
      donde3Titulo: [invitacion.data.donde3Titulo],
      donde1Text: [invitacion.data.donde1Text],
      donde1Date: [invitacion.data.donde1Date],
      donde1Icon: [invitacion.data.donde1Icon],
      donde1AddressUbicacion: [invitacion.data.donde1AddressUbicacion],
      donde1AddressUbicacionLng: [invitacion.data.donde1AddressUbicacionLng],
      donde1AddressUbicacionLat: [invitacion.data.donde1AddressUbicacionLat],
      donde1Address: [invitacion.data.donde1Address],

      donde2Check: [invitacion.data.donde2Check],
      donde2Img: [invitacion.data.donde2Img],
      donde2Title: [invitacion.data.donde2Title],
      donde2Text: [invitacion.data.donde2Text],
      donde2Date: [invitacion.data.donde2Date],
      donde2Icon: [invitacion.data.donde2Icon],
      donde2AddressUbicacion: [invitacion.data.donde2AddressUbicacion],
      donde2AddressUbicacionLng: [invitacion.data.donde2AddressUbicacionLng],
      donde2AddressUbicacionLat: [invitacion.data.donde2AddressUbicacionLat],
      donde2Address: [invitacion.data.donde2Address],
      donde3Check: [invitacion.data.donde3Check],
      donde3Img: [invitacion.data.donde3Img],
      donde3Title: [invitacion.data.donde3Title],
      donde3Text: [invitacion.data.donde3Text],
      donde3Date: [invitacion.data.donde3Date],
      donde3Icon: [invitacion.data.donde3Icon],
      donde3AddressUbicacion: [invitacion.data.donde3AddressUbicacion],
      donde3AddressUbicacionLng: [invitacion.data.donde3AddressUbicacionLng],
      donde3AddressUbicacionLat: [invitacion.data.donde3AddressUbicacionLat],
      donde3Address: [invitacion.data.donde3Address],
      hospedajeCheck: [invitacion.data.hospedajeCheck],
      hospedajeImg: [invitacion.data.hospedajeImg],
      galeria1: [invitacion.data.galeria1],
      galeria2: [invitacion.data.galeria2],
      galeria3: [invitacion.data.galeria3],
      galeria4: [invitacion.data.galeria4],
      galeria5: [invitacion.data.galeria5],
      galeria6: [invitacion.data.galeria6],





      hospedajeName: [invitacion.data.hospedajeName],
      hospedajeIcon: [invitacion.data.hospedajeIcon],
      hospedajeAddress: [invitacion.data.hospedajeAddress],
      hospedajeUbicacion: [invitacion.data.hospedajeUbicacion],
      hospedajeUbicacionLng: [invitacion.data.hospedajeUbicacionLng],
      hospedajeUbicacionLat: [invitacion.data.hospedajeUbicacionLat],
      hospedajePhone: [invitacion.data.hospedajePhone],
      mesaRegalosCheck: [invitacion.data.mesaRegalosCheck],
      confirmacionCheck: [invitacion.data.confirmacionCheck],
      recordatorioOk: [invitacion.data.recordatorioOk],
      recordatorio: [invitacion.data.recordatorio],
      ajusteCheck: [invitacion.data.ajusteCheck],
      generalCheck: [invitacion.data.generalCheck],
      generalSize: [invitacion.data.generalSize],
      generalTexto: [invitacion.data.generalTexto],
      startText: [invitacion.data.startText],
      whereTitle: [invitacion.data.whereTitle],
      hospedajeTitle: [invitacion.data.hospedajeTitle],
      mesaTitle: [invitacion.data.mesaTitle],
      itiTitle: [invitacion.data.itiTitle],
      notasTitle: [invitacion.data.notasTitle],
      confirmacionTexto: [invitacion.data.confirmacionTexto],
      confirmacionBotonTexto: [invitacion.data.confirmacionBotonTexto],
      quitarConfirmacionBotonTexto: [invitacion.data.quitarConfirmacionBotonTexto],
      sinConfBotonTexto: [invitacion.data.sinConfBotonTexto],
      questionConfirm: [invitacion.data.questionConfirm],
      galeryTitle: [invitacion.data.galeryTitle],
      galeryButtom: [invitacion.data.galeryButtom],
      galeryText: [invitacion.data.galeryText],

      endText: [invitacion.data.endText],
      dayText: [invitacion.data.dayText],
      hourText: [invitacion.data.hourText],
      minText: [invitacion.data.minText],
      segText: [invitacion.data.segText],
      menuTitle: [invitacion.data.menuTitle],
      dressTitle: [invitacion.data.dressTitle],
      boletoTitle: [invitacion.data.boletoTitle],
      boletoText: [invitacion.data.boletoText],
      mesaText: [invitacion.data.mesaText],
      mesaRegalosLugar: [invitacion.data.mesaRegalosLugar],
      mesaRegalosLugar2: [invitacion.data.mesaRegalosLugar2],
      mesaRegalosUrl: [invitacion.data.mesaRegalosUrl],
      mesaRegalosUrl2: [invitacion.data.mesaRegalosUrl2],
      mesaRegalosImg: [invitacion.data.mesaRegalosImg],
      itinerarioCheck: [invitacion.data.itinerarioCheck],
      itinerarioBG: [invitacion.data.itinerarioBG],
      itinerarioTitle: [invitacion.data.itinerarioTitle],
      itinerarioName: [invitacion.fiesta.nombre],
      itinerarios: this.fb.array([]),

      notaCheck: [invitacion.data.notaCheck],
      notaBG: [invitacion.data.notaBG],
      notaTitle: [invitacion.data.notaTitle],
      titlePadres: [invitacion.data.titlePadres],
      titlePadrinos: [invitacion.data.titlePadrinos],
      invitacionTemplate: [invitacion.data.invitacionTemplate],
      notas: this.fb.array([]),

      chambelanes: this.fb.array([]),
      padres: this.fb.array([]),
      padrinos: this.fb.array([]),
      musica: this.fb.array([]),
      menu: this.fb.array([]),
      chambelanesCheck: [invitacion.data.chambelanesCheck],
      chambelanText: [invitacion.data.chambelanText],
      chambelanesImgCheck: [invitacion.data.chambelanesImgCheck],
      padresCheck: [invitacion.data.padresCheck],

      padrinosCheck: [invitacion.data.padrinosCheck],
      menuCheck: [invitacion.data.menuCheck],
      musicaCheck: [invitacion.data.musicaCheck],
      sobresCheck: [invitacion.data.sobresCheck],
      sobresTitle: [invitacion.data.sobresTitle],
      sobresCuenta: [invitacion.data.sobresCuenta],
      sobresBanco: [invitacion.data.sobresBanco],
      sobresClabe: [invitacion.data.sobresClabe],
      sobresFestejadaTitle: [invitacion.data.sobresFestejadaTitle],
      sobresFestejadaNombre: [invitacion.data.sobresFestejadaNombre],
      sobresFestejadaMensaje: [invitacion.data.sobresFestejadaMensaje],
      codigoVestimentaCheck: [invitacion.data.codigoVestimentaCheck],
      imgQrCheck: [invitacion.data.imgQrCheck],
      codigoVestimentaHombre: [invitacion.data.codigoVestimentaHombre],
      codigoVestimentaHombreImg: [invitacion.data.codigoVestimentaHombreImg],
      codigoVestimentaMujer: [invitacion.data.codigoVestimentaMujer],
      codigoVestimentaMujerImg: [invitacion.data.codigoVestimentaMujerImg],
      isMusic: [invitacion.data.isMusic],
      musicRepit: [invitacion.data.musicRepit],





      colorQr: [invitacion.data.colorQr],
      colorBgQr: [invitacion.data.colorBgQr],

      //Invitacion byFile
      typeFile: [invitacion.data.typeFile],
      repitVideo: [invitacion.data.repitVideo],
      byFileColorTx: [invitacion.data.byFileColorTx],
      byFileColorBG: [invitacion.data.byFileColorBG],
      byFileColorFr: [invitacion.data.byFileColorFr],
      byFileColorQr: [invitacion.data.byFileColorQr],
      byFileInvitacionType: [invitacion.data.byFileInvitacionType],
      byFileInvitacion: [invitacion.data.byFileInvitacion],
      byFileWidth: [invitacion.data.byFileWidth],
      byFileUrl: [invitacion.data.byFileUrl],
      byFileHeight: [invitacion.data.byFileHeight],
      byFileFrame: [invitacion.data.byFileFrame],
      byFileFrameWidth: [invitacion.data.byFileFrameWidth],



      //font width  IMG



      repImgRight: [invitacion.data.repImgRight ? invitacion.data.repImgRight : ''],
      repImgLeft: [invitacion.data.repImgLeft ? invitacion.data.repImgLeft : ''],
      efectoImgRight: [invitacion.data.efectoImgRight ? invitacion.data.efectoImgRight : ''],
      efectoImgLeft: [invitacion.data.efectoImgLeft ? invitacion.data.efectoImgLeft : ''],

      fondoInvitacionCheck: [invitacion.data.fondoInvitacionCheck ? invitacion.data.fondoInvitacionCheck : false],
      marcoFotoCheck: [invitacion.data.marcoFotoCheck ? invitacion.data.marcoFotoCheck : ''],
      fondoInvitacionUp: [invitacion.data.fondoInvitacionUp ? invitacion.data.fondoInvitacionUp : ''],
      marcoFotoUp: [invitacion.data.marcoFotoUp ? invitacion.data.marcoFotoUp : ''],


      imgIntroLeftCheck: [invitacion.data.imgIntroLeftCheck ? invitacion.data.imgIntroLeftCheck : ''],
      bgIntro: [invitacion.data.bgIntro ? invitacion.data.bgIntro : ''],
      fuenteMensajeInicial: [invitacion.data.fuenteMensajeInicial ? invitacion.data.fuenteMensajeInicial : ''],
      efectoMensajeInicial: [invitacion.data.efectoMensajeInicial ? invitacion.data.efectoMensajeInicial : ''],
      repEfectoMensajeInicial: [invitacion.data.repEfectoMensajeInicial ? invitacion.data.repEfectoMensajeInicial : ''],
      colorMensajeInicial: [invitacion.data.colorMensajeInicial ? invitacion.data.colorMensajeInicial : ''],
      sizeMensajeInicial: [invitacion.data.sizeMensajeInicial ? invitacion.data.sizeMensajeInicial : ''],
      tiempoEsperaMensajeInicial: [invitacion.data.tiempoEsperaMensajeInicial ? invitacion.data.tiempoEsperaMensajeInicial : ''],

      imgIntroLeftUp: [invitacion.data.imgIntroLeftUp ? invitacion.data.imgIntroLeftUp : ''],
      marcoSizeSubtitle: [invitacion.data.marcoSizeSubtitle ? invitacion.data.marcoSizeSubtitle : ''],
      marcoSizeTitle: [invitacion.data.marcoSizeTitle ? invitacion.data.marcoSizeTitle : ''],
      mensajeInicial: [invitacion.data.mensajeInicial ? invitacion.data.mensajeInicial : ''],
      imgIntroRightCheck: [invitacion.data.imgIntroRightCheck ? invitacion.data.imgIntroRightCheck : ''],
      imgIntroRightUp: [invitacion.data.imgIntroRightUp ? invitacion.data.imgIntroRightUp : ''],

      imgIntroLeft: [invitacion.data.imgIntroLeft ? invitacion.data.imgIntroLeft : 'bg7.png'],
      imgIntroRight: [invitacion.data.imgIntroRight ? invitacion.data.imgIntroRight : 'bg6.png'],

      invitacionEfecto: [invitacion.data.invitacionEfecto ? invitacion.data.invitacionEfecto : 'animate__fadeIn'],
      fondoInvitacion: [invitacion.data.fondoInvitacion ? invitacion.data.fondoInvitacion : 'bg1.avif'],
      marcoFoto: [invitacion.data.marcoFoto ? invitacion.data.marcoFoto : ''],
      marcoIndex: [invitacion.data.marcoIndex ? invitacion.data.marcoIndex : ''],
      marcoFotoWidth: [invitacion.data.marcoFotoWidth ? invitacion.data.marcoFotoWidth : 150],
      marcoFotoTop: [invitacion.data.marcoFotoTop ? invitacion.data.marcoFotoTop : 150],
      nombreFont: [invitacion.data.nombreFont ? invitacion.data.nombreFont : 'pacific'],
      nombreEfecto: [invitacion.data.nombreEfecto ? invitacion.data.nombreEfecto : ''],
      nombreEfectoRep: [invitacion.data.nombreEfectoRep ? invitacion.data.nombreEfectoRep : 1],
      tipoFont: [invitacion.data.tipoFont ? invitacion.data.tipoFont : 'pacific'],
      mensajeImgWidth: [invitacion.data.mensajeImgWidth],
      alturaMensaje: [invitacion.data.alturaMensaje],
      cShCab: [invitacion.data.cShCab ? invitacion.data.cShCab : ''],
      cShTexto: [invitacion.data.cShTexto ? invitacion.data.cShTexto : ''],
      nShCab: [invitacion.data.nShCab ? invitacion.data.nShCab : ''],
      nShTexto: [invitacion.data.nShTexto ? invitacion.data.nShTexto : ''],
      cShTit: [invitacion.data.cShTit ? invitacion.data.cShTit : ''],
      nShTit: [invitacion.data.nShTit ? invitacion.data.nShTit : ''],
      cShMensaje: [invitacion.data.cShMensaje ? invitacion.data.cShMensaje : ''],
      nShMensaje: [invitacion.data.nShMensaje ? invitacion.data.nShMensaje : ''],
      cShSubTit: [invitacion.data.cShSubTit ? invitacion.data.cShSubTit : ''],
      nShSubTit: [invitacion.data.nShSubTit ? invitacion.data.nShSubTit : ''],



      mensajeFont: [invitacion.data.mensajeFont ? invitacion.data.mensajeFont : 'pacific'],
      inicialTFont: [invitacion.data.inicialTFont ? invitacion.data.inicialTFont : 'pacific'],
      finalTFont: [invitacion.data.finalTFont ? invitacion.data.finalTFont : 'pacific'],
      inviFont: [invitacion.data.inviFont ? invitacion.data.inviFont : 'pacific'],
      inviFont2: [invitacion.data.inviFont2 ? invitacion.data.inviFont2 : 'pacific'],
      inviEfecto: [invitacion.data.inviEfecto ? invitacion.data.inviEfecto : ''],
      inviEfectoRep: [invitacion.data.inviEfectoRep ? invitacion.data.inviEfectoRep : '1'],
      inicialTSize: [invitacion.data.inicialTSize],
      efectoInvi: [invitacion.data.efectoInvi],
      repEfectoInvi: [invitacion.data.repEfectoInvi],
      finalTSize: [invitacion.data.finalTSize],
      musicaInvitacion: [invitacion.data.musicaInvitacion],










      usuarioCreated: [this.usuarioFiesta],
      activated: [invitacion.data.activated],
      dateCreated: [invitacion.data.dateCreated],
      lastEdited: [this.today],
    })
    if (invitacion.data.byFileUrl && (this.form.value.typeFile == 'video' || this.form.value.typeFile == 'url')) {

      this.viewVideo = true

    }









































    this.loading = false


  }
  data() {



    let res = {
      type: this.typeView,
      size: 'sm',
      byFile: (this.fiesta.invitacion == 'byFile') ? true : false,
      example: this.fiesta.example,
      ...this.form.value
    }


    return res

  }

  getQr() {
    let qr = {
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

    return JSON.stringify(qr)
  }
  getQrGaleria() {
    let url = this.urlT + 'galeria/fst/' + this.fiesta.uid


    return url

  }


  printMe() {



    this.urlLink = this.urlT + 'galeria/fst/' + this.fiesta.uid



    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'print-section',
    });
    customPrintOptions.useExistingCss = true

    this.printService.print(customPrintOptions)

  }




  setTemp(temp) {

    temp.dateCreated = (typeof (temp.dateCreated) == 'number') ? this.functionsService.numberToDate(temp.dateCreated) : temp.dateCreated
    temp.donde1Date = (typeof (temp.donde1Date) == 'number') ? this.functionsService.numberToDate(temp.donde1Date) : temp.donde1Date
    temp.donde2Date = (typeof (temp.donde2Date) == 'number') ? this.functionsService.numberToDate(temp.donde2Date) : temp.donde2Date
    temp.donde3Date = (typeof (temp.donde3Date) == 'number') ? this.functionsService.numberToDate(temp.donde3Date) : temp.donde3Date
    temp.fiestaDate = (typeof (temp.fiestaDate) == 'number') ? this.functionsService.numberToDate(temp.fiestaDate) : temp.fiestaDate
    temp.lastEdited = (typeof (temp.lastEdited) == 'number') ? this.functionsService.numberToDate(temp.lastEdited) : temp.lastEdited
    this.form = this.fb.group({
      checking: [this.fiesta.checking],
      cPrincipal: [temp.cPrincipal],
      cSecond: [temp.cSecond],
      cWhite: [temp.cWhite],
      cTexto: [temp.cTexto],
      img1: [temp.img1],
      iconSize: [temp.iconSize],
      img1Size: [temp.img1Size],
      img1Forma: [temp.img1Forma],
      img1Height: [temp.img1Height],
      img1Rotate: [temp.img1Rotate],
      img1Traslate: [temp.img1Traslate],
      img1Top: [temp.img1Top],
      efectoImg1: [temp.efectoImg1],
      repEfectoImg1: [temp.repEfectoImg1],
      efectoFecha: [temp.efectoFecha],
      repEfectoFecha: [temp.repEfectoFecha],
      efectoInvitacion: [temp.efectoInvitacion],
      repEfectoInvitacion: [temp.repEfectoInvitacion],
      xImg1: [temp.xImg1],
      yImg1: [temp.yImg1],
      imgWidth: [temp.imgWidth],
      topTitle: [temp.topTitle],

      cantidad: [temp.cantidad],
      tipoFiesta: [temp.tipoFiesta],
      tipoSize: [temp.tipoSize],
      tipoTop: [temp.tipoTop],
      tipoEfecto: [temp.tipoEfecto],
      tipoEfectoRep: [temp.tipoEfectoRep],
      topDate: [temp.topDate],

      efectoCount: [temp.efectoCount],
      efectoRepCount: [temp.efectoRepCount],
      typeCount: [temp.typeCount],
      bgCount: [temp.bgCount],
      noBgColor: [temp.noBgColor],
      fiestaDate: [temp.fiestaDate],
      nombreFiesta: [temp.nombreFiesta],
      nombreSize: [temp.nombreSize],
      cabeceraFont: [temp.cabeceraFont],
      textoInvFont: [temp.textoInvFont],
      mensajeAlign: [temp.mensajeAlign],
      textoInvSize: [temp.textoInvSize],
      cabeceraSize: [temp.cabeceraSize],

      cabeceraEfecto: [temp.cabeceraEfecto],
      cabeceraEfectoRep: [temp.cabeceraEfectoRep],

      titleSize: [temp.titleSize],
      textInvitacionValida: [temp.textInvitacionValida],
      mensajeImg: [temp.mensajeImg],
      bxMensajeImg: [temp.bxMensajeImg],
      byMensajeImg: [temp.byMensajeImg],
      mensaje1: [temp.mensaje1],
      mensajeSize: [temp.mensajeSize],
      mensajeEfecto: [temp.mensajeEfecto],
      mensajeEfectoRep: [temp.mensajeEfectoRep],
      donde1Check: [temp.donde1Check],
      donde1Img: [temp.donde1Img],
      galeriaCheck: [temp.galeriaCheck],
      galeriaTitle: [temp.galeriaTitle],
      donde1Title: [temp.donde1Title],
      donde1Titulo: [temp.donde1Titulo],
      donde2Titulo: [temp.donde2Titulo],
      donde3Titulo: [temp.donde3Titulo],
      donde1Text: [temp.donde1Text],
      donde1Date: [temp.donde1Date],
      donde1Icon: [temp.donde1Icon],
      donde1AddressUbicacion: [temp.donde1AddressUbicacion],
      donde1AddressUbicacionLng: [temp.donde1AddressUbicacionLng],
      donde1AddressUbicacionLat: [temp.donde1AddressUbicacionLat],
      donde1Address: [temp.donde1Address],

      donde2Check: [temp.donde2Check],
      donde2Img: [temp.donde2Img],
      donde2Title: [temp.donde2Title],
      donde2Text: [temp.donde2Text],
      donde2Date: [temp.donde2Date],
      donde2Icon: [temp.cPrincipal],
      donde2AddressUbicacion: [temp.donde2AddressUbicacion],
      donde2AddressUbicacionLng: [temp.donde2AddressUbicacionLng],
      donde2AddressUbicacionLat: [temp.donde2AddressUbicacionLat],
      donde2Address: [temp.donde2Address],
      donde3Check: [temp.donde3Check],
      donde3Img: [temp.donde3Img],
      donde3Title: [temp.donde3Title],
      donde3Text: [temp.donde3Text],
      donde3Date: [temp.donde3Date],
      donde3Icon: [temp.donde3Icon],
      donde3AddressUbicacion: [temp.donde3AddressUbicacion],
      donde3AddressUbicacionLng: [temp.donde3AddressUbicacionLng],
      donde3AddressUbicacionLat: [temp.donde3AddressUbicacionLat],
      donde3Address: [temp.donde3Address],
      hospedajeCheck: [temp.hospedajeCheck],
      hospedajeImg: [temp.hospedajeImg],
      galeria1: [temp.galeria1],
      galeria2: [temp.galeria2],
      galeria3: [temp.galeria3],
      galeria4: [temp.galeria4],
      galeria5: [temp.galeria5],
      galeria6: [temp.galeria6],
      hospedajeName: [temp.hospedajeName],
      hospedajeIcon: [temp.hospedajeIcon],
      hospedajeAddress: [temp.hospedajeAddress],
      hospedajeUbicacion: [temp.hospedajeUbicacion],
      hospedajeUbicacionLng: [temp.hospedajeUbicacionLng],
      hospedajeUbicacionLat: [temp.hospedajeUbicacionLat],
      hospedajePhone: [temp.hospedajePhone],
      mesaRegalosCheck: [temp.mesaRegalosCheck],
      confirmacionCheck: [temp.confirmacionCheck],
      recordatorioOk: [temp.recordatorioOk],
      recordatorio: [temp.recordatorio],
      ajusteCheck: [temp.ajusteCheck],
      generalCheck: [temp.generalCheck],
      generalSize: [temp.generalSize],
      generalTexto: [temp.generalTexto],
      startText: [temp.startText],
      endText: [temp.endText],

      dayText: [temp.dayText],
      hourText: [temp.hourText],
      minText: [temp.minText],
      segText: [temp.segText],
      menuTitle: [temp.menuTitle],
      dressTitle: [temp.dressTitle],
      boletoTitle: [temp.boletoTitle],
      boletoText: [temp.boletoText],
      mesaText: [temp.mesaText],
      whereTitle: [temp.whereTitle],
      hospedajeTitle: [temp.hospedajeTitle],
      mesaTitle: [temp.mesaTitle],
      itiTitle: [temp.itiTitle],
      notasTitle: [temp.notasTitle],
      confirmacionTexto: [temp.confirmacionTexto],
      confirmacionBotonTexto: [temp.confirmacionBotonTexto],
      quitarConfirmacionBotonTexto: [temp.quitarConfirmacionBotonTexto],
      sinConfBotonTexto: [temp.sinConfBotonTexto],
      questionConfirm: [temp.questionConfirm],
      galeryTitle: [temp.galeryTitle],
      galeryButtom: [temp.galeryButtom],
      galeryText: [temp.galeryText],

      mesaRegalosLugar: [temp.mesaRegalosLugar],
      mesaRegalosLugar2: [temp.mesaRegalosLugar2],
      mesaRegalosUrl: [temp.mesaRegalosUrl],
      mesaRegalosUrl2: [temp.mesaRegalosUrl2],
      mesaRegalosImg: [temp.mesaRegalosImg],



      efectoImgRight: [temp.efectoImgRight],
      efectoImgLeft: [temp.efectoImgLeft],
      repImgLeft: [temp.repImgLeft],
      repImgRight: [temp.repImgRight],


      imgIntroLeftCheck: [temp.imgIntroLeftCheck],
      fondoInvitacionCheck: [temp.fondoInvitacionCheck],
      fondoInvitacionUp: [temp.fondoInvitacionUp],
      marcoFotoUp: [temp.marcoFotoUp],


      marcoFotoCheck: [temp.marcoFotoCheck],
      bgIntro: [temp.bgIntro],
      fuenteMensajeInicial: [temp.fuenteMensajeInicial],
      efectoMensajeInicial: [temp.efectoMensajeInicial],
      repEfectoMensajeInicial: [temp.repEfectoMensajeInicial],
      colorMensajeInicial: [temp.colorMensajeInicial],
      sizeMensajeInicial: [temp.sizeMensajeInicial],
      tiempoEsperaMensajeInicial: [temp.tiempoEsperaMensajeInicial],




      imgIntroLeftUp: [temp.imgIntroLeftUp],
      imgIntroRightCheck: [temp.imgIntroRightCheck],
      imgIntroRightUp: [temp.imgIntroRightUp],

      marcoSizeSubtitle: [temp.marcoSizeSubtitle],
      marcoSizeTitle: [temp.marcoSizeTitle],
      mensajeInicial: [temp.mensajeInicial],


      imgIntroLeft: [temp.imgIntroLeft],
      imgIntroRight: [temp.imgIntroRight],

      invitacionEfecto: [temp.invitacionEfecto],
      fondoInvitacion: [temp.fondoInvitacion],
      marcoFoto: [temp.marcoFoto],
      marcoIndex: [temp.marcoIndex],
      marcoFotoWidth: [temp.marcoFotoWidth],
      marcoFotoTop: [temp.marcoFotoTop],
      nombreFont: [temp.nombreFont],
      nombreEfecto: [temp.nombreEfecto],
      nombreEfectoRep: [temp.nombreEfectoRep],
      tipoFont: [temp.tipoFont],
      mensajeImgWidth: [temp.mensajeImgWidth],
      alturaMensaje: [temp.alturaMensaje],
      mensajeFont: [temp.mensajeFont],
      nShCab: [temp.nShCab],
      cShCab: [temp.cShCab],
      cShTexto: [temp.cShTexto],
      nShTexto: [temp.nShTexto],
      cShTit: [temp.cShTit],
      nShTit: [temp.nShTit],
      cShMensaje: [temp.cShMensaje],
      nShMensaje: [temp.nShMensaje],
      cShSubTit: [temp.cShSubTit],
      nShSubTit: [temp.nShSubTit],
      inicialTFont: [temp.inicialTFont],
      inicialTSize: [temp.inicialTSize],
      efectoInvi: [temp.efectoInvi],
      repEfectoInvi: [temp.repEfectoInvi],
      finalTSize: [temp.finalTSize],
      musicaInvitacion: [temp.musicaInvitacion],
      isMusic: [temp.isMusic],
      musicRepit: [temp.musicRepit],
      finalTFont: [temp.finalTFont],
      inviFont: [temp.inviFont],
      inviFont2: [temp.inviFont2],
      inviEfecto: [temp.inviEfecto],
      inviEfectoRep: [temp.inviEfectoRep],



      itinerarioCheck: [temp.itinerarioCheck],
      itinerarioBG: [temp.itinerarioBG],
      itinerarioTitle: [temp.itinerarioTitle],
      itinerarioName: [temp.itinerarioName],
      itinerarios: this.fb.array([]),
      notaCheck: [temp.notaCheck],
      notaBG: [temp.notaBG],
      notaTitle: [temp.notaTitle],
      titlePadres: [temp.titlePadres],
      titlePadrinos: [temp.titlePadrinos],
      colorQr: [temp.colorQr],
      colorBgQr: [temp.colorBgQr],
      invitacionTemplate: [temp.invitacionTemplate],
      chambelanes: this.fb.array([]),
      padres: this.fb.array([]),
      padrinos: this.fb.array([]),
      musica: this.fb.array([]),
      menu: this.fb.array([]),
      chambelanesCheck: [temp.data.chambelanesCheck],
      chambelanText: [temp.data.chambelanText],
      chambelanesImgCheck: [temp.data.chambelanesImgCheck],
      padresCheck: [temp.data.padresCheck],

      padrinosCheck: [temp.data.padrinosCheck],
      menuCheck: [temp.data.menuCheck],
      musicaCheck: [temp.data.musicaCheck],
      sobresCheck: [temp.data.sobresCheck],
      sobresTitle: [temp.data.sobresTitle],
      sobresBanco: [temp.data.sobresBanco],
      sobresCuenta: [temp.data.sobresCuenta],
      sobresClabe: [temp.data.sobresClabe],
      sobresFestejadaTitle: [temp.data.sobresFestejadaTitle],
      sobresFestejadaNombre: [temp.data.sobresFestejadaNombre],
      sobresFestejadaMensaje: [temp.data.sobresFestejadaMensaje],
      codigoVestimentaCheck: [temp.data.codigoVestimentaCheck],
      imgQrCheck: [temp.data.imgQrCheck],
      codigoVestimentaHombre: [temp.data.codigoVestimentaHombre],
      codigoVestimentaHombreImg: [temp.data.codigoVestimentaHombreImg],
      codigoVestimentaMujer: [temp.data.codigoVestimentaMujer],
      codigoVestimentaMujerImg: [temp.data.codigoVestimentaMujerImg],



      usuarioCreated: [this.usuarioFiesta],
      activated: [temp.activated],
      dateCreated: [temp.dateCreated],
      lastEdited: [temp.lastEdited],



    })
  }
  async VerTemplate(form) {

    // Cuando no existe registro invitacion  se tiene que crear la invitacion
    if (!this.invitacion) {
      this.loading = true
      let data = {
        ...form.value,
        mesaOk: this.fiesta.mesaOk,
        fiestaId: this.fiesta.uid,
      }
      let invitacion = {
        fiesta: this.fiesta.uid,
        data: data,
        tipoTemplate: this.fiesta.invitacion,
        templateActivated: true,
        usuarioCreated: this.usuarioFiesta,
        activated: true,
        lastEdited: this.today,
        dateCreated: this.today
      }
      this.invitacion.data.donde3Img = this.fiesta.salon.img
      this.invitacion.data.byFile = (this.fiesta.invitacion == 'byFile') ? true : false
      this.crearInvitacion((invitacion)).subscribe((resp: any) => {
        this.invitacion = resp.invitacion
        this.invitacion.data.fiestaId = this.fiesta.uid
        let iti = JSON.stringify(form.value.itinerarios)
        let not = JSON.stringify(form.value.notas)
        let cham = JSON.stringify(form.value.cham)
        let padres = JSON.stringify(form.value.padres)
        let padrinos = JSON.stringify(form.value.padrinos)
        let musica = JSON.stringify(form.value.musica)
        let menu = JSON.stringify(form.value.menu)
        this.invitacion.data = {
          ...  this.invitacion.data,
          itinerarios: iti,
          notas: not,
          chambelanes: cham,
          padres: padres,
          padrinos: padrinos,
          musica: musica,
          menu: menu,
        }


      })
    } else {
      this.form.value.donde3Img = this.fiesta.salon.img
      this.invitacion.data = {
        ...this.invitacion.data,
        byFile: (this.fiesta.invitacion == 'byFile') ? true : false,
        ...form.value
      }
      this.invitacion = {
        ...this.invitacion,
        mesaOk: this.fiesta.mesaOk,
        fiestaId: this.fiesta.uid,
        usuarioCreated: this.usuarioFiesta,
        lastEdited: this.today
      }
      this.invitacion.data.donde3Img = this.fiesta.salon.img



      this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
        this.invitacion = resp.invitacionActualizado


        this.invitacion.data.fiestaId = this.fiesta.uid
        let iti = JSON.stringify(form.value.itinerarios)
        let not = JSON.stringify(form.value.notas)
        let cham = JSON.stringify(form.value.cham)
        let padres = JSON.stringify(form.value.padres)
        let padrinos = JSON.stringify(form.value.padrinos)
        let musica = JSON.stringify(form.value.musica)
        let menu = JSON.stringify(form.value.menu)

        this.invitacion.data = {
          ...  this.invitacion.data,
          itinerarios: iti,
          notas: not,
          chambelanes: cham,
          padres: padres,
          padrinos: padrinos,
          musica: musica,
          menu: menu,
        }
      })
    }



    this.invitacion.data.itinerarios = JSON.stringify(this.invitacion.data.itinerarios)
    this.invitacion.data.notas = JSON.stringify(this.invitacion.data.notas)
    this.invitacion.data.chambelanes = JSON.stringify(this.invitacion.data.chambelanes)
    this.invitacion.data.padres = JSON.stringify(this.invitacion.data.padres)
    this.invitacion.data.padrinos = JSON.stringify(this.invitacion.data.padrinos)
    this.invitacion.data.musica = JSON.stringify(this.invitacion.data.musica)
    this.invitacion.data.menu = JSON.stringify(this.invitacion.data.menu)
    this.invitacion.data.croquisOk = this.fiesta.croquisOk
    this.invitacion.data.croquis = this.fiesta.croquis
    this.invitacion.data.fiestaId = this.fiesta.uid
    this.invitacion.data.byFile = (this.fiesta.invitacion == 'byFile') ? true : false
    if (this.invitacion.data.generalCheck) {
      this.invitacion.data.cantidad = 0
    } else {
      this.invitacion.data.cantidad = 4

    }
    let fiesta = JSON.stringify(this.fiesta)

    this.invitacion.data = {
      ...this.invitacion.data,
      fiesta: fiesta
    }


    this.router.navigate(['/templates/' + this.fiesta.invitacion], { queryParams: this.invitacion.data })

  }
  async onSubmit() {




    this.loading = true


    if (this.invitacion) {


      if (this.form.value.img1 == '' && this.invitacion.data.img1 !== '') {
        this.form.value.img1 = this.invitacion.data.img1
      }



      if (this.form.value.efectoImg1 == '' && this.invitacion.data.efectoImg1 !== '') {
        this.form.value.efectoImg1 = this.invitacion.data.efectoImg1
      }
      if (this.form.value.repEfectoImg1 == '' && this.invitacion.data.repEfectoImg1 !== '') {
        this.form.value.repEfectoImg1 = this.invitacion.data.repEfectoImg1
      }
      if (this.form.value.efectoFecha == '' && this.invitacion.data.efectoFecha !== '') {
        this.form.value.efectoFecha = this.invitacion.data.efectoFecha
      }
      if (this.form.value.repEfectoFecha == '' && this.invitacion.data.repEfectoFecha !== '') {
        this.form.value.repEfectoFecha = this.invitacion.data.repEfectoFecha
      }
      if (this.form.value.efectoInvitacion == '' && this.invitacion.data.efectoInvitacion !== '') {
        this.form.value.efectoInvitacion = this.invitacion.data.efectoInvitacion
      }
      if (this.form.value.repEfectoInvitacion == '' && this.invitacion.data.repEfectoInvitacion !== '') {
        this.form.value.repEfectoInvitacion = this.invitacion.data.repEfectoInvitacion
      }
      if (this.form.value.mensajeImg == '' && this.invitacion.data.mensajeImg !== '') {
        this.form.value.mensajeImg = this.invitacion.data.mensajeImg
      }
      if (this.form.value.donde1Img == '' && this.invitacion.data.donde1Img !== '') {
        this.form.value.donde1Img = this.invitacion.data.donde1Img
      }
      if (this.form.value.donde2Img == '' && this.invitacion.data.donde2Img !== '') {
        this.form.value.donde2Img = this.invitacion.data.donde2Img
      }
      if (this.form.value.donde3Img == '' && this.invitacion.data.donde3Img !== '') {
        this.form.value.donde3Img = this.invitacion.data.donde3Img
      }
      if (this.form.value.hospedajeImg == '' && this.invitacion.data.hospedajeImg !== '') {
        this.form.value.hospedajeImg = this.invitacion.data.hospedajeImg
      }
      if (this.form.value.galeria1 == '' && this.invitacion.data.galeria1 !== '') {
        this.form.value.galeria1 = this.invitacion.data.galeria1
      }
      if (this.form.value.galeria2 == '' && this.invitacion.data.galeria2 !== '') {
        this.form.value.galeria2 = this.invitacion.data.galeria2
      }
      if (this.form.value.galeria3 == '' && this.invitacion.data.galeria3 !== '') {
        this.form.value.galeria3 = this.invitacion.data.galeria3
      }
      if (this.form.value.galeria4 == '' && this.invitacion.data.galeria4 !== '') {
        this.form.value.galeria4 = this.invitacion.data.galeria4
      }
      if (this.form.value.galeria5 == '' && this.invitacion.data.galeria5 !== '') {
        this.form.value.galeria5 = this.invitacion.data.galeria5
      }
      if (this.form.value.galeria6 == '' && this.invitacion.data.galeria6 !== '') {
        this.form.value.galeria6 = this.invitacion.data.galeria6
      }
      if (this.form.value.byFileInvitacion == '' && this.invitacion.data.byFileInvitacion !== '') {
        this.form.value.byFileInvitacion = this.invitacion.data.byFileInvitacion
      }
      if (this.form.value.bgIntro == '' && this.invitacion.data.bgIntro !== '') {
        this.form.value.bgIntro = this.invitacion.data.bgIntro
      }
      if (this.form.value.fuenteMensajeInicial == '' && this.invitacion.data.fuenteMensajeInicial !== '') {
        this.form.value.fuenteMensajeInicial = this.invitacion.data.fuenteMensajeInicial
      }
      if (this.form.value.efectoMensajeInicial == '' && this.invitacion.data.efectoMensajeInicial !== '') {
        this.form.value.efectoMensajeInicial = this.invitacion.data.efectoMensajeInicial
      }
      if (this.form.value.repEfectoMensajeInicial == '' && this.invitacion.data.repEfectoMensajeInicial !== '') {
        this.form.value.repEfectoMensajeInicial = this.invitacion.data.repEfectoMensajeInicial
      }
      if (this.form.value.colorMensajeInicial == '' && this.invitacion.data.colorMensajeInicial !== '') {
        this.form.value.colorMensajeInicial = this.invitacion.data.colorMensajeInicial
      }
      if (this.form.value.sizeMensajeInicial == '' && this.invitacion.data.sizeMensajeInicial !== '') {
        this.form.value.sizeMensajeInicial = this.invitacion.data.sizeMensajeInicial
      }
      if (this.form.value.tiempoEsperaMensajeInicial == '' && this.invitacion.data.tiempoEsperaMensajeInicial !== '') {
        this.form.value.tiempoEsperaMensajeInicial = this.invitacion.data.tiempoEsperaMensajeInicial
      }
      if (this.form.value.imgIntroLeftUp == '' && this.invitacion.data.imgIntroLeftUp !== '') {
        this.form.value.imgIntroLeftUp = this.invitacion.data.imgIntroLeftUp
      }


      if (this.form.value.marcoSizeSubtitle == '' && this.invitacion.data.marcoSizeSubtitle !== '') {
        this.form.value.marcoSizeSubtitle = this.invitacion.data.marcoSizeSubtitle
      }
      if (this.form.value.marcoSizeTitle == '' && this.invitacion.data.marcoSizeTitle !== '') {
        this.form.value.marcoSizeTitle = this.invitacion.data.marcoSizeTitle
      }
      if (this.form.value.mensajeInicial == '' && this.invitacion.data.mensajeInicial !== '') {
        this.form.value.mensajeInicial = this.invitacion.data.mensajeInicial
      }
      if (this.form.value.imgIntroRightUp == '' && this.invitacion.data.imgIntroRightUp !== '') {
        this.form.value.imgIntroRightUp = this.invitacion.data.imgIntroRightUp
      }
      if (this.form.value.fondoInvitacionUp == '' && this.invitacion.data.fondoInvitacionUp !== '') {
        this.form.value.fondoInvitacionUp = this.invitacion.data.fondoInvitacionUp
      }
      if (this.form.value.marcoFotoUp == '' && this.invitacion.data.marcoFotoUp !== '') {
        this.form.value.marcoFotoUp = this.invitacion.data.marcoFotoUp
      }



      let data = await this.numberToData(this.form.value)

      this.invitacion.data = (data)


      this.invitacion.usuarioFiesta = (this.fiesta.usuarioFiesta._id) ? this.fiesta.usuarioFiesta._id : this.fiesta.usuarioFiesta.uid
      this.invitacion.usuarioCreated = this.usuarioFiesta
      setTimeout(() => {

        this.actualizarInvitacion(this.invitacion).subscribe((res: any) => {
          this.invitacion = res.invitacionActualizado

          this.functionsService.alertUpdate('Invitación')
          if (this.rol != this.URS) {
            this.functionsService.navigateTo('fiestas/vista-fiestas')
          } else {
            this.functionsService.navigateTo('mis-fiestas')
          }
        })
      }, 500);
    } else {


      let dataT = await this.dateToNumber(this.form.value)
      dataT.mesaOK = this.fiesta.mesaOk

      var invitado = {
        tipoTemplate: this.fiesta.invitacion,
        templateActivated: true,
        data: dataT,
        usuarioFiesta: (this.fiesta.usuarioFiesta._id) ? this.fiesta.usuarioFiesta._id : this.fiesta.usuarioFiesta.uid,
        fiesta: (this.fiesta._id) ? this.fiesta._id : this.fiesta.uid,
        usuarioCreated: this.usuarioFiesta,
        activated: true,
        dateCreated: this.today,
        lastEdited: this.today
      }


      setTimeout(() => {

        this.crearInvitacion(invitado).subscribe((res: CargarInvitacion) => {
          this.invitacion = res.invitacion

          this.functionsService.alertUpdate('Invitación')
          this.functionsService.navigateTo('fiestas/vista-fiestas')
        })
      }, 500);
    }
  }
  back() {
    if (this.rol == this.ADM || this.rol == this.SLN || this.rol == this.ANF) {
      this.functionsService.navigateTo('fiestas/vista-fiestas')
    } else {
      this.functionsService.navigateTo('mis-fiestas')
    }
  }
  get itinerarios(): FormArray {
    return this.form.get("itinerarios") as FormArray
  }
  get notas(): FormArray {
    return this.form.get("notas") as FormArray
  }
  get chambelanes(): FormArray {
    return this.form.get("chambelanes") as FormArray
  }
  get padres(): FormArray {
    return this.form.get("padres") as FormArray
  }
  get padrinos(): FormArray {
    return this.form.get("padrinos") as FormArray
  }
  get musica(): FormArray {
    return this.form.get("musica") as FormArray
  }
  get menu(): FormArray {
    return this.form.get("menu") as FormArray
  }
  async dateToNumber(data) {
    data.dateCreated = (typeof (data.dateCreated) == 'string') ? this.functionsService.dateToNumber(data.dateCreated) : data.dateCreated
    data.lastEdited = (data.lastEdited != undefined) ? (typeof (data.lastEdited) == 'string') ? this.functionsService.dateToNumber(data.lastEdited) : data.lastEdited : ''
    data.donde1Date = (typeof (data.donde1Date) == 'string') ? this.functionsService.dateToNumber(data.donde1Date) : data.donde1Date
    data.donde2Date = (typeof (data.donde2Date) == 'string') ? this.functionsService.dateToNumber(data.donde2Date) : data.donde2Date
    data.donde3Date = (typeof (data.donde3Date) == 'string') ? this.functionsService.dateToNumber(data.donde3Date) : data.donde3Date
    data.donde1Check = (data.donde1Check == 'true' || data.donde1Check == true) ? true : false
    data.galeriaCheck = (data.galeriaCheck == 'true' || data.galeriaCheck == true) ? true : false
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false
    data.notaCheck = (data.notaCheck == 'true' || data.notaCheck == true) ? true : false
    data.itinerarioCheck = (data.itinerarioCheck == 'true' || data.itinerarioCheck == true) ? true : false
    data.chambelanesImgCheck = (data.chambelanesImgCheck == 'true' || data.chambelanesImgCheck == true) ? true : false
    data.chambelanesCheck = (data.chambelanesCheck == 'true' || data.chambelanesCheck == true) ? true : false

    data.padresCheck = (data.padresCheck == 'true' || data.padresCheck == true) ? true : false

    data.padrinosCheck = (data.padrinosCheck == 'true' || data.padrinosCheck == true) ? true : false
    data.menuCheck = (data.menuCheck == 'true' || data.menuCheck == true) ? true : false
    data.musicaCheck = (data.musicaCheck == 'true' || data.musicaCheck == true) ? true : false
    data.sobresCheck = (data.sobresCheck == 'true' || data.sobresCheck == true) ? true : false
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
    data.galeriaCheck = (data.galeriaCheck == 'true' || data.galeriaCheck == true) ? true : false
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false

    return await data
  }

  getInvitacion(id) {
    this.loading = true
    this.invitacionsService.cargarInvitacionByFiesta(id).subscribe(async resp => {


      this.invitacion = resp.invitacion


      if (!this.invitacion) {
        setTimeout(() => {
          let data = {
            cPrincipal: '#ffc0cb',
            cSecond: '#c0354e',
            cWhite: '#ffffff',
            cTexto: '#000',
            img1: '',
            img1Size: '',
            img1Forma: '',
            iconSize: 50,
            img1Height: '',
            img1Rotate: '',
            img1Traslate: '',
            img1Top: 50,
            efectoImg1: 'animate__fadeIn',
            repEfectoImg1: 'animate__repeat-1',
            efectoFecha: 'animate__fadeIn',
            repEfectoFecha: 'animate__repeat-1',
            efectoInvitacion: 'animate__fadeIn',
            repEfectoInvitacion: 'animate__repeat-1',
            xImg1: 50,
            yImg1: 10,
            imgWidth: 100,
            topTitle: 40,
            cantidad: this.fiesta.cantidad,
            tipoFiesta: '',
            tipoSize: 90,
            tipoTop: 90,
            tipoEfecto: '',
            tipoEfectoRep: 1,
            nombreSize: 20,

            cabeceraSize: 20,
            cabeceraEfecto: '',
            cabeceraEfectoRep: '',
            cabeceraFont: 'pacific',
            textoInvFont: 'pacific',
            textoInvSize: 20,
            mensajeAlign: 'center',
            titleSize: 20,
            topDate: 50,
            efectoCount: '',
            efectoRepCount: '',
            typeCount: '',
            bgCount: '',
            noBgColor: '',
            checking: this.fiesta.checking,
            fiestaDate: Number(this.fiesta.fecha),
            nombreFiesta: '',
            nombresSize: 18,
            textInvitacionValida: '¡Los esperamos!',
            mensajeCheck: true,
            mensajeImg: '',
            bxMensajeImg: 50,
            byMensajeImg: 0,
            mensaje1: '',
            mensajeSize: 25,
            mensajeEfecto: '',
            mensajeEfectoRep: 1,
            donde1Check: true,
            donde1Img: '',
            galeriaCheck: false,
            galeriaTitle: 'Momentos',
            donde1Title: 'Iglesia',
            donde1Titulo: '',
            donde2Titulo: '',
            donde3Titulo: '',
            donde1Text: '',
            donde1Date: (typeof (this.fiesta.fecha) == "string") ? this.functionsService.dateToNumber(this.fiesta.fecha) : this.fiesta.fecha,
            donde1Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
            donde1AddressUbicacion: '',
            donde1AddressUbicacionLng: '',
            donde1AddressUbicacionLat: '',
            donde1Address: '',

            donde2Check: true,
            donde2Img: '',
            donde2Title: 'Civil',
            donde2Text: '',
            donde2Date: (typeof (this.fiesta.fecha) == "number") ? this.functionsService.dateToNumber(this.fiesta.fecha) : this.fiesta.fecha,
            donde2Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
            donde2AddressUbicacion: '',
            donde2AddressUbicacionLng: '',
            donde2AddressUbicacionLat: '',
            donde2Address: '',
            donde3Check: true,
            donde3Img: this.fiesta.salon.img,
            donde3Title: 'Lugar del evento',
            donde3Text: this.fiesta.salon.nombre,
            donde3Date: (typeof (this.fiesta.fecha) == "number") ? this.functionsService.dateToNumber(this.fiesta.fecha) : this.fiesta.fecha,
            donde3Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
            donde3AddressUbicacion: this.fiesta.salon.ubicacionGoogle,
            donde3AddressUbicacionlng: this.fiesta.salon.lng,
            donde3AddressUbicacionLat: this.fiesta.salon.lat,
            donde3Address:
              this.fiesta.salon.calle + ' ' + this.fiesta.salon.numeroExt + ' ' +
              this.fiesta.salon.numeroInt + ' ' + this.fiesta.salon.coloniaBarrio + ' ' +
              this.fiesta.salon.cp + ' ' + this.fiesta.salon.cp + ' ' + this.fiesta.salon.estado + ' ' + this.fiesta.salon.pais
            ,
            hospedajeCheck: true,
            galeria1: '',
            galeria2: '',
            galeria3: '',
            galeria4: '',
            galeria5: '',
            galeria6: '',
            hospedajeImg: '',
            hospedajeName: '',
            hospedajeIcon: 'mt-2 mb-2 text-center  bi-info-circle pointer',
            hospedajeAddress: '',
            hospedajeUbicacion: '',
            hospedajeUbicacionLng: '',
            hospedajeUbicacionLat: '',
            hospedajePhone: '',
            mesaRegalosCheck: true,
            confirmacionCheck: true,
            recordatorioOk: [true],
            recordatorio: [''],
            ajusteCheck: true,
            generalCheck: true,
            generalSize: 15,
            generalTexto: '',
            startText: '',
            whereTitle: '',
            hospedajeTitle: '',
            mesaTitle: '',
            itiTitle: '',
            notasTitle: '',
            confirmacionTexto: '',
            confirmacionBotonTexto: '',
            quitarConfirmacionBotonTexto: '',
            sinConfBotonTexto: '',
            questionConfirm: '',
            galeryTitle: '',
            galeryButtom: '',
            galeryText: '',
            endText: '',
            dayText: '',
            hourText: '',
            minText: '',
            segText: '',
            menuTitle: '',
            dressTitle: '',
            boletoTitle: '',
            boletotext: '',
            mesaText: '',
            mesaRegalosLugar: '',
            mesaRegalosLugar2: '',
            mesaRegalosUrl: '',
            mesaRegalosUrl2: '',
            mesaRegalosImg: '',
            itinerarioCheck: true,
            itinerarioBG: '#fff',
            itinerarioTitle: 'Itinerario',
            itinerarioName: this.fiesta.nombre,
            itinerarios: [],
            notaCheck: true,
            notaBG: '#fff',
            notaTitle: 'Notas',
            titlePadres: 'Mis Padres',
            titlePadrinos: 'Mis Padrinos',
            invitacionTemplate: false,
            notas: [],
            chambelanesCheck: true,
            chambelanText: 'Chambelanes',
            chambelanesImgCheck: true,
            padresCheck: true,

            padrinosCheck: true,
            menuCheck: true,
            musicaCheck: true,
            sobresCheck: true,
            sobresTitle: 'Sumar Kilómetros a mi Viaje',
            sobresBanco: 'Bancomer',
            sobresCuenta: '000 000 000',
            sobresClabe: '000 000 000',
            sobresFestejadaTitle: 'Datos de cuenta para Viaje Mariana',
            sobresFestejadaNombre: 'Mariana Lopez',
            sobresFestejadaMensaje: 'O con la tradicional lluvia de sobres. Es la tradición de regalar dinero en efectivo a la Quinceañera en un sobre el día del evento.',
            chambelanes: [],
            padres: [],
            padrinos: [],
            menu: [],
            musica: [],
            colorQr: '#ffffff',
            colorBgQr: '#c0354e',
            usuarioCreated: this.usuarioFiesta,
            activated: true,
            dateCreated: this.today,
            lastEdited: this.today,
            repImgLeft: '',
            repImgRight: '',

            efectoImgRight: '',
            efectoImgLeft: '',

            imgIntroLeftCheck: '',
            fondoInvitacionCheck: false,
            marcoFotoCheck: '',
            bgIntro: '',
            fuenteMensajeInicial: '',
            efectoMensajeInicial: '',
            repEfectoMensajeInicial: '',
            colorMensajeInicial: '',
            sizeMensajeInicial: '',
            tiempoEsperaMensajeInicial: '',

            imgIntroLeftUp: '',
            marcoSizeSubti: 15,
            marcoSizeTitle: 15,
            mensajeInicial: 'Ve tu invitación',
            imgIntroRightCheck: '',
            imgIntroRightUp: '',
            fondoInvitacionUp: '',
            marcoFotoUp: '',

            imgIntroLeft: 'bg7.png',
            imgIntroRight: 'bg6.png',

            invitacionEfecto: 'animate__fadeIn',
            fondoInvitacion: 'bg1.avif',
            marcoFoto: "",
            marcoIndex: "",

            marcoFotoWidth: 150,
            marcoFotoTop: 150,
            nombreFont: "pacific",
            nombreEfecto: "",
            nombreEfectoRep: 1,
            tipoFont: "pacific",
            mensajeImgWidth: 100,
            alturaMensaje: 25,
            cShCab: "",
            nShCab: "",
            cShTexto: "",
            nShTexto: "",
            cShTit: "",
            nShTit: "",
            cShMensaje: "",
            nShMensaje: "",
            cShSubTit: "",
            nShSubTit: "",
            mensajeFont: "pacific",
            inicialTFont: 'pacific',
            inicialTSize: 10,
            efectoInvi: '',
            repEfectoInvi: '',
            finalTSize: 10,
            musicaInvitacion: '',
            isMusic: '',
            musicRepit: '',
            finalTFont: 'pacific',
            inviFont: 'pacific',
            inviFont2: 'pacific',
            inviEfecto: '',
            inviEfectoRep: '1',
            typeFile: '',
            repitVideo: false,
            byFileColorTx: '',
            byFileColorBG: '',
            byFileColorFr: '',
            byFileColorQr: '',
            byFileInvitacionType: '',
            byFileInvitacion: '',
            byFileUrl: '',
            byFileWidth: '',
            byFileHeight: '',
            byFileFrame: '',
            byFileFrameWidth: '',
            fiestaId: this.fiesta.uid,
          }
          let invitacion = {
            fiesta: this.fiesta.uid,
            data: data,
            tipoTemplate: this.fiesta.invitacion,
            templateActivated: true,
            usuarioFiesta: this.fiesta.usuarioFiesta._id,
            usuarioCreated: this.usuarioFiesta,
            activated: true,
            lastEdited: this.today,
            dateCreated: this.today
          }
          this.crearInvitacion((invitacion)).subscribe((resp: any) => {
            this.invitacion = resp.invitacion
            this.invitacion.data.fiestaId = this.fiesta.uid
            let iti = JSON.stringify([])
            let not = JSON.stringify([])
            let cham = JSON.stringify([])
            let padres = JSON.stringify([])
            let padrinos = JSON.stringify([])
            let musica = JSON.stringify([])
            let menu = JSON.stringify([])
            this.invitacion.data = {
              ...  this.invitacion.data,
              itinerarios: iti,
              notas: not,
              chambelanes: cham,
              padres: padres,
              padrinos: padrinos,
              menu: musica,
              musica: menu,
            }
            this.setForm(resp.invitacion)
          })
          this.loading = false
        }, 800);
      } else {
        this.invitacion.data = await this.numberToData(this.invitacion.data)
        this.usuarioCreated = this.usuarioFiesta



        this.setFormWithData(this.invitacion)
        this.getExamples()
        setTimeout(() => {
          if (this.invitacion.data.itinerarios && this.invitacion.data.itinerarios.length > 0) {
            this.invitacion.data.itinerarios.forEach(iti => {
              this.itinerarios.push(this.newItinerario(iti));
            });
          }
          if (this.invitacion.data.notas && this.invitacion.data.notas.length > 0) {
            this.invitacion.data.notas.forEach(not => {
              this.notas.push(this.newNota(not));
            });
          }
          if (this.invitacion.data.chambelanes && this.invitacion.data.chambelanes.length > 0) {
            this.invitacion.data.chambelanes.forEach(cham => {
              this.chambelanes.push(this.newChambelan(cham));
            });
          }
          if (this.invitacion.data.padres && this.invitacion.data.padres.length > 0) {
            this.invitacion.data.padres.forEach(pad => {
              this.padres.push(this.newPadre(pad));
            });
          }
          if (this.invitacion.data.padrinos && this.invitacion.data.padrinos.length > 0) {
            this.invitacion.data.padrinos.forEach(padri => {

              this.padrinos.push(this.newPadrino(padri));
            });
          }
          if (this.invitacion.data.menu && this.invitacion.data.menu.length > 0) {
            this.invitacion.data.menu.forEach(men => {
              this.menu.push(this.newMenu(men));
            });
          }
          if (this.invitacion.data.musica && this.invitacion.data.musica.length > 0) {
            this.invitacion.data.musica.forEach(mus => {
              this.musica.push(this.newMusica(mus));
            });
          }
          this.loading = false
        }, 800);

      }
    },
      (error) => {
        // console.error('Error', error)
        this.functionsService.alertError(error, 'Invitacion')
      })
  }
  newItinerario(itinerario?): FormGroup {
    if (itinerario) {
      return this.fb.group({
        name: itinerario.name,
        hr: itinerario.hr,
        icon: itinerario.icon
      })
    } else {
      return this.fb.group({
        name: '',
        hr: '',
      })
    }
  }
  newChambelan(chambelan?): FormGroup {
    if (chambelan) {
      return this.fb.group({
        name: chambelan.name,
        hr: chambelan.hr,
        img: chambelan.img,
      })
    } else {
      return this.fb.group({
        name: '',
        hr: '',
        img: '',
      })
    }
  }
  newPadre(padre?): FormGroup {
    if (padre) {
      return this.fb.group({
        name: padre.name,
        tipo: padre.tipo,
      })
    } else {
      return this.fb.group({
        name: '',
        tipo: '',
      })
    }
  }
  newPadrino(padrino?): FormGroup {
    if (padrino) {
      return this.fb.group({
        name: padrino.name,
        name2: padrino.name2,
        icon: padrino.icon,
        tipo: padrino.tipo
      })
    } else {
      return this.fb.group({
        name: '',
        name2: '',
        icon: '',
        tipo: ''
      })
    }
  }
  newMenu(menu?): FormGroup {
    if (menu) {
      return this.fb.group({
        tipo: menu.tipo,
        name: menu.name,
        icon: menu.icon,
      })
    } else {
      return this.fb.group({
        tipo: '',
        name: '',
        icon: '',
      })
    }
  }
  newMusica(musica?): FormGroup {
    if (musica) {
      return this.fb.group({
        name: musica.name
      })
    } else {
      return this.fb.group({
        name: ''
      })
    }
  }
  newNota(nota?): FormGroup {
    if (nota) {
      return this.fb.group({
        texto: nota.texto
      })
    } else {
      return this.fb.group({
        texto: ''
      })
    }
  }
  addItinerarios(tp) {
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    this.itinerarios.push(this.newItinerario());
    let index = 'itinerario' + typeP + (Number(this.itinerarios.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);


  }
  addNotas(tp) {
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    this.notas.push(this.newNota());
    let index = 'nota' + typeP + (Number(this.notas.length) - 1)
    setTimeout(() => {
      this.functionsService.scroolTo(index)
      this.submited = false
    }, 500);
  }
  addChambelan(tp) {
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    this.chambelanes.push(this.newChambelan());
    let index = 'chambelan' + typeP + (Number(this.chambelanes.length) - 1)

    setTimeout(() => {
      this.functionsService.scroolTo(index)
    }, 500);
  }
  addPadres(tp) {
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    this.padres.push(this.newPadre());
    let index = 'padre' + typeP + (Number(this.padres.length) - 1)

    setTimeout(() => {
      this.functionsService.scroolTo(index)
    }, 500);
  }
  addPadrinos(tp) {
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    this.padrinos.push(this.newPadrino());
    let index = 'padrino' + typeP + (Number(this.padrinos.length) - 1)

    setTimeout(() => {
      this.functionsService.scroolTo(index)
    }, 500);
  }
  addMenus(tp) {
    this.menu.push(this.newMenu());
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    let index = 'menu' + typeP + (Number(this.menu.length) - 1)

    setTimeout(() => {
      this.functionsService.scroolTo(index)
    }, 500);
  }
  addMusica(tp) {
    this.menu.push(this.newMenu());
    var typeP = ''
    if (tp == 'd') {
      typeP = 'Default'
    } else {
      typeP = 'File'

    }
    this.musica.push(this.newMusica());
    let index = 'musica' + typeP + (Number(this.musica.length) - 1)

    setTimeout(() => {
      this.functionsService.scroolTo(index)
    }, 500);
  }
  removeItinerario(i: number) {
    this.itinerarios.removeAt(i);
  }
  removeNota(i: number) {
    this.notas.removeAt(i);
  }
  removeChambelan(i: number) {
    this.chambelanes.removeAt(i);
  }
  removePadre(i: number) {
    this.padres.removeAt(i);
  }
  removePadrino(i: number) {
    this.padrinos.removeAt(i);
  }
  removeMenu(i: number) {
    this.menu.removeAt(i);
  }
  removeMusica(i: number) {
    this.musica.removeAt(i);
  }
  selectType(type) {
    if (type == 'url') {
      this.viewVideo = true
    } else {
      this.viewVideo = false
    }
  }
  cambiarImagen(file: any, type: string, id?) {



    if (id) {
      id = id.replace('chambelanImg', '')
      id = Number(id)


    }
    this.viewVideo = false
    if (file.target.files) {
      this.imagenSubir = file.target.files[0]
      if (!file.target.files[0]) {
        this.imgTemp = null
        this.functionsService.alertError(this.imgTemp, 'No trae imagen')
        return
      } else {
        const reader = new FileReader()
        const url64 = reader.readAsDataURL(file.target.files[0])
        reader.onloadend = () => {
          this.imgTemp = reader.result

        }
        this.subirImagen(type, id)
      }
    } else {
      this.viewVideo = true
    }
  }
  cargarMusica(file: any) {

    if (file.target.files) {
      this.soundSubir = file.target.files[0]
      if (!file.target.files[0]) {
        this.soundTemp = null
        this.functionsService.alertError(this.soundTemp, 'No trae música')
        return
      } else {
        const reader = new FileReader()
        const url64 = reader.readAsDataURL(file.target.files[0])
        reader.onloadend = () => {
          this.soundTemp = reader.result
        }
        this.subirMusica()
      }
    } else {
      this.viewVideo = true
    }
  }
  async subirImagen(type, id?) {

    if (!this.invitacion) {
      let data = await this.dateToNumber(this.form.value)
      data[type] = ''
      let invi = {
        fiesta: this.fiesta.uid,
        data: data,
        tipoTemplate: this.fiesta.invitacion,
        templateActivated: false,
        usuarioFiesta: (this.fiesta.usuarioFiesta._id) ? this.fiesta.usuarioFiesta._id : this.fiesta.usuarioFiesta.uid,
        usuarioCreated: this.usuarioFiesta,
        activated: true,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.invitacionsService.crearInvitacion(invi).subscribe((resp: any) => {
        this.invitacion = resp.invitacion
        this.fileService.actualizarFotoTemplate(this.imagenSubir, 'invitaciones', this.invitacion.fiesta, type)
          .then(
            (img) => {
              let dt = this.form.value
              this.invitacion = {
                ...this.invitacion,
                data: dt
              }
              this.invitacion.data[type] = img
              this.loading = true
              setTimeout(() => {
                this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
                  this.invitacion = resp.invitacionActualizado

                  this.getInvitacion(this.id)

                })
              }, 800);
            },
            (err) => {
              // console.error('Error', err)
              this.functionsService.alertError(err, 'Error')
            },
          )
      })
    } else {
      this.fileService.actualizarFotoTemplate(this.imagenSubir, 'invitaciones', this.fiesta.uid, type)
        .then(
          (img) => {

            let dt = this.form.value
            this.invitacion = {
              ...this.invitacion,
              data: dt
            }
            switch (type) {
              case 'img1':
                this.invitacion.data.img1 = img
                break;
              case 'mensajeImg':
                this.invitacion.data.mensajeImg = img
                break;
              case 'donde1Img':
                this.invitacion.data.donde1Img = img
                break;
              case 'donde2Img':
                this.invitacion.data.donde2Img = img
                break;
              case 'donde3Img':
                this.invitacion.data.donde3Img = img
                break;
              case 'galeria1':
                this.invitacion.data.galeria1 = img
                break;
              case 'galeria2':
                this.invitacion.data.galeria2 = img
                break;
              case 'galeria3':
                this.invitacion.data.galeria3 = img
                break;
              case 'galeria4':
                this.invitacion.data.galeria4 = img
                break;
              case 'galeria5':
                this.invitacion.data.galeria5 = img
                break;
              case 'galeria6':
                this.invitacion.data.galeria6 = img
                break;
              case 'hospedajeImg':
                this.invitacion.data.hospedajeImg = img
                break;
              case 'byFileInvitacion':
                this.invitacion.data.byFileInvitacion = img
                break;
              case 'mesaRegalosImg':
                this.invitacion.data.mesaRegalosImg = img
                break;
              case 'codigoVestimentaMujerImg':
                this.invitacion.data.codigoVestimentaMujerImg = img
                break;
              case 'codigoVestimentaHombreImg':
                this.invitacion.data.codigoVestimentaHombreImg = img
                break;
              case 'bgIntro':
                this.invitacion.data.bgIntro = img
                break;
              case 'imgIntroLeftUp':
                this.invitacion.data.imgIntroLeftUp = img
                break;
              case 'imgIntroRightUp':
                this.invitacion.data.imgIntroRightUp = img
                break;
              case 'fondoInvitacionUp':
                this.invitacion.data.fondoInvitacionUp = img
                break;
              case 'marcoFotoUp':
                this.invitacion.data.marcoFotoUp = img
                break;
              case 'img':
                this.invitacion.data.chambelanes[id].img = img
                break;

            }
            this.invitacion.fiesta = this.fiesta.uid
            this.invitacion.usuarioCreated = this.usuarioFiesta
            setTimeout(() => {
              this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
                this.invitacion = resp.invitacionActualizado
                this.getInvitacion(this.id)
              })
              this.loading = false
              return
            }, 800);
          },
          (err) => {
            // console.error('Error', err)
            this.functionsService.alertError(err, 'Error')
          },
        )
    }
  }
  async subirMusica() {
    if (!this.invitacion) {
      let data = await this.dateToNumber(this.form.value)
      let invi = {
        fiesta: this.fiesta.uid,
        data: data,
        tipoTemplate: this.fiesta.invitacion,
        templateActivated: false,
        usuarioFiesta: (this.fiesta.usuarioFiesta._id) ? this.fiesta.usuarioFiesta._id : this.fiesta.usuarioFiesta.uid,
        usuarioCreated: this.usuarioFiesta,
        activated: true,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.invitacionsService.crearInvitacion(invi).subscribe((resp: any) => {
        this.invitacion = resp.invitacion
        this.fileService.actualizarMusicaTemplate(this.soundSubir, this.invitacion.fiesta)
          .then(
            (sound) => {
              let dt = this.form.value
              this.invitacion = {
                ...this.invitacion,
                data: dt
              }
              this.loading = true
              setTimeout(() => {
                this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
                  this.invitacion = resp.invitacionActualizado
                  this.loading = false
                  this.getInvitacion(this.id)
                })
              }, 800);
            },
            (err) => {
              // console.error('Error', err)
              this.functionsService.alertError(err, 'Error')
            },
          )
      })
    } else {
      this.fileService.actualizarMusicaTemplate(this.soundSubir, this.fiesta.uid)
        .then(
          (sound) => {
            let dt = this.form.value
            this.invitacion = {
              ...this.invitacion,
              data: dt
            }
            this.invitacion.data.musicaInvitacion = sound
            this.invitacion.fiesta = this.fiesta.uid
            this.invitacion.usuarioCreated = this.usuarioFiesta
            setTimeout(() => {
              this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
                this.invitacion = resp.invitacionActualizado
                this.getInvitacion(this.id)
              })
              this.loading = false
              return
            }, 800);
          },
          (err) => {
            // console.error('Error', err)
            this.functionsService.alertError(err, 'Error')
          },
        )
    }
  }
  actualizarInvitacion(invitacion) {
    invitacion.fiesta = this.fiesta.uid
    invitacion.usuarioCreated = this.usuarioFiesta
    return this.invitacionsService.actualizarInvitacion(invitacion)
  }
  crearInvitacion(invitacion) {
    if (typeof (invitacion.fiesta) == "object") {
      invitacion.fiesta = invitacion.fiesta.uid ? invitacion.fiesta.uid : invitacion.fiesta._id
    }
    return this.invitacionsService.crearInvitacion(invitacion)
  }
  changeSize(event: any) {
    this.viewSizeM = event
  }
  verExample(example) {






    this.functionsService.setLocal('tipoInvitacion', this.fiesta.invitacion)
    if (example == '') {
      this.functionsService.alert('Alerta', 'Necesita seleccionar un ejemplo', 'warning')
      return
    }
    let url = example.split(this.textUrl)

    this.functionsService.setLocal('viewTemplate', this.id)
    this.functionsService.navigateTo(url[1] + '/copy')
  }
  async copiarExample() {


    if (this.functionsService.getLocal('invitacion')) {
      let invitacion = this.functionsService.getLocal('invitacion')

      this.invitacion.data = await this.numberToData(invitacion)
      //Seccion Principal
      this.invitacion.data.img1 = ''
      this.invitacion.data.img1Size = ''
      this.invitacion.data.img1Forma = ''
      this.invitacion.data.iconSize = 0
      this.invitacion.data.img1Height = ''
      this.invitacion.data.img1Rotate = ''
      this.invitacion.data.img1Traslate = ''
      this.invitacion.data.img1Top = ''
      this.invitacion.data.nombreFiesta = ''
      this.invitacion.data.tipoFiesta = ''
      //Seccion Mensaje
      this.invitacion.data.mensaje1 = ''
      this.invitacion.data.mensajeImg = ''
      //Donde y cuando Salon

      this.invitacion.data.donde3Text = this.fiesta.salon.nombre
      this.invitacion.data.donde3Img = this.fiesta.salon.img
      this.invitacion.data.donde3Date = this.invitacion.fecha
      this.invitacion.data.donde3Address = this.fiesta.salon.direccion.toUpperCase()
      this.invitacion.data.donde3AddressUbicacion = this.fiesta.salon.ubicacionGoogle
      this.invitacion.data.donde3AddressUbicacionLat = this.fiesta.salon.lat
      this.invitacion.data.donde3AddressUbicacionLng = this.fiesta.salon.long
      //Donde y cuando Iglesia
      this.invitacion.data.donde1Check = false
      this.invitacion.data.donde1Img = ''
      this.invitacion.data.donde1Text = ''
      this.invitacion.data.donde1Date = ''
      this.invitacion.data.donde1Address = ''
      this.invitacion.data.donde1AddressUbicacion = ''
      this.invitacion.data.donde1AddressUbicacionLat = ''
      this.invitacion.data.donde1AddressUbicacionLng = ''
      //Donde y cuando Registro
      this.invitacion.data.galeriaCheck = false
      this.invitacion.data.donde2Check = false
      this.invitacion.data.donde2Img = ''
      this.invitacion.data.donde2Text = ''
      this.invitacion.data.donde2Date = ''
      this.invitacion.data.donde2Address = ''
      this.invitacion.data.donde2AddressUbicacion = ''
      this.invitacion.data.donde2AddressUbicacionLat = ''
      this.invitacion.data.donde2AddressUbicacionLng = ''
      //Donde y cuando Hospedaje
      this.invitacion.data.hospedajeCheck = false
      this.invitacion.data.galeria1 = ''
      this.invitacion.data.galeria2 = ''
      this.invitacion.data.galeria3 = ''
      this.invitacion.data.galeria4 = ''
      this.invitacion.data.galeria5 = ''
      this.invitacion.data.galeria6 = ''
      this.invitacion.data.hospedajeImg = ''
      this.invitacion.data.hospedajeName = ''
      this.invitacion.data.hospedajePhone = ''
      this.invitacion.data.hospedajeAddress = ''
      this.invitacion.data.hospedajeUbicacion = ''
      this.invitacion.data.hospedajeUbicacionLng = ''
      this.invitacion.data.hospedajeUbicacionLat = ''


      //imagenes intro
      this.invitacion.data.imgIntroLeftCheck = ''
      this.invitacion.data.bgIntro = ''
      this.invitacion.data.fuenteMensajeInicial = ''
      this.invitacion.data.efectoMensajeInicial = ''
      this.invitacion.data.repEfectoMensajeInicial = ''
      this.invitacion.data.colorMensajeInicial = ''
      this.invitacion.data.sizeMensajeInicial = ''
      this.invitacion.data.tiempoEsperaMensajeInicial = ''

      this.invitacion.data.imgIntroLeftUp = ''
      this.invitacion.data.imgIntroRightCheck = ''
      this.invitacion.data.imgIntroRightUp = ''
      //imagen fonfo y marco
      this.invitacion.data.fondoInvitacionCheck = ''
      this.invitacion.data.marcoFotoCheck = ''
      this.invitacion.data.fondoInvitacionUp = ''
      this.invitacion.data.marcoFotoUp = ''

      //Galeria
      this.invitacion.data.galeria1 = ''
      this.invitacion.data.galeria2 = ''
      this.invitacion.data.galeria3 = ''
      this.invitacion.data.galeria4 = ''
      this.invitacion.data.galeria5 = ''
      this.invitacion.data.galeria6 = ''

      //recordatorio 

      this.invitacion.data.recordatorioOk = true
      this.invitacion.data.recordatorio = ''
      //Boton confirmacion
      this.invitacion.data.confirmacionCheck = false
      this.invitacion.data.ajusteCheck = false
      //padres
      this.invitacion.data.padresCheck = false
      this.invitacion.data.padres = []
      //padrinos
      this.invitacion.data.padrinosCheck = false
      this.invitacion.data.padrinos = []
      //chambelanes
      this.invitacion.data.chambelanesCheck = false
      this.invitacion.data.chambelanText = 'Chambelanes'
      this.invitacion.data.chambelanesImgCheck = false
      this.invitacion.data.chambelanes = []
      //menu
      this.invitacion.data.menuCheck = false
      this.invitacion.data.menu = []
      //musica
      this.invitacion.data.musicaCheck = false
      this.invitacion.data.musica = []
      //sobres 
      this.invitacion.data.sobresCheck = false
      this.invitacion.data.sobresTitle = 'Sumar Kilómetros a mi Viaje'
      this.invitacion.data.sobresBanco = 'Bancomer'
      this.invitacion.data.sobresCuenta = '000 000 000'
      this.invitacion.data.sobresClabe = '000 000 000'
      this.invitacion.data.sobresFestejadaTitle = 'Datos de cuenta para Viaje Mariana'
      this.invitacion.data.sobresFestejadaNombre = 'Mariana Lopez'
      this.invitacion.data.sobresFestejadaMensaje = 'O con la tradicional lluvia de sobres. Es la tradición de regalar dinero en efectivo a la Quinceañera en un sobre el día del evento'



      //Itinerarios
      this.invitacion.data.itinerarioCheck = false
      this.invitacion.data.itinerarioBG = '#fff'
      this.invitacion.data.itinerarioTitle = 'Itinerario'
      this.invitacion.data.itinerarios = []
      //Notas
      this.invitacion.data.notaCheck = false
      this.invitacion.data.notaBG = '#fff'
      this.invitacion.data.notaTitle = 'Notas'
      this.invitacion.data.titlePadres = 'Mis Padres'
      this.invitacion.data.titlePadrinos = 'Mis Padrinos'
      this.invitacion.data.notas = []
      //Mesa de regalos
      this.invitacion.data.mesaRegalosCheck = false
      this.invitacion.data.mesaRegalosImg = ""
      //Codigo Vestimenta
      this.invitacion.data.codigoVestimentaCheck = false
      this.invitacion.data.imgQrCheck = false
      this.invitacion.data.codigoVestimentaMujerImg = ""
      this.invitacion.data.codigoVestimentaMujer = ""
      this.invitacion.data.codigoVestimentaHombreImg = ""
      this.invitacion.data.codigoVestimentaHombre = ""
      this.invitacion.data.isMusic = false
      this.invitacion.data.musicRepit = false



      this.invitacion.data.generalTexto = ''
      this.invitacion.data.startText = ''

      this.invitacion.data.whereTitle = ''
      this.invitacion.data.hospedajeTitle = ''
      this.invitacion.data.mesaTitle = ''
      this.invitacion.data.itiTitle = ''
      this.invitacion.data.notasTitle = ''
      this.invitacion.data.confirmacionTexto = ''
      this.invitacion.data.confirmacionBotonTexto = ''
      this.invitacion.data.quitarConfirmacionBotonTexto = ''
      this.invitacion.data.sinConfBotonTexto = ''
      this.invitacion.data.questionConfirm = ''
      this.invitacion.data.galeryTitle = ''
      this.invitacion.data.galeryButtom = ''
      this.invitacion.data.galeryText = ''
      this.invitacion.data.endText = ''
      this.invitacion.data.dayText = ''
      this.invitacion.data.hourText = ''
      this.invitacion.data.minText = ''
      this.invitacion.data.segText = ''
      this.invitacion.data.menuTitle = ''
      this.invitacion.data.dressTitle = ''
      this.invitacion.data.boletoTitle = ''
      this.invitacion.data.boletoText = ''
      this.invitacion.data.mesaText = ''
      this.invitacion.data.mensajeFont = ''
      this.invitacion.data.mensajeEfecto = ''
      this.invitacion.data.mensajeEfectoRep = ''

      this.invitacion.data.mesaRegalosLugar = ''
      this.invitacion.data.mesaRegalosLugar2 = ''
      this.invitacion.data.mesaRegalosUrl = ''
      this.invitacion.data.mesaRegalosUrl2 = ''


      //Invitacion By flie


      this.invitacion.data.byFileInvitacion = ''

      //Entrada General

      this.invitacion.data.generalCheck = false
      this.invitacion.data.generalTexto = ''
      this.invitacion.data.startText = ''
      this.invitacion.data.endText = ''
      this.invitacion.data.dayText = ''
      this.invitacion.data.hourText = ''
      this.invitacion.data.minText = ''
      this.invitacion.data.segText = ''
      this.invitacion.data.menuTitle = ''
      this.invitacion.data.dressTitle = ''
      this.invitacion.data.boletoTitle = ''
      this.invitacion.data.boletoText = ''
      this.invitacion.data.mesaText = ''

      this.invitacion.data.whereTitle = ''
      this.invitacion.data.hospedajeTitle = ''
      this.invitacion.data.mesaTitle = ''
      this.invitacion.data.itiTitle = ''
      this.invitacion.data.notasTitle = ''

      this.invitacion.data.confirmacionTexto = ''
      this.invitacion.data.confirmacionBotonTexto = ''
      this.invitacion.data.quitarConfirmacionBotonTexto = ''
      this.invitacion.data.sinConfBotonTexto = ''
      this.invitacion.data.questionConfirm = ''
      this.invitacion.data.galeryTitle = ''
      this.invitacion.data.galeryButtom = ''
      this.invitacion.data.galeryText = ''






      this.usuarioCreated = this.usuarioFiesta

      this.setFormWithData(this.invitacion)
      this.functionsService.removeItemLocal('invitacion')
    } else {
      this.functionsService.alert('Alerta', 'Necesita entrar a un ejemplo y copiar', 'warning')
      return
    }
  }
  changeRange(type: string, tipo: string) {
    let num = 0
    if (tipo == '+') {
      num = this.form.value[type] + 3
    } else {
      num = this.form.value[type] - 3
    }
    this.form.patchValue({
      [type]: num
    })
  }
  reproducir(event) {
    this.play = event
  }
  getExamples() {



    this.ejemplosServices.cargarEjemplosAll().subscribe(resp => {
      var type = ''
      switch (this.fiesta.invitacion) {
        case 'default':
          type = 'default'
          break;
        case 'byFile':
          type = 'default'
          break;
        case 'fancy':
          type = 'fancy'
          break;

        default:
          type = ''
          break;
      }

      let filtro = resp.ejemplos.filter(resp => {
        return resp.urlFiestaBoleto.includes(type)
      })

      this.examples = this.functionsService.getActives(filtro)


    })
  }
  changeEdit(type, mod) {
    if (mod == 'principal') {

      switch (type) {
        case 'cabeceras':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = true
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.typeView = 'cabeceras'
          this.icon = false
          break;
        case 'musica':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = true
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'colores':
          this.col = true
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'imagen':
          this.col = false
          this.fec = false
          this.ima = true
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'titulo':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = true
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'subtitulo':
          this.fec = false
          this.col = false
          this.ima = false
          this.tit = false
          this.sub = true
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'invitacion':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = true
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'fecha':
          this.col = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.fec = true
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'timer'
          break;
        case 'entrada general':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = true
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'imgIntro':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = true
          this.textoInvitacion = false
          this.fondos = false
          this.icon = false
          this.typeView = 'imgIntro'
          break;
        case 'textoInvitacion':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = true
          this.fondos = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'fondos':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = true
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
        case 'iconos':
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.imgIntro = false
          this.textoInvitacion = false
          this.fondos = false
          this.icon = true
          this.typeView = 'iconos'
          break;

        default:
          this.col = false
          this.fec = false
          this.ima = false
          this.tit = false
          this.sub = false
          this.inv = false
          this.ent = false
          this.mus = false
          this.cab = false
          this.textoInvitacion = false
          this.imgIntro = false
          this.icon = false
          this.typeView = 'seccionInicial'
          break;
      }
    }

  }
  showCoordenadas(e) {




    this.form.patchValue({

      [e.type + 'Lng']: e.lng,
      [e.type + 'Lat']: e.lat,
      [e.type]: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`,
    })


    this.form.value


  }
  getIdMap(event) {



  }
  noBgC(bgOk) {

    if (!bgOk) {
      this.form.patchValue({
        bgCount: ''
      })
    }

  }
  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
