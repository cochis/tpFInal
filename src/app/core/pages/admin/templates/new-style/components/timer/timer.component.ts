import { AfterViewInit, Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements AfterViewInit {
  @Input() data: any
  @Input() date: any = this.functionsService.getToday() + 100012345
  /* date = this.functionsService.getToday() + 123456123 */

  today = 0
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  text = ''
  constructor(private functionsService: FunctionsService) {
    this.today = this.functionsService.getToday()
    this.restParty()
  }
  ngAfterViewInit(): void {


  }
  restParty() {
    let i = 0
    const interval = setInterval((): void => {
      if (this.date > 0 && this.dias >= 0 && this.horas >= 0 && this.minutos >= 0 && this.segundos >= 0) {
        ++i
        this.text = 'Comenzamos'
        let d = (this.date - this.functionsService.getToday()) / 86400000
        this.dias = Math.trunc(d)
        let hr = ((this.date - this.functionsService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)
        let min = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))
        this.minutos = (Math.trunc(min / 60000) <= 0) ? 0 : (Math.trunc(min / 60000))
        let seg = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))
        this.segundos = (Math.trunc(seg / 1000) <= 0) ? 0 : Math.trunc(seg / 1000)
        if (seg > 0) {
          this.text = 'Ya solo faltan'
        }
      }
    }, 1000);
  }
}
