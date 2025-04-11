import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-codigo-desing',
  templateUrl: './codigo-desing.component.html',
  styleUrls: ['./codigo-desing.component.css']
})
export class CodigoDesingComponent {
  @Input() data: any
  url = environment.base_url
}
