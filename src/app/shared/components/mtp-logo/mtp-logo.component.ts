import { Component } from '@angular/core';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-mtp-logo',
  templateUrl: './mtp-logo.component.html',
  styleUrls: ['./mtp-logo.component.css']
})
export class MtpLogoComponent {

  constructor(
    private mapsService: MapsService
  ) {

  }

  gotoMyLocation() {

    if (!this.mapsService.isUserLocationReady) throw Error('No hay ubicacion de usuario')
    if (!this.mapsService.isMapReady) throw Error('No hay mapa disponible')
    this.mapsService.flyTo(this.mapsService.getMap(), this.mapsService.userLocation)
  }
}
