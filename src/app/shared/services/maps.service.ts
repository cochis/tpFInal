import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { error } from 'jquery';
import { LngLatLike, Map } from 'mapbox-gl';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private map?: Map;
  public userLocation?: [number, number]


  constructor(
    private functionsService: FunctionsService
  ) {
    this.getUserLocation()
  }
  get isMapReady() {
    return !!this.map
  }
  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  setMap(map: Map) {
    this.map = map
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado')
    this.map?.flyTo({
      zoom: 15,
      center: coords
    })
  }

  async getUserLocation(): Promise<[number, number]> {

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude]


          resolve(this.userLocation)
        },
        (err) => {
          console.error('err::: ', err);
          this.functionsService.alertError(err, 'error')
        }
      )
    })
  }






}
