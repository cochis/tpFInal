import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-programa-desing',
  templateUrl: './programa-desing.component.html',
  styleUrls: ['./programa-desing.component.css']
})
export class ProgramaDesingComponent implements AfterViewInit {
  @Input() data: any
  url = environment.base_url
  programas = []
  @Input() bgsframes: any

  ngAfterViewInit() {

    this.programas = (typeof (this.data.itinerarios) == 'string') ? JSON.parse(this.data.itinerarios) : this.data.itinerarios
    this.programas = JSON.parse(this.data.itinerarios)


  }
  getImg(img) {

    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
