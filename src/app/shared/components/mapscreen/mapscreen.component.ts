import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements AfterViewInit {
  loading = false
  @Input() sendCoords: [number, number];
  @Output() coordenadas!: EventEmitter<object>;
  constructor(
    private mapService: MapsService
  ) {
    this.coordenadas = new EventEmitter()
  }
  ngAfterViewInit(): void {


  }

  get isUserLocationReady() {

    return this.mapService.getUserLocation

  }
  showCoordenadas($e) {

    this.coordenadas.emit($e)

  }
}
