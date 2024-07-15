import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Salon } from 'src/app/core/models/salon.model';

import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';

import { CargarFiestas, CargarGrupos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Grupo } from 'src/app/core/models/grupo.model';
import { SalonsService } from 'src/app/core/services/salon.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { GruposService } from 'src/app/core/services/grupo.service';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-boleto',
  templateUrl: './crear-boleto.component.html',
  styleUrls: ['./crear-boleto.component.css']
})
export class CrearBoletoComponent {
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  loading = false
  submited: boolean = false
  email = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  salones: Salon[]
  fiestas!: Fiesta[]
  grupos!: Grupo[]
  salon!: Salon
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  cargando: boolean = false
  msnOk: boolean = false
  numeroInvitados: number = 0
  sumaInvitados: number = 0
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private salonesService: SalonsService,
    private gruposService: GruposService,
    private fiestasService: FiestasService,
    private boletosService: BoletosService
  ) {
    this.loading = true
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  getCatalogos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
        this.fiestas = resp.fiestas

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
          this.loading = false
        })
      this.gruposService.cargarGruposAll().subscribe((resp: CargarGrupos) => {
        this.grupos = resp.grupos
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
          this.loading = false
        })
    } else if (this.rol === this.SLN || this.rol === this.ANF) {
      this.fiestasService.cargarFiestasByEmail(this.email).subscribe((resp: CargarFiestas) => {
        this.fiestas = this.functionsService.getActivos(resp.fiestas)

      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
          this.loading = false
        })
      this.gruposService.cargarGruposByEmail(this.email).subscribe((resp: CargarGrupos) => {
        this.grupos = this.functionsService.getActivos(resp.grupos)
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
          this.loading = false
        })
    }
  }
  get errorControl() {
    return this.form.controls;

  }

  createForm() {
    this.form = this.fb.group({
      fiesta: ['', [Validators.required]],
      llena: [false],
      invitados: this.fb.array([]),
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  get invitados(): FormArray {
    return this.form.get('invitados') as FormArray
  }

  newInvitado(): FormGroup {
    return this.fb.group({
      grupo: ['', [Validators.required]],
      nombreGrupo: ['', [Validators.required]],
      whatsapp: [''],
      email: [''],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      ocupados: [0],
      confirmado: [false],

    })
  }
  selectNumero(event: any) {

    this.numeroInvitados = this.functionsService.getValueCatalog(event.target.value, 'cantidad', this.fiestas)

  }
  cuentaInvitados(event: any) {
    this.numeroInvitados = this.numeroInvitados - Number(event.target.value)
  }
  addInvitados() {
    this.invitados.push(this.newInvitado())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeInvitados(i: number) {
    this.invitados.removeAt(i);
  }

  onSubmit() {
    this.loading = true

    this.submited = true
    if (this.form.valid) {
      this.boletosService.crearBoleto(this.form.value).subscribe((resp: any) => {
        this.fiestasService.cargarFiestaById(resp.boleto.fiesta).subscribe((resp) => {
          let fiesta = resp.fiesta
          fiesta.realizada = true
          fiesta.usuarioCreated = undefined
          fiesta.lastEdited = this.functionsService.getToday()
          this.fiestasService.actualizarFiesta(fiesta).subscribe(resp => {
            this.functionsService.navigateTo('core/boletos/vista-boletos')
            this.loading = false
          })
        })
        return
        //Message
      },
        (error) => {
          //Message
          this.loading = false
          this.functionsService.alertError(error, 'Boletos')

        })
    } else {

      //Message
      this.loading = false
      return console.log('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/boletos/vista-boletos')
  }
  get total() {
    var total = 0
    this.form.value.invitados.forEach((c: any) => {
      total = total + Number(c.cantidad)
    });

    return total


  }

}
