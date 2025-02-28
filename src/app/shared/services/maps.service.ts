import { Injectable } from '@angular/core';
import { FunctionsService } from './functions.service';
import { error } from 'jquery';
import { LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Feature, PlacesResponse } from 'src/app/core/interfaces/places';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  public map?: Map;
  public userLocation?: [number, number]
  /* public base_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places' */
  public base_url = 'https://api.mapbox.com/search/geocode/v6/forward?'
  public markers: Marker[] = []
  constructor(
    private http: HttpClient,
    private functionsService: FunctionsService,

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

  flyTo(map, coords: any) {



    if (!this.isMapReady) throw Error('El mapa no esta inicializado')
    map?.flyTo({
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
          navigator.geolocation.getCurrentPosition((data) => { }, (err) => console.error(err))
          /*        this.functionsService.alertError(err, 'error') */
        }
      )
    })
  }


  getPlaces(query: string = '') {


    query = this.base_url + 'q=' + encodeURI(query) + '&proximity=' + this.userLocation[0] + '%2C' + this.userLocation[1] + '&access_token=pk.eyJ1IjoiY29jaGlzIiwiYSI6ImNsb2c0M3NxNDByazEya3Jydmc2amtrNTcifQ.j0MCmbfTjEUQMtby7r42Cw'
    return this.http.get<PlacesResponse>(query)


  }

  createMarkersFromPlaces(map, places: Feature[]) {

    if (!this.map) throw Error('Mapa nop inicializado')
    this.markers.forEach(marker => marker.remove());
    const newMarkers = []
    for (const place of places) {
      const [lgn, lat] = place.geometry.coordinates
      const popup = new Popup()
        .setHTML(`
        <h6>${place.properties.name}</h6>
        <span>${place.properties.place_formatted}</span>

        `)

      const newMarker = new Marker()
        .setLngLat([lgn, lat])
        .setPopup(popup)
        .addTo(map)

      newMarkers.push(newMarker)
    }
    this.markers = newMarkers
  }


  getMap() {

    return this.map._mapId
  }

  deleteKaker() {
    this.markers.forEach(marker => marker.remove());
  }

}
