import { AfterViewInit, Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements AfterViewInit {
  @Input() data: any
  today = this.functionsService.getToday()
  loading: boolean = false
  date: number = this.today + 199456789
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  url = environment.base_url

  constructor(
    private functionsService: FunctionsService
  ) {
    this.loading = true
    this.restParty()
  }
  ngAfterViewInit(): void {

    if (this.data.date) {

      this.date = this.data.date
    }

    setTimeout(() => {
      this.loading = false
    }, 500);

  }
  restParty() {
    let i = 0
    const interval = setInterval((): void => {
      if (this.date > 0) {
        ++i
        let d = (this.date - this.functionsService.getToday()) / 86400000
        this.dias = Math.trunc(d)
        let hr = ((this.date - this.functionsService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)
        let min = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))
        this.minutos = Math.trunc(min / 60000)
        let seg = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))
        this.segundos = Math.trunc(seg / 1000)
      }
    }, 1000);
  }



}
