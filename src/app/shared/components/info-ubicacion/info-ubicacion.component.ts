import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-ubicacion',
  templateUrl: './info-ubicacion.component.html',
  styleUrls: ['./info-ubicacion.component.css']
})
export class InfoUbicacionComponent {

  constructor(

    private modalService: NgbModal,
  ) {

  }
  showInfo(content) {
    this.modalService.open(content, { fullscreen: true });
  }
}
