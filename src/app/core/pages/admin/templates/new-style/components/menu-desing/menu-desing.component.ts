import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-desing',
  templateUrl: './menu-desing.component.html',
  styleUrls: ['./menu-desing.component.css']
})
export class MenuDesingComponent implements AfterViewInit {
  @Input() data: any
  @Input() bgsframes: any
  url = environment.base_url
  menus = []
  ngAfterViewInit() {
    this.menus = (typeof (this.data.menu) == 'string') ? JSON.parse(this.data.menu) : this.data.menu



  }

  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
