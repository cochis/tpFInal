import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements AfterViewInit {
  loading = false
  @Input() sendCoords: [number, number] = undefined;
  @Input() isEditV!: boolean;
  @Input() type!: string;
  @Output() coordenadas!: EventEmitter<object>;
  @Output() coordenadasSelect!: EventEmitter<object>;
  constructor(
    private mapService: MapsService
  ) {
    this.coordenadas = new EventEmitter()
    this.coordenadasSelect = new EventEmitter()
  }
  ngAfterViewInit(): void {

  }

  get isUserLocationReady() {

    return this.mapService.getUserLocation

  }
  showCoordenadas($e) {



    let res = {
      ...$e,
      type: this.type
    }


    this.coordenadas.emit(res)

  }


  showMapSelected(event) {
    this.coordenadasSelect.emit(event)

  }

}
