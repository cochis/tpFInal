import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MapsService } from '../../services/maps.service';
import { Map, Popup, Marker, LngLat } from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  @Output() coordenadas!: EventEmitter<object>;
  @Output() coordenadasSelect!: EventEmitter<object>;
  @Output() idMap!: EventEmitter<object>;
  @Input() sendCoords!: [number, number];
  @Input() isEdit!: boolean;
  @Input() showBar!: boolean;
  @Input() type!: string;
  @ViewChild('mapDiv') mapDivElement?: ElementRef
  mapID: any
  userLocation: any
  @Input() $coords: any
  constructor(
    private mapService: MapsService
  ) {
    this.coordenadas = new EventEmitter()
    this.coordenadasSelect = new EventEmitter()
    this.idMap = new EventEmitter()
    this.mapService.userLocation = mapService.userLocation
  }
  classMap = 'map-expand'
  map!: any
  maker2!: any
  makerMe!: any
  CP = environment.cPrimary
  CS = environment.cSecond

  ngAfterViewInit(): void {


    if (this.sendCoords) {

      this.map = new Map({
        container: this.mapDivElement.nativeElement, // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: [this.sendCoords[0], this.sendCoords[1]], // starting position [lng, lat]
        zoom: 14, // starting zoom
      });

      const popup = new Popup()
        .setHTML(`
          <h6> Mi Ubicación</h6>
          <span> Estoy en este lugar</span>
          `);
      let makerBase = new Marker({ color: this.CP })
        .setLngLat(this.sendCoords)
        .setPopup(popup)
        .addTo(this.map)
      const popup2 = new Popup()
        .setHTML(`
      <h6> Nueva Ubicación</h6>   
        `);

      this.mapService.setMap(this.map)
    } else {
      this.map = new Map({
        container: this.mapDivElement.nativeElement, // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: this.mapService.userLocation, // starting position [lng, lat]
        zoom: 14, // starting zoom
      });

      const popup = new Popup()
        .setHTML(`
        <h6> Mi Ubicación</h6>
        <span> Estoy en este lugar</span>
        `);

      let makerBase = new Marker({ color: this.CP })
        .setLngLat(this.mapService.userLocation)
        .setPopup(popup)
        .addTo(this.map)
    }
    if (this.map) {

      this.mapID = this.map
    }



  }

  getCoords() {
    this.map.on('click', (e) => {
      const coords: any = e.lngLat.wrap()
      this.newMaker(coords)
    });
  }
  newMaker(coords: any) {
    let res = {
      ...coords,
      type: this.type
    }
    this.coordenadas.emit(res)
    if (this.maker2) {
      this.maker2.remove();
    }
    const popup = new Popup()
      .setHTML(`
      <h6> Nueva Ubicación</h6>   
        `);
    this.maker2 = new Marker({ color: this.CS, rotation: 45 })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(this.map)
  }
  chageClass() {

    if (this.classMap == '.map-container') {
      this.classMap = '.map-expand'
    } else {
      this.classMap = '.map-container'

    }

  }
  showCoordenadas(event) {


    this.coordenadasSelect.emit(event)
  }
}
