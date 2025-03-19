import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent {
  @Output() view!: EventEmitter<boolean>;


  constructor() {
    this.view = new EventEmitter()
    setTimeout(() => {
      this.setClass()
    }, 1500);
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
}
