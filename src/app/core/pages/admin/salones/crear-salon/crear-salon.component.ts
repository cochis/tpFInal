import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CargarPaises, CargarRoles, CargarTipoUbicaciones, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Cp } from 'src/app/core/models/cp.model';
import { Pais } from 'src/app/core/models/pais.model';
import { Role } from 'src/app/core/models/role.model';

import { Salon } from 'src/app/core/models/salon.model';
import { TipoUbicacion } from 'src/app/core/models/tipoUbicacion.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { CpsService } from 'src/app/core/services/cp.service';
import { PaisesService } from 'src/app/core/services/pais.service';

import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoUbicacionesService } from 'src/app/core/services/tipoUbicacion.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MapsService } from 'src/app/shared/services/maps.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-salon',
  templateUrl: './crear-salon.component.html',
  styleUrls: ['./crear-salon.component.scss']
})
export class CrearSalonComponent {
  loading = false
  salones: Salon[]
  submited: boolean = false
  usuarios: Usuario[]
  SLN = environment.salon_role
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  ADM = environment.admin_role
  MAPURL = environment.mapsGoogleUrl
  MAPZOOM = environment.mapsGoogleZoom
  URS = environment.user_role
  CHK = environment.chk_role
  ANF = environment.anf_role
  rol = this.functionsService.getLocal('role')
  email = this.functionsService.getLocal('email')
  sendCoords!: [number, number]
  cps: Cp[]
  paises: Pais[]
  estados = []
  municipios = []
  colonias = []
  roles: Role[]
  tipoUbicaciones: TipoUbicacion[]
  isPais = false
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private usuariosService: UsuariosService,
    private mapsService: MapsService,
    private cpsService: CpsService,
    private paisesService: PaisesService,
    private tipoUbicacionesServices: TipoUbicacionesService,
    private rolesService: RolesService,
  ) {


    this.mapsService.getUserLocation().then(res => {
      this.sendCoords = res
    })
    this.loading = true
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  get errorControl() {
    return this.form.controls;

  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numeroExt: ['', [Validators.required]],
      numeroInt: [''],
      municipioDelegacion: ['', [Validators.required]],
      coloniaBarrio: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.pattern(".{5,5}")]],
      estado: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      comoLlegar: [''],
      lat: [''],
      long: [''],
      telefono: ['', [Validators.required, Validators.pattern(".{10,10}")]],
      email: [this.functionsService.getLocal('email'), [Validators.required, Validators.email]],
      ubicacionGoogle: [''],
      img: [''],
      tipoUbicacion: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],


    })
  }
  checkPais() {


    if (this.form.value.pais == '') {

      this.isPais = false
    } else {
      this.isPais = true
    }



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
      this.form.value.ubicacionGoogle = this.form.value.ubicacionGoogle.toLowerCase().trim()
      this.form.value.comoLlegar = this.form.value.comoLlegar.toUpperCase().trim()
      this.form.value.direccion = `${this.form.value.calle}  ${this.form.value.numeroExt},   ${this.form.value.numeroInt}, colonia o barrio ${this.form.value.coloniaBarrio}, municipio o delegación ${this.form.value.municipioDelegacion}, estado ${this.form.value.estado} en ${this.form.value.pais} `


      this.salonesService.crearSalon(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Centro de eventos', 'Creado', 'success')
        this.functionsService.navigateTo(`core/salones/editar-salon/true/${resp.salon.uid}`)
        this.loading = false
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'Centro de eventos')

        })
    } else {

      this.functionsService.alertForm('Centro de eventos')
      this.loading = false
      return console.info('Please provide all the required values!');
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
  getRolClave(clave) {
    let res = this.roles.find(element => element.clave == clave);
    return res.uid
  }
  getCps(pais, cp) {

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
          estado: edo
        })
        /*     this.form.get('estado').disable();
            this.form.get('pais').disable(); */

      },
        (error: any) => {
          console.error('Error', error)
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

  getCatalogos() {
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = resp.usuarios

    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Centro de eventos')
        this.loading = false
      })
    this.paisesService.cargarPaisesAll().subscribe((resp: CargarPaises) => {
      this.paises = resp.paises


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Centro de eventos (Países)')
        this.loading = false
      })
    this.tipoUbicacionesServices.cargarTipoUbicacionesAll().subscribe((resp: CargarTipoUbicaciones) => {
      this.tipoUbicaciones = resp.tipoUbicaciones



    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Tipo Ubicaciones')
        this.loading = false
      })
    this.rolesService.cargarRolesInit().subscribe((resp: CargarRoles) => {
      this.roles = resp.roles

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Registro')
      })

  }
  back() {
    this.functionsService.navigateTo('..')
    /* this.functionsService.navigateTo('core/salones/vista-salones') */
  }


  showCoordenadas(e) {
    this.form.patchValue({
      lat: e.lat,
      long: e.lng,
      [e.type]: `${this.MAPURL}?q=${e.lat},${e.lng}&z=${this.MAPZOOM}`
    })
  }





}
