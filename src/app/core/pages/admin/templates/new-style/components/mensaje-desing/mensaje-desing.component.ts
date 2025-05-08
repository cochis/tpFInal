import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje-desing',
  templateUrl: './mensaje-desing.component.html',
  styleUrls: ['./mensaje-desing.component.scss']
})
export class MensajeDesingComponent {
  @Input() data: any
}
