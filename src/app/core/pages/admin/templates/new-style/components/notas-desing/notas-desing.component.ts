import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notas-desing',
  templateUrl: './notas-desing.component.html',
  styleUrls: ['./notas-desing.component.scss']
})
export class NotasDesingComponent {
  @Input() data: any
  url = environment.base_url
  notas = []
  @Input() bgsframes: any
  ngAfterViewInit() {

    this.notas = (typeof (this.data.notas) == 'string') ? JSON.parse(this.data.notas) : this.data.notas




  }
  getImg(img) {

    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
