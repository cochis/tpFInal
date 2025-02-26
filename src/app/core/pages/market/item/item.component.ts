import { AfterViewInit, Component, Input } from '@angular/core';
import { CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements AfterViewInit {
  CP = environment.cPrimary
  CS = environment.cSecond
  CW = '#ffffff'
  tipoMedias: TipoMedia[]
  @Input() item: any;
  @Input() cP: any = this.CP;
  @Input() cS: any = this.CS;
  loading: boolean = false
  PRODUCTO = environment.tiProducto
  SERVICIO = environment.tiServicio
  url = environment.base_url
  constructor(
    private tipoMediasService: TipoMediasService,
    private functionsService: FunctionsService,
  ) {
    this.loading = true
    this.getCatalogos()



  }
  getCatalogos() {
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {
      this.tipoMedias = this.functionsService.getActivos(resp.tipoMedias)


    },
      (error) => {
        // console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de medios')
      })

  }
  ngAfterViewInit(): void {
    setTimeout(() => {

      this.loading = false
      this.item.photos.sort(function (x, y) {
        return (x === y) ? 0 : x ? 1 : -1;
      });

    }, 200);

  }
  getImgPrincipal(photos) {

    let fotos = photos.filter((pic) => { return pic.isPrincipal })
    let foto = fotos[0]

  }

  viewPhoto(id) {


    this.item.photos.forEach(pic => {
      if (pic.img === id) {
        pic.isPrincipal = true
      } else {

        pic.isPrincipal = false
      }

    });

  }


  opcSeleccion(itm, item) {



  }

  getTypeItem(type) {

    if (type == this.PRODUCTO) {
      return 'P'
    } else {

      return 'S'
    }
  }
}
