import { Component, OnDestroy, OnInit } from '@angular/core';
import { CargarEventos, CargarFiestas, CargarRoles, CargarSalons, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { HttpClient } from '@angular/common/http';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { Role } from 'src/app/core/models/role.model';
import { Salon } from 'src/app/core/models/salon.model';
import { environment } from 'src/environments/environment';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { EventosService } from 'src/app/core/services/evento.service';
import { Evento } from 'src/app/core/models/evento.model';
@Component({
  selector: 'app-vista-fiestas',
  templateUrl: './vista-fiestas.component.html',
  styleUrls: ['./vista-fiestas.component.css']
})
export class VistaFiestasComponent {
  data!: any
  fiestas: Fiesta[] = [];
  fiestasTemp: Fiesta[] = [];
  roles: Role[]
  eventos: Evento[]
  salones: Salon[]
  usuario: Usuario
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')
  cantidadFiestas = 0
  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private http: HttpClient,
    private busquedasService: BusquedasService,
    private salonesService: SalonsService,
    private rolesService: RolesService,
    private eventosService: EventosService,
    private fiestasService: FiestasService,

  ) {

    this.getCatalogos()
    setTimeout(() => {
      this.getUser()
      this.getFiestas()
    }, 800);
  }
  getUser() {
    if (this.rol !== 'ADMROL') {
      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
        this.usuario = resp.usuario
        this.cantidadFiestas = resp.usuario.cantidadFiestas
      })
    } else {
      this.cantidadFiestas = -1
    }
  }
  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.fiestas = this.fiestasTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.fiestas = this.functionsService.filterBy(termino, this.fiestasTemp)
    }, 500);
  }
  buscarCatalogo(tipo: string, value) {
    if (value == '') {
      this.fiestas = this.fiestasTemp
      this.setFiestas()
    }
    switch (tipo) {
      case 'evento':
        this.busquedasService.buscarCatalogo('fiestas', value).subscribe((resp) => {
          this.fiestas = resp
          this.setFiestas()
        })
        break;
    }
  }
  getCatalogos() {
    this.loading = true
    if (this.rol == 'ADMROL') {
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = resp.eventos
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
        this.salones = resp.salons
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
    } else {
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
        this.eventos = resp.eventos
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
      this.salonesService.cargarSalonByMail(this.email).subscribe((resp: CargarSalons) => {
        this.salones = resp.salons
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Fiestas')
          this.loading = false
        })
    }
  }
  comprarPaquete() {
    this.functionsService.navigateTo(`/core/compras/crear-compra/${this.uid}`)
  }
  setFiestas() {
    this.loading = true
    setTimeout(() => {
      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false
    }, 500);
  }
  getFiestas() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        this.loading = false
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Eventos')
        });
    } else if (this.rol === this.SLN || this.rol === this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      // console.log('usr', usr)
      this.fiestasService.cargarFiestasByEmail(usr).subscribe((resp: CargarFiestas) => {
        // console.log('resp', resp)
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
        setTimeout(() => {
          this.loading = false
        }, 1500);
      });
    }
  }
  getCatalog(tipo: string, id: string) {
    switch (tipo) {
      case 'evento':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.eventos)
        break;
      case 'salon':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.salones)
        break;
    }
  }
  editFiesta(id: string) {
    this.functionsService.navigateTo(`/core/fiestas/editar-fiesta/true/${id}`)
  }
  isActived(fiesta: Fiesta) {
    this.fiestasService.isActivedFiesta(fiesta).subscribe((resp: any) => {
      this.getFiestas()
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Fiestas')
      })
  }
  viewFiesta(id: string) {
    this.functionsService.navigateTo(`/core/fiestas/editar-fiesta/false/${id}`)
  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newFiesta() {
    this.functionsService.navigateTo('core/fiestas/crear-fiesta')
  }
  typeOf(val) {
    return typeof (val)
  }
}
