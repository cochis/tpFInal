import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { error } from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class MapsService {
  public userLocation?: [number, number]

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }
  constructor(
    private functionsService: FunctionsService
  ) {
    this.getUserLocation()
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
