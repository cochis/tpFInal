import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  img: String = ''
  constructor(private modalService: NgbModal) { }
  openXl(content, img) {

    this.modalService.open(content, { fullscreen: true });
    this.img = img
  }
}
