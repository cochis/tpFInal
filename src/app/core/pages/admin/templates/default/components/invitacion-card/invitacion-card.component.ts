import { AfterViewInit, Component, Input } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invitacion-card',
  templateUrl: './invitacion-card.component.html',
  styleUrls: ['./invitacion-card.component.scss']
})
export class InvitacionCardComponent implements AfterViewInit {
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

    this.data.generalCheck = (typeof (this.data.generalCheck) == 'boolean' ? this.data.generalCheck : (this.data.generalCheck == 'true') ? true : false)
    this.data.croquisOk = (typeof (this.data.croquisOk) == 'boolean' ? this.data.croquisOk : (this.data.croquisOk == 'true') ? true : false)

    setTimeout(() => {
      this.loading = false
    }, 800);
  }

  verCroquis() {

    if (this.cls == 'animate__fadeOutDown') {
      this.cls = 'animate__fadeInUp'
    } else {
      this.cls = 'animate__fadeOutDown'

    }

    setTimeout(() => {

      this.vistaCroquis = !this.vistaCroquis
    }, 800);


  }
}
