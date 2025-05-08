import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../../services/functions.service';
import { FondosService } from 'src/app/core/services/fondo.service';
import { Fondo } from 'src/app/core/models/fondo.model';

@Component({
  selector: 'app-view-fancy',
  templateUrl: './view-fancy.component.html',
  styleUrls: ['./view-fancy.component.scss']
})
export class ViewFancyComponent implements AfterViewInit {
  @Input() data: any;
  today = this.functionsService.getToday()
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  date: number = this.today + 199456789
  url = environment.base_url
  loading = true
  bgsframes: Fondo[]
  frames: Fondo[]
  bgs: Fondo[]
  padres = []
  constructor(private functionsService: FunctionsService,
    private fondosService: FondosService

  ) {

    this.fondosService.cargarFondosAll().subscribe(resp => {
      this.bgsframes = this.functionsService.getActives(resp.fondos)


      this.frames = this.bgsframes.filter(bgf => { return bgf.tipo == 'FRAME' })

      this.bgs = this.bgsframes.filter(bgf => { return bgf.tipo == 'BG' })

    })
    setTimeout(() => {
      this.loading = false
      this.data

    }, 500);
  }
  ngAfterViewInit() {

    this.padres = this.data.padres

  }

  getImg(img) {

    let imgR = this.bgsframes.filter(bgf => { return bgf.value == img })
    return imgR[0].img

  }
}
