import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarBoletos, CargarFiestas, CargarGrupos, CargarInvitacions, CargarSalons } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Invitacion } from 'src/app/core/models/invitacion.model';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { CargarUsuarios } from '../../../interfaces/cargar-interfaces.interfaces';
import { BoletosService } from 'src/app/core/services/boleto.service';
@Component({
  selector: 'app-borrado',
  templateUrl: './borrado.component.html',
  styleUrls: ['./borrado.component.css']
})
export class BorradoComponent {
  loading = false
  roles: Role[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  boleto: Boleto
  boletos: Boleto[]
  fiesta: Fiesta
  fiestas: Fiesta[]
  invitacion: Invitacion
  invitacions: Invitacion[]
  salon: Salon
  salons: Salon[]
  usuario: Usuario
  usuarios: Usuario[]
  items: any
  itemsTemp: any
  typeSelect = ''
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private boletosService: BoletosService,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private salonsService: SalonsService,
    private usuariosService: UsuariosService,


  ) {
    this.loading = true
    this.createForm()
    this.getCatalogos()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }


  getCatalogos() {
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = this.functionsService.getActives(resp.usuarios)
      console.log('this.usuarios', this.usuarios)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
        this.loading = false
      })
    this.invitacionsService.cargarInvitacionsAll().subscribe((resp: CargarInvitacions) => {
      this.invitacions = this.functionsService.getActives(resp.invitacions)
      console.log('this.invitacions', this.invitacions)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Invitaciones')
        this.loading = false
      })
    this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
      this.fiestas = this.functionsService.getActives(resp.fiestas)
      console.log('this.fiestas', this.fiestas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Fiestas')
        this.loading = false
      })
    this.salonsService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
      this.salons = this.functionsService.getActives(resp.salons)
      console.log('this.salons', this.salons)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Salones')
        this.loading = false
      })
    this.boletosService.cargarBoletosAll().subscribe((resp: CargarBoletos) => {
      this.boletos = this.functionsService.getActives(resp.boletos)
      console.log('this.boletos', this.boletos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })

  }

  createForm() {
    this.form = this.fb.group({
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      entidad: ['', [Validators.required, Validators.minLength(3)]],

    })
  }
  filterFunction(search) {
    console.log('search', search)
    this.items = this.itemsTemp
    var res: any
    search = search.toLowerCase()
    if (this.typeSelect == '1') {

      res = this.items.filter((item: any) => {
        console.log('item', item.nombre.toLowerCase())
        return (
          item.nombre.toLowerCase().includes(search) ||
          item.apellidoPaterno.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search) ||
          item.apellidoMaterno.toLowerCase().includes(search)
        )
      })

      console.log('res', res)
      this.items = res

    }
    else if (this.typeSelect == '2') {

      res = this.items.filter((item: any) => {
        console.log('item', item.nombre.toLowerCase())
        return (
          item.nombre.toLowerCase().includes(search) ||
          item.direccion.toLowerCase().includes(search) ||
          item.calle.toLowerCase().includes(search) ||
          item.numeroExt.toLowerCase().includes(search) ||
          item.numeroInt.toLowerCase().includes(search) ||
          item.municipioDelegacion.toLowerCase().includes(search) ||
          item.coloniaBarrio.toLowerCase().includes(search) ||
          item.cp.toLowerCase().includes(search) ||
          item.estado.toLowerCase().includes(search) ||
          item.pais.toLowerCase().includes(search) ||
          item.comoLlegar.toLowerCase().includes(search) ||


          item.email.toLowerCase().includes(search) ||
          item.ubicacionGoogle.toLowerCase().includes(search)

        )
      })

      console.log('res', res)
      this.items = res

    } else if (this.typeSelect == '3') {

      res = this.items.filter((item: any) => {
        console.log('item', item.nombre.toLowerCase())
        return (
          item.nombre.toLowerCase().includes(search) ||
          item.calle.toLowerCase().includes(search) ||
          item.numeroExt.toLowerCase().includes(search) ||
          item.numeroInt.toLowerCase().includes(search) ||
          item.municipioDelegacion.toLowerCase().includes(search) ||
          item.coloniaBarrio.toLowerCase().includes(search) ||
          item.estado.toLowerCase().includes(search) ||
          item.pais.toLowerCase().includes(search) ||
          item.comoLlegar.toLowerCase().includes(search)
        )
      })

      console.log('res', res)
      this.items = res

    } else if (this.typeSelect == '4') {

      res = this.items.filter((item: any) => {
        console.log('item', item)

        return (

          this.functionsService.getValueCatalog(item.fiesta, 'nombre', this.fiestas).toLowerCase().includes(search) ||
          item.tipoTemplate.toLowerCase().includes(search)
        )
      })

      console.log('res', res)
      this.items = res

    } else if (this.typeSelect == '5') {

      res = this.items.filter((item: any) => {
        console.log('item', item.nombre.toLowerCase())
        return (

          this.functionsService.getValueCatalog(item.salon, 'nombre', this.salons).toLowerCase().includes(search) ||
          item.tipoTemplate.toLowerCase().includes(search) ||
          item.cantidadInvitados.includes(Number(search)) ||
          item.email.toLowerCase().includes(search) ||
          item.mesa.toLowerCase().includes(search) ||
          item.nombreGrupo.toLowerCase().includes(search) ||
          item.fiesta.nombre.toLowerCase().includes(search)
        )
      })
    } else {

      this.items = this.itemsTemp

    }



  }
  changeTipo(tipo) {
    console.log('tipo', tipo)
    this.typeSelect = tipo
    switch (tipo) {
      case '1':
        this.items = this.usuarios
        this.itemsTemp = this.usuarios
        console.log('this.items', this.items)
        break;
      case '2':
        this.items = this.salons
        this.itemsTemp = this.salons
        console.log('this.items', this.items)
        break;
      case '3':
        this.items = this.fiestas
        this.itemsTemp = this.fiestas
        console.log('this.items', this.items)
        break;
      case '4':
        this.items = this.invitacions
        this.itemsTemp = this.invitacions
        console.log('this.items', this.items)
        break;
      case '5':
        this.items = this.boletos
        this.itemsTemp = this.boletos
        console.log('this.items', this.items)
        break;

      default:
        this.items = []
        break;
    }

  }

  onSubmit() {
    this.loading = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()
      // this.rolesService.crearRole(this.form.value).subscribe((resp: any) => {
      //   this.functionsService.alert('Roles', 'Rol creado', 'success')
      //   this.functionsService.navigateTo('core/roles/vista-roles')
      //   this.loading = false
      // },
      //   (error) => {
      //     this.functionsService.alertError(error, 'Roles')

      //     this.loading = false
      //     this.functionsService.alertError(error, 'Roles')

      //   })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Roles')
      return // console.log('Please provide all the required values!');
    }






  }

  back() {
    this.functionsService.navigateTo('core/roles/vista-roles')
  }

}

