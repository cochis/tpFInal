import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-programa-desing',
  templateUrl: './programa-desing.component.html',
  styleUrls: ['./programa-desing.component.css']
})
export class ProgramaDesingComponent implements AfterViewInit {
  @Input() data: any

  programas = []
  ngAfterViewInit() {


    console.log('this.data::: ', this.data);
    this.programas = (typeof (this.data.itinerarios) == 'string') ? JSON.parse(this.data.itinerarios) : this.data.itinerarios
    this.programas = JSON.parse(this.data.itinerarios)

  }
}
