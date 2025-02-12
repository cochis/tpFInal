import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
@Component({
  selector: 'app-vista-tipo-medias',
  templateUrl: './vista-tipo-medias.component.html',
  styleUrls: ['./vista-tipo-medias.component.css']
})
export class VistaTipoMediasComponent {
  data!: any
  tipoMedias: TipoMedia[] = []
  tipoMediasTemp: TipoMedia[] = []
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

    private tipoMediasService: TipoMediasService
  ) {
    this.getTipoMedias()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoMedias = this.tipoMediasTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoMediasTemp)
      this.tipoMedias = this.functionsService.filterBy(termino, this.tipoMediasTemp)
    }, 500);
  }

  getTipoMedias() {
    this.loading = true

    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {



      this.tipoMedias = resp.tipoMedias
      this.tipoMediasTemp = resp.tipoMedias
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.alertError(error, 'Tipo de Medias')
      });

  }

  editTipoMedia(id: string) {

    this.functionsService.navigateTo(`core/tipo-medios/editar-tipo-medio/true/${id}`)

  }
  isActived(tipoMedia: TipoMedia) {

    this.tipoMediasService.isActivedTipoMedia(tipoMedia).subscribe((resp: any) => {
      this.getTipoMedias()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo de Medias')

      })
  }
  viewTipoMedia(id: string) {
    this.functionsService.navigateTo(`core/tipo-medios/editar-tipo-medio/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newTipoMedia() {

    this.functionsService.navigateTo('core/tipo-medios/crear-tipo-medio')
  }

}

