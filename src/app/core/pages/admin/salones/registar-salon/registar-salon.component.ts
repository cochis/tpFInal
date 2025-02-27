import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CargarPaises, CargarPaquete, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

import { Salon } from 'src/app/core/models/salon.model';
import { Paquete } from 'src/app/core/models/paquete.model';
import { Usuario } from 'src/app/core/models/usuario.model';

import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { PaquetesService } from 'src/app/core/services/paquete.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { PaisesService } from 'src/app/core/services/pais.service';
import { CpsService } from 'src/app/core/services/cp.service';
import { MapsService } from 'src/app/shared/services/maps.service';
import { Cp } from 'src/app/core/models/cp.model';
import { Pais } from 'src/app/core/models/pais.model';
@Component({
  selector: 'app-registar-salon',
  templateUrl: './registar-salon.component.html',
  styleUrls: ['./registar-salon.component.css']
})
export class RegistarSalonComponent {
  loading = false
  salones: Salon[]

  location: any = undefined
  public form!: FormGroup
  EVTRGL = environment.EVTRGL
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  usuario: Usuario
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  PRV = environment.prv_role
  paquete: Paquete
  role = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  sendCoords!: [number, number]
  cps: Cp[]
  paises: Pais[]
  estados = []
  municipios = []
  colonias = []
  isPais = false
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private usuariosService: UsuariosService,
    private paquetesService: PaquetesService,
    private modalService: NgbModal,

    private paisesService: PaisesService,
    private cpsService: CpsService,
    private mapsServices: MapsService,
  ) {
    this.getCatalogos()
    if (this.functionsService.getLocal('uid')) {

      this.uid = this.functionsService.getLocal('uid')
    }


    this.loading = true
    this.getLocation()
    this.createForm()
    this.getUser()

    setTimeout(() => {

      this.loading = false
    }, 1500);
  }

  getLocation() {
    this.mapsServices.getUserLocation().then(res => {
      this.location = res


    })
  }
  getUser() {


    this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario



    },
      (error) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Home')
      })

  }
  get errorControl() {
    return this.form.controls;
  }
  checkPais() {


    if (this.form.value.pais == '') {

      this.isPais = false
    } else {
      this.isPais = true
    }



  }
  createForm() {
    this.form = this.fb.group({
      nombre: [''],
      calle: ['', [Validators.required]],
      numeroExt: ['', [Validators.required]],
      numeroInt: [''],
      municipioDelegacion: ['', [Validators.required]],
      coloniaBarrio: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.pattern(".{5,5}")]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      comoLlegar: ['', [Validators.required]],
      lat: [''],
      long: [''],
      ubicacionGoogle: [''],
      telefono: ['', [Validators.required, Validators.pattern(".{10,10}")]],
      email: [this.functionsService.getLocal('email'), [Validators.required, Validators.email]],
      img: [''],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],

    })
  }
  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.calle = this.form.value.calle.toUpperCase().trim()
      this.form.value.numeroExt = this.form.value.numeroExt.toUpperCase().trim()
      this.form.value.numeroInt = this.form.value.numeroInt.toUpperCase().trim()
      this.form.value.municipioDelegacion = this.form.value.municipioDelegacion.toUpperCase().trim()
      this.form.value.coloniaBarrio = this.form.value.coloniaBarrio.toUpperCase().trim()
      this.form.value.estado = this.form.value.estado.toUpperCase().trim()
      this.form.value.pais = this.form.value.pais.toUpperCase().trim()
      this.form.value.comoLlegar = this.form.value.comoLlegar.toUpperCase().trim()
      this.form.value.direccion = `${this.form.value.calle}  ${this.form.value.numeroExt},   ${this.form.value.numeroInt}, colonia o barrio ${this.form.value.coloniaBarrio}, municipio o delegación ${this.form.value.municipioDelegacion}, CP. ${this.form.value.cp} estado ${this.form.value.estado} en ${this.form.value.pais} `

      let salon = {
        ...this.form.value,
        activated: true
      }

      this.salonesService.crearSalon(salon).subscribe((resp: any) => {


        this.functionsService.alert('Centro de Eventos', 'Creado', 'success')

        this.usuario.salon = resp.salon.uid
        this.usuario.lastEdited = this.functionsService.getToday()

        this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp: CargarUsuario) => {
          this.functionsService.alert('Centro de Eventos', 'Se ha registrado tu centro de eventos', 'success')
          this.loading = false
          this.functionsService.navigateTo(`core/salones/editar-salon/true/${this.usuario.salon}`)

        },
          (error) => {
            console.error('Error', error)
            this.functionsService.alertError(error, 'Centro de Eventos')
            this.loading = false
          })
      },
        (error) => {
          console.error('Error', error)
          this.functionsService.alertError(error, 'Centro de Eventos')
          this.loading = false


        })
    } else {

      this.functionsService.alertForm('Centro de Eventos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }




  }

  getCatalogos() {
    this.paquetesService.cargarPaqueteByClave(this.EVTRGL).subscribe((resp: CargarPaquete) => {
      this.paquete = resp.paquete
    },
      (error) => {
        this.functionsService.alertError(error, 'Paquetes')
        console.error('Error', error)

      })
    this.paisesService.cargarPaisesAll().subscribe((resp: CargarPaises) => {
      this.paises = resp.paises



    },
      (error: any) => {
        // console.error('Error', error)
        this.functionsService.alertError(error, 'Centro de eventos (Países)')
        this.loading = false
      })
  }
  back() {
    this.functionsService.navigateTo('core/salones/vista-salones')
  }
  showInfo(content) {
    this.modalService.open(content, { fullscreen: true });
  }
  showCoordenadas(e) {
    this.form.patchValue({
      lat: e.lat,
      long: e.lng,
      [e.type]: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`
    })
  }
  getCps(pais?, cp?) {

    if (!pais && !cp) {

      pais = this.form.value.pais
      cp = this.form.value.cp

    }
    if (this.form.value.pais == '') {
      this.functionsService.alert('Centro de eventos', 'Selecciona un país', 'info')
      return
    }

    if (pais == '') {
      pais = this.form.value.pais.toUpperCase().trim()
    }


    if (cp.length >= 5) {


      this.cpsService.cargarCpByPaisCP(pais, cp).subscribe((resp) => {


        resp.cps.forEach(element => {


          this.estados.push(element.d_estado)

          this.municipios.push(element.D_mnpio)
          this.colonias.push(element.d_asenta)

        });

        this.municipios = this.unique(this.municipios)
        this.colonias = this.unique(this.colonias)
        let edo = this.estados[0]




        this.form.patchValue({
          estado: edo,

        })



      },
        (error: any) => {
          // console.error('Error', error)
          this.functionsService.alertError(error, 'CPs')
          this.loading = false
        })
    } else {
      this.estados = []
      this.municipios = []
      this.colonias = []


      return
    }
  }
  unique(arr) {
    let result = [];

    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }

    return result;
  }
  getIdMap(event) {




  }
}
