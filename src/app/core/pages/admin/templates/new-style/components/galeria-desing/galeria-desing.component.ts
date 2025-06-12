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

  constructor(
    private functionsService: FunctionsService
  ) {

  }
  ngAfterViewInit(): void {
    console.log(this.data);
    
    // Detectar si se necesita permiso (solo iOS Safari)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            this.initParallax();
          }
        })
        .catch(console.error);
    } else {
      this.initParallax(); // Android o navegadores que no requieren permiso
    }
  }
  initParallax() {
    const scenes = document.querySelectorAll('.parallax-scene');
    scenes.forEach(scene => {
      new Parallax(scene as HTMLElement, {
        relativeInput: false,
        gyroscope: true,
        hoverOnly: false,
        clipRelativeInput: true
      });
    });
  }
  url = environment.base_url

  imgSelect = ''
  viewImg = false

  selectImg(img) {
    console.log("img: ", img);
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
