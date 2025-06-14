import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sobres-desing',
  templateUrl: './sobres-desing.component.html',
  styleUrls: ['./sobres-desing.component.scss']
})
export class SobresDesingComponent {
  @Input() data: any
  @Input() bgsframes: any
  url = environment.base_url
  viewDatosOk = false


  verDatos() {
    this.viewDatosOk = !this.viewDatosOk
  }

  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
