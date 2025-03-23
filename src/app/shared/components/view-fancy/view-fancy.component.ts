import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-view-fancy',
  templateUrl: './view-fancy.component.html',
  styleUrls: ['./view-fancy.component.css']
})
export class ViewFancyComponent {
  @Input() data: any;
  today = this.functionsService.getToday()
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  date: number = this.today + 199456789
  url = environment.base_url
  loading = true
  constructor(private functionsService: FunctionsService) {
    setTimeout(() => {
      this.loading = false
      this.data

    }, 500);
  }
}
