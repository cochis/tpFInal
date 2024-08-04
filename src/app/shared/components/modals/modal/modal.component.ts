import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Galeria } from 'src/app/core/models/galeria.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],

})
export class ModalComponent {
  @Input() model: any;
  @Output() sendRes: EventEmitter<any>;
  closeResult: string;
  img: Galeria
  url = environment.base_url
  constructor(private readonly _modalReference: ModalReference<Galeria>
  ) {
    this.sendRes = new EventEmitter();
    this.img = this._modalReference.config.model

  }
}
