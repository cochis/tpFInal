import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';
import { CargarTipoModulos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-tipo-modulos',
  templateUrl: './vista-tipo-modulos.component.html',
  styleUrls: ['./vista-tipo-modulos.component.scss']
})
export class VistaTipoModulosComponent {
  data!: any
  tipoModulos: TipoModulo[]
  tipoModulosTemp: TipoModulo[]
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

    private tipoModulosService: TipoModulosService
  ) {
    this.getTipoModulos()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoModulos = this.tipoModulosTemp
        return
      }
      this.busquedasService.buscar('tipoModulos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoModulos = resp


        this.setTipoModulos()
      })

    }, 500);
  }




  setTipoModulos() {
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
  getTipoModulos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.tipoModulosService.cargarTipoModulosAll().subscribe((resp: CargarTipoModulos) => {

        this.tipoModulos = resp.tipoModulos

        this.tipoModulosTemp = resp.tipoModulos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'TipoModulos')
        });
    }
  }

  editTipoModulo(id: string) {

    this.functionsService.navigateTo(`/core/tipo-modulos/editar-tipo-modulo/true/${id}`)

  }
  isActived(tipoModulo: TipoModulo) {

    this.tipoModulosService.isActivedTipoModulo(tipoModulo).subscribe((resp: any) => {
      this.getTipoModulos()


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'TipoModulos')

      })
  }
  viewTipoModulo(id: string) {
    this.functionsService.navigateTo(`/core/tipo-modulos/editar-tipo-modulo/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoModulo() {

    this.functionsService.navigateTo('tipo-modulos/crear-tipo-modulo')
  }

}
