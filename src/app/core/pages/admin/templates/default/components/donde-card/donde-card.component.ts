import { AfterViewInit, Component, Input } from '@angular/core';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-donde-card',
  templateUrl: './donde-card.component.html',
  styleUrls: ['./donde-card.component.scss']
})
export class DondeCardComponent implements AfterViewInit {
  @Input() data: any
  @Input() fiesta: any
  @Input() type: string
  today = this.functionsService.getToday()
  loading: boolean = false
  date: number = this.today + 199456789
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  url = environment.base_url

  vistaCroquis = false
  constructor(
    private functionsService: FunctionsService
  ) {
    this.loading = true

  }
  ngAfterViewInit(): void {



    this.fiesta = (typeof (this.fiesta) == 'object') ? this.fiesta : JSON.parse(this.data.fiesta)



    setTimeout(() => {
      this.loading = false
    }, 800);
  }


}
