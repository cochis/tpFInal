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

    console.log('this.data::: ', this.data);
    this.padrinos = (typeof (this.data.padrinos) == 'string') ? JSON.parse(this.data.padrinos) : this.data.padrinos


  }

}
