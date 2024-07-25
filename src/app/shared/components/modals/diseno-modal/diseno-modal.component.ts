import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalReference } from '@developer-partners/ngx-modal-dialog';
import { Diseno } from 'src/app/core/models/diseno.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-diseno-modal',
  templateUrl: './diseno-modal.component.html',
  styleUrls: ['./diseno-modal.component.css']
})
export class DisenoModalComponent {
  @Input() model: any;
  @Output() sendRes: EventEmitter<any>;
  closeResult: string;
  data: Diseno
  url = environment.base_url
  constructor(private readonly _modalReference: ModalReference<Diseno>
  ) {
    this.sendRes = new EventEmitter();
    this.data = this._modalReference.config.model
    // // console.log('this.data', this.data)

  }
}
