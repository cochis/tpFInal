import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-galeria-desing',
  templateUrl: './galeria-desing.component.html',
  styleUrls: ['./galeria-desing.component.css']
})
export class GaleriaDesingComponent {
  @Input() data: any
  url = environment.base_url

  imgSelect = ''
  viewImg = false

  selectImg(img) {
    this.imgSelect = img
    this.viewImg = true
  }



  close() {
    this.viewImg = false
    this.imgSelect = ''
  }
}
