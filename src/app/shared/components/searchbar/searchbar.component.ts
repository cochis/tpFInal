import { Component, EventEmitter, Output } from '@angular/core';
import { clear } from 'console';
import { MapsService } from '../../services/maps.service';
import { PlacesResponse } from 'src/app/core/interfaces/places';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  private dobounceTimer?: NodeJS.Timeout
  loadingPlaces = false
  places = []
  @Output() coordenadas!: EventEmitter<object>;
  constructor(
    private mapsService: MapsService,
  ) { this.coordenadas = new EventEmitter() }

  onQueryChanged(txt: string = '') {
    if (txt.length === 0) {
      this.loadingPlaces = false
      this.places = []
      return
    }



    this.loadingPlaces = true
    if (this.dobounceTimer) clearTimeout(this.dobounceTimer)
    this.dobounceTimer = setTimeout(() => {

      this.mapsService.getPlaces(txt).subscribe((res: any) => {

        this.loadingPlaces = false

        this.places = res.features

        this.mapsService.createMarkersFromPlaces(this.places)


        if (res.features.length == 0) {
          this.loadingPlaces = false
          this.places = undefined
        }
      }),
        (error) => {
          this.loadingPlaces = false
          console.error(error)
        }

    }, 500);
  }
  showCoordenadas(event) {

    this.coordenadas.emit(event)

  }
}
