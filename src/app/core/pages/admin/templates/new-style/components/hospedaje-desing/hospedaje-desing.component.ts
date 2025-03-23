import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hospedaje-desing',
  templateUrl: './hospedaje-desing.component.html',
  styleUrls: ['./hospedaje-desing.component.css']
})
export class HospedajeDesingComponent implements AfterViewInit {
  @Input() data: any
  hospedaje: any
  url = environment.base_url
  ngAfterViewInit() {

    this.hospedaje = {
      hospedajeAddress: this.data.hospedajeAddress,
      hospedajeCheck: this.data.hospedajeCheck,
      hospedajeIcon: this.data.hospedajeIcon,
      hospedajeImg: this.data.hospedajeImg,
      hospedajeName: this.data.hospedajeName,
      hospedajePhone: this.data.hospedajePhone,
      hospedajeUbicacion: this.data.hospedajeUbicacion,
      hospedajeUbicacionLat: this.data.hospedajeUbicacionLat,
      hospedajeUbicacionLng: this.data.hospedajeUbicacionLng,
    }

  }
}
