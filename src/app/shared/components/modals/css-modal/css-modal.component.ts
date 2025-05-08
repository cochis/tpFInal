import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { Css } from 'src/app/core/models/css.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-css-modal',
  templateUrl: './css-modal.component.html',
  styleUrls: ['./css-modal.component.scss']
})
export class CssModalComponent {
  @Input() model: any;
  @Output() sendRes: EventEmitter<any>;
  closeResult: string;
  data: Css
  url = environment.base_url
  constructor(private readonly _modalReference: ModalReference<Css>
  ) {
    this.sendRes = new EventEmitter();
    this.data = this._modalReference.config.model


  }
}
