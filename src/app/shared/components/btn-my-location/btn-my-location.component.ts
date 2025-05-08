import { Component } from '@angular/core';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.scss']
})
export class BtnMyLocationComponent {

  constructor(
    private mapsService: MapsService
  ) {

  }

  gotoMyLocation() {
    if (!this.mapsService.isUserLocationReady) throw Error('No hay ubicacion de usuario')
    if (!this.mapsService.isMapReady) throw Error('No hay mapa disponible')
    this.mapsService.flyTo(this.mapsService.getMap(), this.mapsService.userLocation!)
  }
}
