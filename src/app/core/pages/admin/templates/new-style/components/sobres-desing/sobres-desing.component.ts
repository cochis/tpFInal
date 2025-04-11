import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sobres-desing',
  templateUrl: './sobres-desing.component.html',
  styleUrls: ['./sobres-desing.component.css']
})
export class SobresDesingComponent {
  @Input() data: any
  url = environment.base_url
  viewDatosOk = false


  verDatos() {
    this.viewDatosOk = !this.viewDatosOk
  }
}
