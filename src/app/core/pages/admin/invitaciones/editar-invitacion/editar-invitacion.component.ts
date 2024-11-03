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
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private route: ActivatedRoute,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private router: Router,
    private fileService: FileService,

  ) {

    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']

    if (this.edit == 'true') {
      this.edit = true
    } else {
      this.edit = false
    }

    this.getInvitacion(this.id)
    this.getFiesta(this.id)

  }
  get errorControl() {
    return this.form.controls;
  }
  getFiesta(id) {
    this.loading = true
    this.fiestasService.cargarFiestaById(id).subscribe((resp: CargarFiesta) => {
      this.fiesta = resp.fiesta


      this.invitacionId = this.fiesta.invitacion

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
      xImg1: [50],
      yImg1: [0],
      topTitle: [40],
      nombreSize: [20],
      invitado: [''],
      cantidad: [this.fiesta.cantidad],
      tipoFiesta: [''],
      tipoSize: [90],
      topDate: [50],
      checking: [this.fiesta.checking],
      fiestaDate: [Number(this.fiesta.fecha)],
      nombreFiesta: [this.fiesta.nombre],
      nombresSize: [187],
      textInvitacionValida: ['¡Los esperamos!'],
      mensajeCheck: [true],
      mensajeImg: [''],
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
      generalTexto: [''],
      mesaRegalosLugar: [''],
      mesaRegalosUrl: [''],
      mesaRegalosImg: [''],


      itinerarioCheck: [true],
      itinerarioName: [this.fiesta.nombre],
      itinerarios: this.fb.array([]),
      notaCheck: [true],
      invitacionTemplate: [false],
      notas: this.fb.array([]),
      colorQr: ['#ffffff'],
      colorBgQr: ['#c0354e'],
      usuarioCreated: [this.uid],
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
      topTitle: [invitacion.data.topTitle],
      invitado: ['Invitado'],
      cantidad: [invitacion.fiesta.cantidad],
      tipoFiesta: [invitacion.data.tipoFiesta],
      tipoSize: [invitacion.data.tipoSize],
      topDate: [invitacion.data.topDate],
      fiestaDate: [invitacion.fiesta.fecha],
      nombreFiesta: [invitacion.fiesta.nombre],
      nombreSize: [invitacion.data.nombreSize],
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








      usuarioCreated: [invitacion.data.usuarioCreated],
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
      topTitle: [temp.topTitle],
      invitado: [temp.invitado],
      cantidad: [temp.cantidad],
      tipoFiesta: [temp.tipoFiesta],
      tipoSize: [temp.tipoSize],
      topDate: [temp.topDate],
      fiestaDate: [temp.fiestaDate],
      nombreFiesta: [temp.nombreFiesta],
      nombreSize: [temp.nombreSize],
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
      generalTexto: [temp.generalTexto],
      mesaRegalosLugar: [temp.mesaRegalosLugar],
      mesaRegalosUrl: [temp.mesaRegalosUrl],
      mesaRegalosImg: [temp.mesaRegalosImg],


      itinerarioCheck: [temp.itinerarioCheck],
      itinerarioName: [temp.itinerarioName],
      itinerarios: this.fb.array([]),
      notaCheck: [temp.notaCheck],
      colorQr: [temp.colorQr],
      colorBgQr: [temp.colorBgQr],
      invitacionTemplate: [temp.invitacionTemplate],
      notas: this.fb.array([]),
      usuarioCreated: [temp.usuarioCreated],
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
        usuarioCreated: this.uid,
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
        this.invitacion.data = {
          ...  this.invitacion.data,
          itinerarios: iti,
          notas: not
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
        usuarioCreated: this.usuarioCreated,
        lastEdited: this.today
      }
      this.invitacion.data.donde3Img = this.fiesta.salon.img

      this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
        this.invitacion = resp.invitacionActualizado

        this.invitacion.data.fiestaId = this.fiesta.uid
        let iti = JSON.stringify(form.value.itinerarios)
        let not = JSON.stringify(form.value.notas)
        this.invitacion.data = {
          ...  this.invitacion.data,
          fiestaId: '67004d6552152ca21abfb790',
          //fiestaId: this.fiesta.uid,
          itinerarios: iti,
          notas: not
        }
      })
    }



    this.invitacion.data.itinerarios = JSON.stringify(this.invitacion.data.itinerarios)
    this.invitacion.data.notas = JSON.stringify(this.invitacion.data.notas)
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
      if (this.form.value.itinerarios.length > 0) {
        this.form.value.itinerarioCheck = true
      }
      if (this.form.value.notas.length > 0) {
        this.form.value.notaCheck = true
      }
      let data = await this.numberToData(this.form.value)

      this.invitacion.data = (data)
      this.invitacion.usuarioFiesta = this.fiesta.usuarioFiesta

      this.actualizarInvitacion(this.invitacion).subscribe((res: any) => {
        this.invitacion = res.invitacionActualizado
        if (this.rol != this.URS) {
          this.functionsService.navigateTo('core/fiestas/vista-fiestas')
        } else {
          this.functionsService.navigateTo('core/mis-fiestas')
        }
      })
    } else {

      let dataT = await this.dateToNumber(this.form.value)

      var invitado = {
        tipoTemplate: this.fiesta.invitacion,
        templateActivated: true,
        data: dataT,
        usuarioFiesta: (this.fiesta.usuarioFiesta._id) ? this.fiesta.usuarioFiesta._id : this.fiesta.usuarioFiesta.uid,
        fiesta: (this.fiesta._id) ? this.fiesta._id : this.fiesta.uid,
        usuarioCreated: this.uid,
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
            yImg1: 0,
            topTitle: 40,
            invitado: '',
            cantidad: this.fiesta.cantidad,
            tipoFiesta: '',
            tipoSize: 90,
            nombreSize: 20,
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
            colorQr: '#ffffff',
            colorBgQr: '#c0354e',
            usuarioCreated: this.uid,

            activated: true,
            dateCreated: this.today,
            lastEdited: this.today,


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
            usuarioCreated: this.uid,
            activated: true,
            lastEdited: this.today,
            dateCreated: this.today
          }


          this.crearInvitacion((invitacion)).subscribe((resp: any) => {
            this.invitacion = resp.invitacion
            this.invitacion.data.fiestaId = this.fiesta.uid
            let iti = JSON.stringify([])
            let not = JSON.stringify([])
            this.invitacion.data = {
              ...  this.invitacion.data,
              itinerarios: iti,
              notas: not
            }

            this.setForm(resp.invitacion)
          })

        }, 800);
      } else {
        this.invitacion.data = await this.numberToData(this.invitacion.data)

        this.usuarioCreated = this.invitacion.usuarioCreated
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
        }, 500);
        this.loading = false
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
      })
    } else {
      return this.fb.group({
        name: '',
        hr: '',
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
  removeItinerario(i: number) {
    this.itinerarios.removeAt(i);
  }
  removeNota(i: number) {
    this.notas.removeAt(i);
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
        usuarioCreated: this.uid,
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
              case 'hospedajeImg':
                this.invitacion.data.hospedajeImg = img
                break;
              case 'byFileInvitacion':
                this.invitacion.data.byFileInvitacion = img
                break;
              case 'mesaRegalosImg':
                this.invitacion.data.mesaRegalosImg = img
                break;
            }
            this.invitacion.fiesta = this.fiesta.uid
            this.invitacion.usuarioCreated = this.usuarioCreated


            setTimeout(() => {


              this.actualizarInvitacion(this.invitacion).subscribe((resp: any) => {
                this.invitacion = resp.invitacionActualizado
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
    invitacion.usuarioCreated = this.usuarioCreated
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

}
