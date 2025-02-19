import { Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listas-card',
  templateUrl: './listas-card.component.html',
  styleUrls: ['./listas-card.component.css']
})
export class ListasCardComponent {
  @Input() data: any
  @Input() type: string
  today = this.functionsService.getToday()
  loading: boolean = false
  url = environment.base_url
  padres = []
  padrinos = []
  chambelanes = []
  menu = []
  musica = []
  itinerarios = []
  notas = []
  constructor(
    private functionsService: FunctionsService
  ) {
    this.loading = true

  }
  ngAfterViewInit(): void {



    this.padres = (typeof (this.data.padres) == 'string') ? JSON.parse(this.data.padres) : this.data.padres
    this.padrinos = (typeof (this.data.padrinos) == 'string') ? JSON.parse(this.data.padrinos) : this.data.padrinos
    this.chambelanes = (typeof (this.data.chambelanes) == 'string') ? JSON.parse(this.data.chambelanes) : this.data.chambelanes
    this.menu = (typeof (this.data.menu) == 'string') ? JSON.parse(this.data.menu) : this.data.menu
    this.musica = (typeof (this.data.musica) == 'string') ? JSON.parse(this.data.musica) : this.data.musica
    this.itinerarios = (typeof (this.data.itinerarios) == 'string') ? JSON.parse(this.data.itinerarios) : this.data.itinerarios
    this.notas = (typeof (this.data.notas) == 'string') ? JSON.parse(this.data.notas) : this.data.notas




    setTimeout(() => {
      this.loading = false
    }, 800);
  }


}
