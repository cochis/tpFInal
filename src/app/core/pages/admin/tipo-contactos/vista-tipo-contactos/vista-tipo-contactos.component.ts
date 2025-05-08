import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-tipo-contactos',
  templateUrl: './vista-tipo-contactos.component.html',
  styleUrls: ['./vista-tipo-contactos.component.scss']
})
export class VistaTipoContactosComponent {
  data!: any
  tipoContactos: TipoContacto[] = []
  tipoContactosTemp: TipoContacto[] = []
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')


  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,

    private tipoContactosService: TipoContactosService
  ) {
    this.getTipoContactos()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoContactos = this.tipoContactosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoContactosTemp)
      this.tipoContactos = this.functionsService.filterBy(termino, this.tipoContactosTemp)
    }, 500);
  }




  setTipoContactos() {
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
  getTipoContactos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.tipoContactosService.cargarTipoContactosAll().subscribe((resp: CargarTipoContactos) => {


        this.tipoContactos = resp.tipoContactos
        this.tipoContactosTemp = resp.tipoContactos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Tipo de Contactos')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.tipoContactosService.cargarTipoContactosByEmail(usr).subscribe((resp: CargarTipoContactos) => {

        this.tipoContactos = resp.tipoContactos
        this.tipoContactosTemp = resp.tipoContactos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editTipoContacto(id: string) {

    this.functionsService.navigateTo(`core/tipo-contactos/editar-tipo-contacto/true/${id}`)

  }
  isActived(tipoContacto: TipoContacto) {

    this.tipoContactosService.isActivedTipoContacto(tipoContacto).subscribe((resp: any) => {
      this.getTipoContactos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo de Contactos')

      })
  }
  viewTipoContacto(id: string) {
    this.functionsService.navigateTo(`core/tipo-contactos/editar-tipo-contacto/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoContacto() {

    this.functionsService.navigateTo('core/tipo-contactos/crear-tipo-contacto')
  }

}
