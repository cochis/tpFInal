import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-codigo-desing',
  templateUrl: './codigo-desing.component.html',
  styleUrls: ['./codigo-desing.component.css']
})
export class CodigoDesingComponent {
  @Input() data: any
}
