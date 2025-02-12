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
  @Input() sendCoords: [number, number];
  @ViewChild('mapDiv') mapDivElement?: ElementRef
  @Input() $coords: any
  constructor(
    private mapService: MapsService
  ) {
    this.coordenadas = new EventEmitter()
  }
  map!: any
  maker2!: any
  CP = environment.cPrimary
  CS = environment.cSecond
  ngAfterViewInit(): void {


    if (this.sendCoords) {




      this.map = new Map({
        container: this.mapDivElement.nativeElement, // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: this.sendCoords, // starting position [lng, lat]
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





    // Example of a MapTouchEvent of type "touch"



  }




  getCoords() {


    this.map.on('click', (e) => {

      const coords: any = e.lngLat.wrap()

      this.newMaker(coords)
    });


  }

  newMaker(coords: any) {

    this.coordenadas.emit(coords)
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


}
