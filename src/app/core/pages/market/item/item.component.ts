import { AfterViewInit, Component, Input } from '@angular/core';
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
  @Input() item: any;
  @Input() cP: any = this.CP;
  @Input() cS: any = this.CS;
  loading: boolean = false
  PRODUCTO = environment.tiProducto
  SERVICIO = environment.tiServicio
  url = environment.base_url
  constructor() {
    this.loading = true




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
