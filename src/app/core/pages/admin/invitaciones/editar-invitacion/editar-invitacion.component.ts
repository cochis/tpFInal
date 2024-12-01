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
  examples = environment.examples
  fiestas: any = []
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
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
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private route: ActivatedRoute,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private router: Router,
    private fileService: FileService,

  ) {
    setTimeout(() => {
      this.viewInicial = true
    }, 500);
    this.functionsService.alert('Crear invitación', 'Se recomienda realizar la invitación en una computadora para facilitar la edición.', 'info')
    this.functionsService.removeItemLocal('tipoInvitacion')
    this.examples.forEach(async element => {
      let fiesta = element.split('|')

      let res = { fiesta: fiesta[0], url: fiesta[1], name: fiesta[2], type: fiesta[3] }
      this.fiestas.push(res)
    });



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
  getFiesta(id) {
    this.loading = true
    this.fiestasService.cargarFiestaById(id).subscribe((resp: CargarFiesta) => {
      this.fiesta = resp.fiesta


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
      topDate: 50,
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
      imgWidth: [100],
      xImg1: [50],
      yImg1: [0],
      topTitle: [40],
      nombreSize: [20],
      titleSize: [20],
      cantidad: [this.fiesta.cantidad],
      tipoFiesta: [''],
      tipoFont: [''],
      tipoSize: [90],
      topDate: [50],
      checking: [this.fiesta.checking],
      fiestaDate: [Number(this.fiesta.fecha)],
      nombreFiesta: [this.fiesta.nombre],
      nombreFont: ['pacifico'],
      nombresSize: [187],
      textInvitacionValida: ['¡Los esperamos!'],
      mensajeCheck: [true],
      mensajeImg: [''],
      mensajeFont: ['pacifico'],
      inicialTFont: ['pacifico'],
      inicialTSize: [10],
      finalTSize: [10],

      finalTFont: ['pacifico'],
      inviFont: ['pacifico'],
      inviFont2: ['pacifico'],
      mensajeImgWidth: [100],
      alturaMensaje: [25],
      bxMensajeImg: [50],
      byMensajeImg: [0],
      mensaje1: [''],
      mensajeSize: [25],

      donde1Check: [true],
      donde1Img: [''],
      donde1Title: ['Iglesia'],
      donde1Text: [''],
      donde1Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde1Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde1AddressUbicacion: [''],
      donde1Address: [''],
      donde2Check: [true],
      donde2Img: [''],
      donde2Title: ['Civil'],
      donde2Text: [''],
      donde2Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde2Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde2AddressUbicacion: [''],
      donde2Address: [''],
      donde3Check: [true],
      donde3Img: [this.fiesta.salon.img],
      donde3Title: [this.fiesta.salon.nombre],
      donde3Text: [this.fiesta.salon.nombre],
      donde3Date: [(typeof (this.fiesta.fecha) == "number") ? this.functionsService.numberDateTimeLocal(this.fiesta.fecha) : this.fiesta.fecha],
      donde3Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde3AddressUbicacion: [this.fiesta.salon.ubicacionGoogle],
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
  async setFormWithData(invitacion: any) {




    invitacion.data = await this.numberToData(invitacion.data)
    this.form = this.fb.group({

      cPrincipal: [invitacion.data.cPrincipal],
      cSecond: [invitacion.data.cSecond],
      checking: [invitacion.fiesta.checking],
      cWhite: [invitacion.data.cWhite],
      img1: [invitacion.data.img1],
      xImg1: [invitacion.data.xImg1],
      yImg1: [invitacion.data.yImg1],
      imgWidth: [invitacion.data.imgWidth],
      topTitle: [invitacion.data.topTitle],

      cantidad: [invitacion.fiesta.cantidad],
      tipoFiesta: [invitacion.data.tipoFiesta],
      tipoSize: [invitacion.data.tipoSize],
      topDate: [invitacion.data.topDate],
      fiestaDate: [invitacion.fiesta.fecha],
      nombreFiesta: [invitacion.fiesta.nombre],
      nombreSize: [invitacion.data.nombreSize],
      titleSize: [invitacion.data.titleSize],
      textInvitacionValida: [invitacion.data.textInvitacionValida],
      mensajeImg: [invitacion.data.mensajeImg],
      bxMensajeImg: [invitacion.data.bxMensajeImg],
      byMensajeImg: [invitacion.data.byMensajeImg],
      mensaje1: [invitacion.data.mensaje1],
      mensajeSize: [invitacion.data.mensajeSize],
      donde1Check: [invitacion.data.donde1Check],
      donde1Img: [invitacion.data.donde1Img],
      donde1Title: [invitacion.data.donde1Title],
      donde1Text: [invitacion.data.donde1Text],
      donde1Date: [invitacion.data.donde1Date],
      donde1Icon: [invitacion.data.donde1Icon],
      donde1AddressUbicacion: [invitacion.data.donde1AddressUbicacion],
      donde1Address: [invitacion.data.donde1Address],
      donde2Check: [invitacion.data.donde2Check],
      donde2Img: [invitacion.data.donde2Img],
      donde2Title: [invitacion.data.donde2Title],
      donde2Text: [invitacion.data.donde2Text],
      donde2Date: [invitacion.data.donde2Date],
      donde2Icon: [invitacion.data.donde2Icon],
      donde2AddressUbicacion: [invitacion.data.donde2AddressUbicacion],
      donde2Address: [invitacion.data.donde2Address],
      donde3Check: [invitacion.data.donde3Check],
      donde3Img: [invitacion.data.donde3Img],
      donde3Title: [invitacion.data.donde3Title],
      donde3Text: [invitacion.data.donde3Text],
      donde3Date: [invitacion.data.donde3Date],
      donde3Icon: [invitacion.data.donde3Icon],
      donde3AddressUbicacion: [invitacion.data.donde3AddressUbicacion],
      donde3Address: [invitacion.data.donde3Address],
      hospedajeCheck: [invitacion.data.hospedajeCheck],
      hospedajeImg: [invitacion.data.hospedajeImg],
      hospedajeName: [invitacion.data.hospedajeName],
      hospedajeIcon: [invitacion.data.hospedajeIcon],
      hospedajeAddress: [invitacion.data.hospedajeAddress],
      hospedajeUbicacion: [invitacion.data.hospedajeUbicacion],
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






      colorQr: [invitacion.data.colorQr],
      colorBgQr: [invitacion.data.colorBgQr],

      //Invitacion byFile
      typeFile: [invitacion.data.typeFile],
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
      tipoFont: [invitacion.data.tipoFont ? invitacion.data.tipoFont : 'pacifico'],
      mensajeImgWidth: [invitacion.data.mensajeImgWidth],
      alturaMensaje: [invitacion.data.alturaMensaje],
      mensajeFont: [invitacion.data.mensajeFont ? invitacion.data.mensajeFont : 'pacifico'],
      inicialTFont: [invitacion.data.inicialTFont ? invitacion.data.inicialTFont : 'pacifico'],
      finalTFont: [invitacion.data.finalTFont ? invitacion.data.finalTFont : 'pacifico'],
      inviFont: [invitacion.data.inviFont ? invitacion.data.inviFont : 'pacifico'],
      inviFont2: [invitacion.data.inviFont2 ? invitacion.data.inviFont2 : 'pacifico'],
      inicialTSize: [invitacion.data.inicialTSize],
      finalTSize: [invitacion.data.finalTSize],









      usuarioCreated: [this.usuarioFiesta],
      activated: [invitacion.data.activated],
      dateCreated: [invitacion.data.dateCreated],
      lastEdited: [this.today],
    })
    if (invitacion.data.byFileUrl && (this.form.value.typeFile == 'video' || this.form.value.typeFile == 'url')) {
      this.viewVideo = true

    }
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
      xImg1: [temp.xImg1],
      yImg1: [temp.yImg1],
      imgWidth: [temp.imgWidth],
      topTitle: [temp.topTitle],

      cantidad: [temp.cantidad],
      tipoFiesta: [temp.tipoFiesta],
      tipoSize: [temp.tipoSize],
      topDate: [temp.topDate],
      fiestaDate: [temp.fiestaDate],
      nombreFiesta: [temp.nombreFiesta],
      nombreSize: [temp.nombreSize],
      titleSize: [temp.titleSize],
      textInvitacionValida: [temp.textInvitacionValida],
      mensajeImg: [temp.mensajeImg],
      bxMensajeImg: [temp.bxMensajeImg],
      byMensajeImg: [temp.byMensajeImg],
      mensaje1: [temp.mensaje1],
      mensajeSize: [temp.mensajeSize],
      donde1Check: [temp.donde1Check],
      donde1Img: [temp.donde1Img],
      donde1Title: [temp.donde1Title],
      donde1Text: [temp.donde1Text],
      donde1Date: [temp.donde1Date],
      donde1Icon: [temp.donde1Icon],
      donde1AddressUbicacion: [temp.donde1AddressUbicacion],
      donde1Address: [temp.donde1Address],
      donde2Check: [temp.donde2Check],
      donde2Img: [temp.donde2Img],
      donde2Title: [temp.donde2Title],
      donde2Text: [temp.donde2Text],
      donde2Date: [temp.donde2Date],
      donde2Icon: [temp.cPrincipal],
      donde2AddressUbicacion: [temp.donde2AddressUbicacion],
      donde2Address: [temp.donde2Address],
      donde3Check: [temp.donde3Check],
      donde3Img: [temp.donde3Img],
      donde3Title: [temp.donde3Title],
      donde3Text: [temp.donde3Text],
      donde3Date: [temp.donde3Date],
      donde3Icon: [temp.donde3Icon],
      donde3AddressUbicacion: [temp.donde3AddressUbicacion],
      donde3Address: [temp.donde3Address],
      hospedajeCheck: [temp.hospedajeCheck],
      hospedajeImg: [temp.hospedajeImg],
      hospedajeName: [temp.hospedajeName],
      hospedajeIcon: [temp.hospedajeIcon],
      hospedajeAddress: [temp.hospedajeAddress],
      hospedajeUbicacion: [temp.hospedajeUbicacion],
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
      tipoFont: [temp.tipoFont],
      mensajeImgWidth: [temp.mensajeImgWidth],
      alturaMensaje: [temp.alturaMensaje],
      mensajeFont: [temp.mensajeFont],
      inicialTFont: [temp.inicialTFont],
      inicialTSize: [temp.inicialTSize],
      finalTSize: [temp.finalTSize],
      finalTFont: [temp.finalTFont],
      inviFont: [temp.inviFont],
      inviFont2: [temp.inviFont2],



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

    if (!this.invitacion) {
      this.loading = true
      let data = {
        ...form.value,
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
        ...form.value
      }
      this.invitacion = {
        ...this.invitacion,
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
          fiestaId: '67004d6552152ca21abfb790',
          //fiestaId: this.fiesta.uid,
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
    this.invitacion.data.fiestaId = this.fiesta.uid
    this.router.navigate(['/core/templates/' + this.fiesta.invitacion], { queryParams: this.invitacion.data })

  }
  async onSubmit() {

    this.loading = true


    if (this.invitacion) {


      if (this.form.value.img1 == '' && this.invitacion.data.img1 !== '') {
        this.form.value.img1 = this.invitacion.data.img1
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
          if (this.rol != this.URS) {
            this.functionsService.navigateTo('core/fiestas/vista-fiestas')
          } else {
            this.functionsService.navigateTo('core/mis-fiestas')
          }
        })
      }, 500);
    } else {


      let dataT = await this.dateToNumber(this.form.value)


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
          this.functionsService.navigateTo('core/fiestas/vista-fiestas')
        })
      }, 500);
    }
  }
  back() {
    if (this.rol != this.URS) {
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
            xImg1: 50,
            yImg1: 10,
            imgWidth: 100,
            topTitle: 40,

            cantidad: this.fiesta.cantidad,
            tipoFiesta: '',
            tipoSize: 90,
            nombreSize: 20,
            titleSize: 20,
            topDate: 50,
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
            donde1Check: true,
            donde1Img: '',
            donde1Title: 'Iglesia',
            donde1Text: '',
            donde1Date: (typeof (this.fiesta.fecha) == "string") ? this.functionsService.dateToNumber(this.fiesta.fecha) : this.fiesta.fecha,
            donde1Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
            donde1AddressUbicacion: '',
            donde1Address: '',
            donde2Check: true,
            donde2Img: '',
            donde2Title: 'Civil',
            donde2Text: '',
            donde2Date: (typeof (this.fiesta.fecha) == "number") ? this.functionsService.dateToNumber(this.fiesta.fecha) : this.fiesta.fecha,
            donde2Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
            donde2AddressUbicacion: '',
            donde2Address: '',
            donde3Check: true,
            donde3Img: this.fiesta.salon.img,
            donde3Title: this.fiesta.salon.nombre,
            donde3Text: this.fiesta.salon.nombre,
            donde3Date: (typeof (this.fiesta.fecha) == "number") ? this.functionsService.dateToNumber(this.fiesta.fecha) : this.fiesta.fecha,
            donde3Icon: 'mt-2 mb-2 text-center bi bi-map pointer',
            donde3AddressUbicacion: this.fiesta.salon.ubicacionGoogle,
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

            //font img

            nombreFont: "pacifico",
            tipoFont: "pacifico",
            mensajeImgWidth: 100,
            alturaMensaje: 25,
            mensajeFont: "pacifico",
            inicialTFont: 'pacifico',
            inicialTSize: 10,
            finalTSize: 10,
            finalTFont: 'pacifico',
            inviFont: 'pacifico',
            inviFont2: 'pacifico',


            //byFIle

            typeFile: '',
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

        }, 800);
      } else {

        this.invitacion.data = await this.numberToData(this.invitacion.data)


        this.usuarioCreated = this.usuarioFiesta
        this.setFormWithData(this.invitacion)
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
        }, 500);
        this.loading = false
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
  addItinerarios() {
    this.itinerarios.push(this.newItinerario());
  }
  addNotas() {
    this.notas.push(this.newNota());
  }
  addChambelan() {
    this.chambelanes.push(this.newChambelan());
  }
  addPadres() {
    this.padres.push(this.newPadre());
  }
  addPadrinos() {
    this.padrinos.push(this.newPadrino());
  }
  addMenus() {
    this.menu.push(this.newMenu());
  }
  addMusica() {
    this.musica.push(this.newMusica());
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

    let url = example.split('https://www.myticketparty.com/core/')

    this.functionsService.setLocal('viewTemplate', this.id)
    this.functionsService.navigateTo('core/' + url[1] + '/copy')
  }
  async copiarExample() {
    if (this.functionsService.getLocal('invitacion')) {

      let invitacion = this.functionsService.getLocal('invitacion')

      this.invitacion.data = await this.numberToData(invitacion)
      this.invitacion.data.nombreFiesta = ''
      this.invitacion.data.tipoFiesta = ''
      this.invitacion.data.generalTexto = ''
      this.invitacion.data.mensaje1 = ''
      this.invitacion.data.codigoVestimentaMujer = ''
      this.invitacion.data.codigoVestimentaHombre = ''
      this.invitacion.data.donde2Text = ''
      this.invitacion.data.donde3Text = ''
      this.invitacion.data.donde2Text = ''
      this.invitacion.data.mesaRegalosLugar = ''
      this.invitacion.data.mesaRegalosUrl = ''
      this.invitacion.data.padres = []
      this.invitacion.data.padrinos = []
      this.invitacion.data.chambelanes = []
      this.invitacion.data.menu = []
      this.invitacion.data.musica = []
      this.invitacion.data.itinerarios = []
      this.invitacion.data.notas = []

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

}
