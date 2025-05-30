import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-principal-template-desing',
  templateUrl: './principal-template-desing.component.html',
  styleUrls: ['./principal-template-desing.component.scss']
})
export class PrincipalTemplateDesingComponent implements AfterViewInit {
  @Input() data: any
  @Input() bgsframes: any
  @Input() fiesta: any
  padres = undefined
  url = environment.base_url
  constructor() {
    document.body.scrollTop = 0;

    document.documentElement.scrollTop = 0;

  }
  ngAfterViewInit() {
    this.padres = (typeof (this.data.padres) == 'string') ? JSON.parse(this.data.padres) : this.data.padres




  }
  getImg(img) {
    img = img.toLowerCase().trim()

    let imgR = this.bgsframes.filter(bgf => { return bgf.value.toLowerCase().trim() == img })

    return imgR[0].img

  }
}
