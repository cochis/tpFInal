import { Component, Input, OnInit } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImgTemplate } from 'src/app/core/models/img.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.css']
})
export class ImagenComponent implements OnInit {
  @Input() model: any;
  url = environment.base_url
  obj: any
  constructor(private modalService: NgbModal,
    private readonly _modalReference: ModalReference<ImgTemplate>) {
    this.obj = this._modalReference.config.model

  }
  ngOnInit() {


  }
}
