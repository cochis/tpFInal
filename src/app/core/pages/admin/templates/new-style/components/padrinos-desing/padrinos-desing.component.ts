import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-padrinos-desing',
  templateUrl: './padrinos-desing.component.html',
  styleUrls: ['./padrinos-desing.component.css']
})
export class PadrinosDesingComponent implements AfterViewInit {
  @Input() data: any
  padrinos = []
  ngAfterViewInit() {


    this.padrinos = (typeof (this.data.padrinos) == 'string') ? JSON.parse(this.data.padrinos) : this.data.padrinos


  }

}
