import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements AfterViewInit {
  @Input() data: any
  @Input() bgsframes: any
  @Output() view!: EventEmitter<boolean>;
  url = environment.base_url

  constructor(private functionsService: FunctionsService) {
    this.view = new EventEmitter()
    setTimeout(() => {
      this.setClass()
    }, 1500);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.functionsService.scroolTo('end')
    }, 1800)

  }




  setClass() {
    document.getElementById('imgPresentacion').classList.add('animate__animated');
    /* document.getElementById('imgPresentacion').classList.add('animate__fadeIn'); */
    document.getElementById('imgPresentacion').classList.add('animate__fadeInDownBig');
    document.getElementById('imgPresentacion').classList.remove('dn');
  }


  closePresentacion() {
    this.view.emit(true)
  }
  getImg(img) {
    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
