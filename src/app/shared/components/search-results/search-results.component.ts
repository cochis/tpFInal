import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature, PlacesResponse } from 'src/app/core/interfaces/places';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements AfterViewInit {
  @Input() places = undefined
  @Input() loading = false
  @Output() coordenadas!: EventEmitter<object>;
  selected = ''
  constructor(
    private mapsService: MapsService

  ) {
    this.coordenadas = new EventEmitter()

  }
  ngAfterViewInit() {


  }
  flyTo(place: Feature) {
    this.selected = place.id

    const [lng, lat] = place.geometry.coordinates
    this.coordenadas.emit([lng, lat])
    this.mapsService.flyTo([Number(lng), Number(lat)])
  }
}
