import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-padrinos-desing',
  templateUrl: './padrinos-desing.component.html',
  styleUrls: ['./padrinos-desing.component.css']
})
export class PadrinosDesingComponent implements AfterViewInit {
  @Input() data: any
  padrinos = []
  @Input() bgsframes: any
  url = environment.base_url
  ngAfterViewInit() {


    this.padrinos = (typeof (this.data.padrinos) == 'string') ? JSON.parse(this.data.padrinos) : this.data.padrinos


  }
  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
