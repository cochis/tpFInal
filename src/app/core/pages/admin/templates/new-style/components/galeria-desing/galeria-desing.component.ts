import { AfterViewInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Parallax from 'parallax-js';
@Component({
  selector: 'app-galeria-desing',
  templateUrl: './galeria-desing.component.html',
  styleUrls: ['./galeria-desing.component.scss']
})
export class GaleriaDesingComponent implements AfterViewInit {
  @Input() data: any
  @ViewChild('scene1', { static: false }) scene1!: ElementRef;
  @ViewChild('scene2', { static: false }) scene2!: ElementRef;
  @ViewChild('scene3', { static: false }) scene3!: ElementRef;
  constructor(
    private functionsService: FunctionsService
  ) {

  }
  ngAfterViewInit(): void {
    new Parallax(this.scene1.nativeElement);
    new Parallax(this.scene2.nativeElement);
    new Parallax(this.scene3.nativeElement);

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
