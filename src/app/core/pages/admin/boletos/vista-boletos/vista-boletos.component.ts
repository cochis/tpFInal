import { Component, OnDestroy, OnInit } from '@angular/core';
import { CargarBoletos, CargarFiestas, CargarRoles, CargarSalon, CargarSalons, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
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
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { EmailsService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-vista-boletos',
  templateUrl: './vista-boletos.component.html',
  styleUrls: ['./vista-boletos.component.css']
})
export class VistaBoletosComponent {
  data!: any
  boletos: Boleto[] = [];
  boletosTemp: Boleto[] = [];
  fiestas: Fiesta[]
  fiestasTemp: Fiesta[]
  usuario: Usuario
  salon: Salon
  salons: Salon[]
  loading = false
  url = environment.base_url
  text_url = environment.text_url
  mail = this.functionsService.getLocal('uid')
  ADM = environment.admin_role
  SLN = environment.salon_role
  ANF = environment.anf_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')


  constructor(
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private usauriosService: UsuariosService,
    private salonsService: SalonsService,
    private busquedasService: BusquedasService,
    private boletosService: BoletosService,
    private emailsService: EmailsService,
  ) {

    this.getCatalogos()
    this.getBoletos()
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
      this.boletos = this.boletosTemp
      this.setBoletos()
    }
    switch (tipo) {
      case 'fiestas':
        this.busquedasService.buscarCatalogo('fiestas', value).subscribe((resp) => {
          this.boletos = resp
          this.setBoletos()
        })
        break;
    }
  }
  getCatalogos() {
    this.loading = true
    if (this.rol !== this.ADM) {
      this.fiestasService.cargarFiestasByEmail(this.mail).subscribe((resp: CargarFiestas) => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas

        this.loading = false
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
          this.loading = false
        })
    } else {
      this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
        this.fiestas = resp.fiestas
        this.fiestasTemp = resp.fiestas
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Boletos')
          this.loading = false
        })
    }
    this.salonsService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
      this.salons = resp.salons
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Salones')
        this.loading = false
      })
  }
  getUser(id) {
    this.usauriosService.cargarUsuarioById(id).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
      return this.usuario.nombre
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
  }
  getSalon(id) {
    this.salonsService.cargarSalonById(id).subscribe((resp: CargarSalon) => {
      this.salon = resp.salon
      return this.salon.nombre
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
        this.loading = false
      })
  }
  setBoletos() {
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
  getBoletos() {
    this.boletosService.cargarBoletosAll().subscribe((resp: any) => {
      this.boletos = resp.boletos
      // console.log(' this.boletos::: ', this.boletos);

      this.boletosTemp = resp.boletos
      this.loading = false
    },
      (error) => {
        // console.error('error::: ', error);
        this.functionsService.alertError(error, 'Boletos')
      });
  }
  fiterBoletos(fiesta) {
    // console.log('fiesta::: ', fiesta);
    let res = this.boletos.filter((bol: any) => {
      return bol.fiesta._id ? bol.fiesta._id : bol.fiesta.uid === fiesta
    })
    let cantidad = 0
    res.forEach(b => {
      cantidad = cantidad + b.cantidadInvitados
    });
    return cantidad
  }
  typeOf(val) {
    return typeof (val)
  }
  getCatalog(tipo: string, id: string) {
    if (id === undefined) return
    switch (tipo) {
      case 'fiesta':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.fiestas)
        break;
      case 'salon':
        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.salons)
        break;
      default:
        return " No se encontró"
        break
    }
  }
  editBoleto(id: string) {
    this.functionsService.navigateTo(`/core/boletos/editar-boleto/true/${id}`)
  }
  isActived(boleto: Boleto) {
    this.boletosService.isActivedBoleto(boleto).subscribe((resp: any) => {
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Boletos')
      })
  }
  viewBoleto(id: string) {
    this.functionsService.navigateTo(`/core/boletos/editar-boleto/false/${id}`)
  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newBoleto() {
    this.functionsService.navigateTo('core/boletos/crear-boleto')
  }
  getInvitados(invitados: any) {
    let totalInvitados = invitados.reduce((sum: any, value: any) => (typeof value.cantidad == "number" ? sum + value.cantidad : sum), 0);
    return totalInvitados
  }
  getPorcentaje(total, ocupados) {
    let res = (ocupados * 100) / total
    return res
  }
  EnviarInvitacionesCorreo(fiesta, reenviar) {
    let ind = 0
    let correos = []
    this.boletosService.cargarBoletoByFiesta(fiesta.uid).subscribe((resp: any) => {
      this.loading = true
      resp.boleto.forEach((bol, i) => {
        if (bol.email === '' || !bol.activated) {
          ind++
          return
        }
        let email = {
          to: bol.email,
          sender: 'info@cochisweb.com',
          fiesta: bol.fiesta,
          boleto: bol.uid,
          text_url: this.text_url
        }
        if (!reenviar) {
          this.emailsService.sendMail(email).subscribe((resEmail: any) => {
            correos.push(resEmail)
            ind++
            if (ind === resp.boleto.length) {
              this.loading = false
              this.functionsService.alert("Boletos", "Se han enviado las invitaciones por correo electronico", "success")
            }
          }, (error => {
            correos.push(error.error)
            ind++
          }))
        } else {
          this.emailsService.reSendMail(email).subscribe((resEmail: any) => {
            correos.push(resEmail)
            ind++
            if (ind === resp.boleto.length) {
              this.loading = false
              this.functionsService.alert("Boletos", "Se han enviado las invitaciones por correo electronico", "success")
            }
          }, (error) => {
            // console.error('error::: ', error);
            correos.push(error.error)
            ind++
          })
        }
      });
    })
  }
}
