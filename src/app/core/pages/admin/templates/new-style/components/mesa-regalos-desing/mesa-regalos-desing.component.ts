import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mesa-regalos-desing',
  templateUrl: './mesa-regalos-desing.component.html',
  styleUrls: ['./mesa-regalos-desing.component.scss']
})
export class MesaRegalosDesingComponent {
  @Input() data: any
  @Input() bgsframes: any
  url = environment.base_url


  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
