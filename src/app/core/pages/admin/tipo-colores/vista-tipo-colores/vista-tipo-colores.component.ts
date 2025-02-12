import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { TipoColor } from 'src/app/core/models/tipoColor.model';
import { CargarTipoColors } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-vista-tipo-colores',
  templateUrl: './vista-tipo-colores.component.html',
  styleUrls: ['./vista-tipo-colores.component.css']
})
export class VistaTipoColoresComponent {
  data!: any
  tipoColors: TipoColor[] = []
  tipoColorsTemp: TipoColor[] = []
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

    private tipoColorsService: TipoColorsService
  ) {
    this.getTipoColors()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoColors = this.tipoColorsTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoColorsTemp)
      this.tipoColors = this.functionsService.filterBy(termino, this.tipoColorsTemp)
    }, 500);
  }

  getTipoColors() {
    this.loading = true

    this.tipoColorsService.cargarTipoColorsAll().subscribe((resp: CargarTipoColors) => {



      this.tipoColors = resp.tipoColors
      this.tipoColorsTemp = resp.tipoColors
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.alertError(error, 'Tipo de Colors')
      });

  }

  editTipoColor(id: string) {

    this.functionsService.navigateTo(`core/tipo-colores/editar-tipo-color/true/${id}`)

  }
  isActived(tipoColor: TipoColor) {

    this.tipoColorsService.isActivedTipoColor(tipoColor).subscribe((resp: any) => {
      this.getTipoColors()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo de Colors')

      })
  }
  viewTipoColor(id: string) {
    this.functionsService.navigateTo(`core/tipo-colores/editar-tipo-color/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoColor() {

    this.functionsService.navigateTo('core/tipo-colores/crear-tipo-color')
  }

}
