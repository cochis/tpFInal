import { Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mensaje-card',
  templateUrl: './mensaje-card.component.html',
  styleUrls: ['./mensaje-card.component.scss']
})
export class MensajeCardComponent {
  @Input() data: any
  today = this.functionsService.getToday()
  loading: boolean = false
  date: number = this.today + 199456789
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  url = environment.base_url
  cls = 'animate__fadeOutDown'
  vistaCroquis = false
  constructor(
    private functionsService: FunctionsService
  ) {
    this.loading = true

  }
  ngAfterViewInit(): void {


    setTimeout(() => {
      this.loading = false
    }, 800);
  }


}
