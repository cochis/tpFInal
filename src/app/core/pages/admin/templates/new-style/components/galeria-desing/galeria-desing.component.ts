import { AfterViewInit, Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-galeria-desing',
  templateUrl: './galeria-desing.component.html',
  styleUrls: ['./galeria-desing.component.scss']
})
export class GaleriaDesingComponent implements AfterViewInit {
  @Input() data: any

  constructor(
    private functionsService: FunctionsService
  ) {

  }
  ngAfterViewInit(): void {


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
