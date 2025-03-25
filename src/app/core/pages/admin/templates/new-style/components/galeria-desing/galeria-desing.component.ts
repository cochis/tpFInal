import { Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-galeria-desing',
  templateUrl: './galeria-desing.component.html',
  styleUrls: ['./galeria-desing.component.css']
})
export class GaleriaDesingComponent {
  @Input() data: any

  constructor(
    private functionsService: FunctionsService
  ) {

  }
  url = environment.base_url

  imgSelect = ''
  viewImg = false

  selectImg(img) {
    this.imgSelect = img
    this.viewImg = true

    this.functionsService.scroolTo('vistaImgModal')
  }



  close() {
    this.viewImg = false
    this.imgSelect = ''
    setTimeout(() => {

      this.functionsService.scroolTo('vistaImgModal')
    }, 100);
  }
}
