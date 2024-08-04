import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from 'src/app/core/services/file.service';
import { FunctionsService } from '../../services/functions.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { CargarFiesta } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Fiesta } from 'src/app/core/models/fiesta.model';

@Component({
  selector: 'app-shared-default-template',
  templateUrl: './shared-default-template.component.html',
  styleUrls: ['./shared-default-template.component.css']
})
export class SharedDefaultTemplateComponent implements AfterViewInit {
  @Input() fiesta: any;
  @Output() sendRes: EventEmitter<any>;
  loading: boolean = false
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  uid = this.functionsService.getLocal('uid')
  invitacion: any
  edit = 'true'
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fileService: FileService,
    private fiestasService: FiestasService
  ) {


  }
  ngAfterViewInit() {
    this.loading = true

    setTimeout(() => {
      this.createForm(this.fiesta)

      let i = { name: 'Ceremonia', hr: '17:00 hrs' }
      this.addItinerarios(i)
      this.addItinerarios(i)
      let not = 'Nota 1'
      let not2 = 'Nota 2'
      this.addNotas(not)
      this.addNotas(not2)

      this.loading = false
    }, 1800);

  }
  get itinerarios(): FormArray {
    return this.form.get('itinerarios') as FormArray
  }
  get notas(): FormArray {
    return this.form.get('notas') as FormArray
  }

  createForm(fiesta: Fiesta) {

    this.form = this.fb.group({
      cPrincipal: ['pink', [Validators.required, Validators.minLength(3)]],
      cSecond: ['#ee8fa0', [Validators.required]],
      cWhite: ['white', [Validators.required]],
      img1: ['', [Validators.required]],
      xImg1: [50, [Validators.required]],
      topTitle: [40, [Validators.required]],

      invitado: ['Invitado'],
      cantidad: [this.fiesta.cantidad, [Validators.required]],
      tipoFiesta: ['Mis XV', [Validators.required]],
      topDate: [50],
      nombreFiesta: [this.fiesta.nombre, [Validators.required]],
      textInvitacionValida: ['¡Los esperamos!', [Validators.required]],
      mensajeImg: [''],
      mensaje1: ['Tengo el vestido, la ilusión, la felicidad, el lugar y todo lo que se pueda soñar. Sólo me falta que ustedes estén conmigo en este día.'],
      donde1Check: [true],
      donde1Img: ['/assets/images/xv/xv2.jpg'],
      donde1Title: ['Iglesia'],
      donde1Text: ['Basilica de Guadalupe'],
      donde1Date: [this.today],
      donde1Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde1AddressUbicacion: ['https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu'],
      donde1Address: [' Progreso, Yuc., México'],
      donde2Check: [true],
      donde2Img: ['/assets/images/xv/xv4.jpg'],
      donde2Title: ['Civil'],
      donde2Text: ['Registro'],
      donde2Date: [this.today],
      donde2Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde2AddressUbicacion: ['https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu'],
      donde2Address: ['Progreso, Yuc., México'],
      donde3Check: [true],
      donde3Img: [this.fiesta.img],
      donde3Title: [this.fiesta.nombre],
      donde3Text: [this.fiesta.nombre],
      donde3Date: [this.fiesta.fecha],
      donde3Icon: ['mt-2 mb-2 text-center bi bi-map pointer'],
      donde3AddressUbicacion: [this.fiesta.salon.ubicacionGoogle],
      donde3Address: [
        this.fiesta.salon.calle + ' ' + this.fiesta.salon.numeroExt + ' ' +
        this.fiesta.salon.numeroInt + ' ' + this.fiesta.salon.coloniaBarrio + ' ' +
        this.fiesta.salon.cp + ' ' + this.fiesta.salon.cp + ' ' + this.fiesta.salon.estado + ' ' + this.fiesta.salon.pais
      ],
      hospedajeCheck: [true],
      hospedajeImg: [''],
      hospedajeName: ['Camino real'],
      hospedajeIcon: ['mt-2 mb-2 text-center  bi-info-circle pointer'],
      hospedajeAddress: ['Centro Comercial City, Av. Andrés García Lavín 298-32, Fundura Montebello, 97113 Mérida, Yuc., México.'],
      hospedajeUbicacion: ['https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846441,-99.1174072,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu'],
      hospedajePhone: ['0123456789'],
      itinerarioCheck: [true],
      itinerarioName: [this.fiesta.nombre],
      itinerarios: this.fb.array([]),
      notaCheck: [true],

      notas: this.fb.array([]),
      usuarioCreated: [this.uid],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })



  }
  getFiesta(fiesta: string) {
    this.loading = true
    this.fiestasService.cargarFiestaById(fiesta).subscribe((resp: CargarFiesta) => {
      this.fiesta = resp.fiesta
      this.createForm(this.fiesta)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Fiestas')
      })
  }
  setItinerario(itinerario) {


    return this.fb.group({
      name: itinerario.name,
      hr: itinerario.hr,
    })


  }
  setNota(nota) {
    return this.fb.group({
      texto: nota
    })
  }
  newItinerario(): FormGroup {
    return this.fb.group({
      name: '',
      hr: '',
    })
  }
  newNota(): FormGroup {
    return this.fb.group({
      texto: ''
    })
  }
  addItinerarios(item?) {

    if (item) {
      this.itinerarios.push(this.setItinerario(item));
    } else {
      this.itinerarios.push(this.newItinerario());
    }
  }
  addNotas(item?) {

    if (item) {
      this.notas.push(this.setNota(item));
    } else {
      this.notas.push(this.newNota());
    }
  }
  removeItinerario(i: number) {
    this.itinerarios.removeAt(i);
  }
  removeNota(i: number) {
    this.notas.removeAt(i);
  }
  onSubmit() {


  }
  back() {


  }
}
