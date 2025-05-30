import { AfterViewInit, Component, Input } from '@angular/core';
import { CargarSalons, CargarTipoMedias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Salon } from 'src/app/core/models/salon.model';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
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
  salons: Salon[]
  descripcionHTML: SafeHtml;
  constructor(
    private tipoMediasService: TipoMediasService,
    private functionsService: FunctionsService,
    private salonsService: SalonsService,
    private sanitizer: DomSanitizer,
  ) {
    this.loading = true


    this.getCatalogos()



  }
  getCatalogos() {
    this.tipoMediasService.cargarTipoMediasAll().subscribe((resp: CargarTipoMedias) => {
      this.tipoMedias = this.functionsService.getActivos(resp.tipoMedias)


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo de medios')
      })


    this.salonsService.cargarSalonsAll().subscribe((res: CargarSalons) => {
      this.salons = res.salons
    })

  }


  getUbicacionProveedor(id, type) {
    if (id && type && this.salons) {

      let res = this.salons.find(element => element.uid == id);

      switch (type) {
        case 'P':
          return res.pais
          break;
        case 'E':
          return res.estado
          break;
        case 'C':
          return res.coloniaBarrio
          break;

        default:
          return ''
          break;
      }
    } else {
      return ''
    }

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      ;


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



  mayorMenor(items) {
    let mayor = 0
    let menor = items[0].precio

    for (var i = 0; i < items.length; i++) {

      if (i == 0) {

        menor = items[i].precio
      }
      if (mayor < items[i].precio) {
        mayor = items[i].precio;
      }

    }



    for (var i = 0; i < items.length; i++) {


      if (items[i].precio < mayor) {
        menor = items[i].precio;
      }
    }


    return [menor, mayor]
  }




  getPrecio(item) {


    var precios


    if (item.isByCantidad) {

      precios = this.mayorMenor(item.cantidades)
    }
    if (item.isByColor) {

      precios = this.mayorMenor(item.colores)
    }
    if (item.isByService) {

      precios = this.mayorMenor(item.servicios)
    }
    if (item.isBySize) {


      precios = this.mayorMenor(item.sizes)
    }


    return precios
  }
  convertDes(des: any) {

    let regexp = /<[^<>]+>/g;
    var desc = des
    let rgx: any = []
    rgx = des.match(regexp)
    if (rgx && rgx.length > 0) {
      rgx.forEach(el => {
        desc = desc.replace(el, ' ')
      });


      desc = desc.substr(0, 80) + '...'
      return this.sanitizer.bypassSecurityTrustHtml(desc);
    } else {
      return ''
    }
  }


  navigateT0(url: string) {


    this.functionsService.navigateTo(url)
  }
}
