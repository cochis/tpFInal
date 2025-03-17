import { Component } from '@angular/core';
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
@Component({
  selector: 'app-editar-invitacion',
  templateUrl: './editar-invitacion.component.html',
  styleUrls: ['./editar-invitacion.component.css']
})
export class EditarInvitacionComponent {
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  examples: any = []
  fiestas: any = []
  loading = false
  public imagenSubir!: File
  public soundSubir!: File
  public imgTemp: any = undefined
  public soundTemp: any = undefined
  url = environment.base_url
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
  salon: Salon
  ejemplos: Ejemplo[]

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private route: ActivatedRoute,
    private fiestasService: FiestasService,
    private ejemplosServices: EjemplosService,
    private invitacionsService: InvitacionsService,
    private router: Router,
    private fileService: FileService,
    private mapService: MapsService,
    private salonsService: SalonsService

  ) {

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
          console.error('err::: ', err);
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
        console.error('Error', error)
        this.loading = false
        this.functionsService.alert('Fiesta', 'Por favor intente mas tarde', 'error')
      })
  }

  restaurarAltura() {
    this.form.patchValue({
      cPrincipal: '#ffc1cb',
      cSecond: '#c0354e',
      cWhite: '#ffffff',
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
      img1: [''],
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
      cabeceraFont: ['pacifico'],
      cabeceraSize: [20],
      titleSize: [20],
      cantidad: [this.fiesta.cantidad],
      tipoFiesta: [''],
      tipoFont: [''],
      tipoSize: [90],
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
      nombreFiesta: [this.fiesta.nombre],
      nombreFont: ['pacifico'],
      nombreEfecto: [''],
      nombreEfectoRep: [1],
      nombresSize: [187],
      textInvitacionValida: ['¡Los esperamos!'],
      mensajeCheck: [true],
      mensajeImg: [''],
      mensajeFont: ['pacifico'],
      inicialTFont: ['pacifico'],
      inicialTSize: [10],
      efectoInvi: [''],
      repEfectoInvi: [''],
      finalTSize: [10],
      musicaInvitacion: [''],
      isMusic: [false],
      musicRepit: [false],
      finalTFont: ['pacifico'],
      inviFont: ['pacifico'],
      inviFont2: ['pacifico'],
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
      donde2Text: [''],
      donde2Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde2Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde2AddressUbicacion: [''],
      donde2AddressUbicacionLng: [''],
      donde2AddressUbicacionLat: [''],
      donde2Address: [''],
      donde3Check: [true],
      donde3Img: [this.fiesta.salon.img],
      donde3Title: [this.fiesta.salon.nombre],
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
      generalCheck: [true],
      generalSize: [15],
      generalTexto: [''],
      mesaRegalosLugar: [''],
      mesaRegalosUrl: [''],
      mesaRegalosImg: [''],
      itinerarioCheck: [true],
      itinerarioName: [this.fiesta.nombre],
      itinerarios: this.fb.array([]),
      invitacionTemplate: [false],
      notaCheck: [true],
      notas: this.fb.array([]),
      chambelanesCheck: [true],
      chambelanes: this.fb.array([]),
      padresCheck: [true],
      padres: this.fb.array([]),
      padrinosCheck: [true],
      padrinos: this.fb.array([]),
      menuCheck: [true],
      menu: this.fb.array([]),
      musicaCheck: [true],
      musica: this.fb.array([]),
      codigoVestimentaCheck: [true],
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
      img1: [invitacion.data.img1],
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
      tipoEfecto: [invitacion.data.tipoEfecto],
      tipoEfectoRep: [invitacion.data.tipoEfectoRep],
      topDate: [invitacion.data.topDate],

      efectoCount: [invitacion.data.efectoCount],
      efectoRepCount: [invitacion.data.efectoRepCount],
      typeCount: [invitacion.data.typeCount],
      bgCount: [invitacion.data.bgCount],
      noBgColor: [invitacion.data.noBgColor],
      fiestaDate: [invitacion.fiesta.fecha],
      nombreFiesta: [invitacion.fiesta.nombre],
      nombreSize: [invitacion.data.nombreSize],
      cabeceraFont: [invitacion.data.cabeceraFont],
      cabeceraSize: [invitacion.data.cabeceraSize],
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
      donde1Title: [invitacion.data.donde1Title],
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
      hospedajeName: [invitacion.data.hospedajeName],
      hospedajeIcon: [invitacion.data.hospedajeIcon],
      hospedajeAddress: [invitacion.data.hospedajeAddress],
      hospedajeUbicacion: [invitacion.data.hospedajeUbicacion],
      hospedajeUbicacionLng: [invitacion.data.hospedajeUbicacionLng],
      hospedajeUbicacionLat: [invitacion.data.hospedajeUbicacionLat],
      hospedajePhone: [invitacion.data.hospedajePhone],
      mesaRegalosCheck: [invitacion.data.mesaRegalosCheck],
      confirmacionCheck: [invitacion.data.confirmacionCheck],
      generalCheck: [invitacion.data.generalCheck],
      generalSize: [invitacion.data.generalSize],
      generalTexto: [invitacion.data.generalTexto],
      mesaRegalosLugar: [invitacion.data.mesaRegalosLugar],
      mesaRegalosUrl: [invitacion.data.mesaRegalosUrl],
      mesaRegalosImg: [invitacion.data.mesaRegalosImg],
      itinerarioCheck: [invitacion.data.itinerarioCheck],
      itinerarioName: [invitacion.fiesta.nombre],
      itinerarios: this.fb.array([]),

      notaCheck: [invitacion.data.notaCheck],
      invitacionTemplate: [invitacion.data.invitacionTemplate],
      notas: this.fb.array([]),

      chambelanes: this.fb.array([]),
      padres: this.fb.array([]),
      padrinos: this.fb.array([]),
      musica: this.fb.array([]),
      menu: this.fb.array([]),
      chambelanesCheck: [invitacion.data.chambelanesCheck],
      padresCheck: [invitacion.data.padresCheck],
      padrinosCheck: [invitacion.data.padrinosCheck],
      menuCheck: [invitacion.data.menuCheck],
      musicaCheck: [invitacion.data.musicaCheck],
      codigoVestimentaCheck: [invitacion.data.codigoVestimentaCheck],
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


      nombreFont: [invitacion.data.nombreFont ? invitacion.data.nombreFont : 'pacifico'],
      nombreEfecto: [invitacion.data.nombreEfecto ? invitacion.data.nombreEfecto : ''],
      nombreEfectoRep: [invitacion.data.nombreEfectoRep ? invitacion.data.nombreEfectoRep : 1],
      tipoFont: [invitacion.data.tipoFont ? invitacion.data.tipoFont : 'pacifico'],
      mensajeImgWidth: [invitacion.data.mensajeImgWidth],
      alturaMensaje: [invitacion.data.alturaMensaje],
      mensajeFont: [invitacion.data.mensajeFont ? invitacion.data.mensajeFont : 'pacifico'],
      inicialTFont: [invitacion.data.inicialTFont ? invitacion.data.inicialTFont : 'pacifico'],
      finalTFont: [invitacion.data.finalTFont ? invitacion.data.finalTFont : 'pacifico'],
      inviFont: [invitacion.data.inviFont ? invitacion.data.inviFont : 'pacifico'],
      inviFont2: [invitacion.data.inviFont2 ? invitacion.data.inviFont2 : 'pacifico'],
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
      type: 'seccionInicial',
      size: 'sm',
      byFile: (this.fiesta.invitacion == 'byFile') ? true : false,
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
      img1: [temp.img1],
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
      cabeceraSize: [temp.cabeceraSize],
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
      donde1Title: [temp.donde1Title],
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
      hospedajeName: [temp.hospedajeName],
      hospedajeIcon: [temp.hospedajeIcon],
      hospedajeAddress: [temp.hospedajeAddress],
      hospedajeUbicacion: [temp.hospedajeUbicacion],
      hospedajeUbicacionLng: [temp.hospedajeUbicacionLng],
      hospedajeUbicacionLat: [temp.hospedajeUbicacionLat],
      hospedajePhone: [temp.hospedajePhone],
      mesaRegalosCheck: [temp.mesaRegalosCheck],
      confirmacionCheck: [temp.confirmacionCheck],
      generalCheck: [temp.generalCheck],
      generalSize: [temp.generalSize],
      generalTexto: [temp.generalTexto],
      mesaRegalosLugar: [temp.mesaRegalosLugar],
      mesaRegalosUrl: [temp.mesaRegalosUrl],
      mesaRegalosImg: [temp.mesaRegalosImg],



      nombreFont: [temp.nombreFont],
      nombreEfecto: [temp.nombreEfecto],
      nombreEfectoRep: [temp.nombreEfectoRep],
      tipoFont: [temp.tipoFont],
      mensajeImgWidth: [temp.mensajeImgWidth],
      alturaMensaje: [temp.alturaMensaje],
      mensajeFont: [temp.mensajeFont],
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
      itinerarioName: [temp.itinerarioName],
      itinerarios: this.fb.array([]),
      notaCheck: [temp.notaCheck],
      colorQr: [temp.colorQr],
      colorBgQr: [temp.colorBgQr],
      invitacionTemplate: [temp.invitacionTemplate],
      chambelanes: this.fb.array([]),
      padres: this.fb.array([]),
      padrinos: this.fb.array([]),
      musica: this.fb.array([]),
      menu: this.fb.array([]),
      chambelanesCheck: [temp.data.chambelanesCheck],
      padresCheck: [temp.data.padresCheck],
      padrinosCheck: [temp.data.padrinosCheck],
      menuCheck: [temp.data.menuCheck],
      musicaCheck: [temp.data.musicaCheck],
      codigoVestimentaCheck: [temp.data.codigoVestimentaCheck],
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


    this.router.navigate(['/core/templates/' + this.fiesta.invitacion], { queryParams: this.invitacion.data })

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
      if (this.form.value.byFileInvitacion == '' && this.invitacion.data.byFileInvitacion !== '') {
        this.form.value.byFileInvitacion = this.invitacion.data.byFileInvitacion
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
            this.functionsService.navigateTo('core/fiestas/vista-fiestas')
          } else {
            this.functionsService.navigateTo('core/mis-fiestas')
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
          this.functionsService.navigateTo('core/fiestas/vista-fiestas')
        })
      }, 500);
    }
  }
  back() {
    if (this.rol == this.ADM || this.rol == this.SLN || this.rol == this.ANF) {
      this.functionsService.navigateTo('core/fiestas/vista-fiestas')
    } else {
      this.functionsService.navigateTo('core/mis-fiestas')
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
    data.donde2Check = (data.donde2Check == 'true' || data.donde2Check == true) ? true : false
    data.donde3Check = (data.donde3Check == 'true' || data.donde3Check == true) ? true : false
    data.notaCheck = (data.notaCheck == 'true' || data.notaCheck == true) ? true : false
    data.itinerarioCheck = (data.itinerarioCheck == 'true' || data.itinerarioCheck == true) ? true : false
    data.chambelanesCheck = (data.chambelanesCheck == 'true' || data.chambelanesCheck == true) ? true : false
    data.padresCheck = (data.padresCheck == 'true' || data.padresCheck == true) ? true : false
    data.padrinosCheck = (data.padrinosCheck == 'true' || data.padrinosCheck == true) ? true : false
    data.menuCheck = (data.menuCheck == 'true' || data.menuCheck == true) ? true : false
    data.musicaCheck = (data.musicaCheck == 'true' || data.musicaCheck == true) ? true : false
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
            img1: '',
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
            tipoEfecto: '',
            tipoEfectoRep: 1,
            nombreSize: 20,

            cabeceraSize: 20,
            cabeceraFont: 'pacifico',
            titleSize: 20,
            topDate: 50,
            efectoCount: '',
            efectoRepCount: '',
            typeCount: '',
            bgCount: '',
            noBgColor: '',
            checking: this.fiesta.checking,
            fiestaDate: Number(this.fiesta.fecha),
            nombreFiesta: this.fiesta.nombre,
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
            donde1Title: 'Iglesia',
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
            donde3Title: this.fiesta.salon.nombre,
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
            generalCheck: true,
            generalSize: 15,
            generalTexto: '',
            mesaRegalosLugar: '',
            mesaRegalosUrl: '',
            mesaRegalosImg: '',
            itinerarioCheck: true,
            itinerarioName: this.fiesta.nombre,
            itinerarios: [],
            notaCheck: true,
            invitacionTemplate: false,
            notas: [],
            chambelanesCheck: true,
            padresCheck: true,
            padrinosCheck: true,
            menuCheck: true,
            musicaCheck: true,
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
            nombreFont: "pacifico",
            nombreEfecto: "",
            nombreEfectoRep: 1,
            tipoFont: "pacifico",
            mensajeImgWidth: 100,
            alturaMensaje: 25,
            mensajeFont: "pacifico",
            inicialTFont: 'pacifico',
            inicialTSize: 10,
            efectoInvi: '',
            repEfectoInvi: '',
            finalTSize: 10,
            musicaInvitacion: '',
            isMusic: '',
            musicRepit: '',
            finalTFont: 'pacifico',
            inviFont: 'pacifico',
            inviFont2: 'pacifico',
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
        console.error('Error', error)
        this.functionsService.alertError(error, 'Invitacion')
      })
  }
  newItinerario(itinerario?): FormGroup {
    if (itinerario) {
      return this.fb.group({
        name: itinerario.name,
        hr: itinerario.hr,
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
      })
    } else {
      return this.fb.group({
        name: '',
        hr: '',
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
        name: padrino.name
      })
    } else {
      return this.fb.group({
        name: ''
      })
    }
  }
  newMenu(menu?): FormGroup {
    if (menu) {
      return this.fb.group({
        tipo: menu.tipo,
        name: menu.name,
      })
    } else {
      return this.fb.group({
        tipo: '',
        name: '',
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
  cambiarImagen(file: any, type: string) {
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
        this.subirImagen(type)
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
  async subirImagen(type) {
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
              console.error('Error', err)
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
            console.error('Error', err)
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
              console.error('Error', err)
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
            console.error('Error', err)
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
      this.invitacion.data.nombreFiesta = this.fiesta.nombre
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
      this.invitacion.data.hospedajeImg = ''
      this.invitacion.data.hospedajeName = ''
      this.invitacion.data.hospedajePhone = ''
      this.invitacion.data.hospedajeAddress = ''
      this.invitacion.data.hospedajeUbicacion = ''
      this.invitacion.data.hospedajeUbicacionLng = ''
      this.invitacion.data.hospedajeUbicacionLat = ''

      //Boton confirmacion
      this.invitacion.data.confirmacionCheck = false
      //padres
      this.invitacion.data.padresCheck = false
      this.invitacion.data.padres = []
      //padrinos
      this.invitacion.data.padrinosCheck = false
      this.invitacion.data.padrinos = []
      //chambelanes
      this.invitacion.data.chambelanesCheck = false
      this.invitacion.data.chambelanes = []
      //menu
      this.invitacion.data.menuCheck = false
      this.invitacion.data.menu = []
      //musica
      this.invitacion.data.musicaCheck = false
      this.invitacion.data.musica = []
      //Itinerarios
      this.invitacion.data.itinerarioCheck = false
      this.invitacion.data.itinerarios = []
      //Notas
      this.invitacion.data.notaCheck = false
      this.invitacion.data.notas = []
      //Mesa de regalos
      this.invitacion.data.mesaRegalosCheck = false
      this.invitacion.data.mesaRegalosImg = ""
      //Codigo Vestimenta
      this.invitacion.data.codigoVestimentaCheck = false
      this.invitacion.data.codigoVestimentaMujerImg = ""
      this.invitacion.data.codigoVestimentaMujer = ""
      this.invitacion.data.codigoVestimentaHombreImg = ""
      this.invitacion.data.codigoVestimentaHombre = ""
      this.invitacion.data.isMusic = false
      this.invitacion.data.musicRepit = false



      this.invitacion.data.generalTexto = ''
      this.invitacion.data.mensajeFont = ''
      this.invitacion.data.mensajeEfecto = ''
      this.invitacion.data.mensajeEfectoRep = ''

      this.invitacion.data.mesaRegalosLugar = ''
      this.invitacion.data.mesaRegalosUrl = ''


      //Invitacion By flie


      this.invitacion.data.byFileInvitacion = ''

      //Entrada General

      this.invitacion.data.generalCheck = false
      this.invitacion.data.generalTexto = ''








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

      var type = (this.fiesta.invitacion.includes('default') ? 'default' : 'byFile')
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
}
