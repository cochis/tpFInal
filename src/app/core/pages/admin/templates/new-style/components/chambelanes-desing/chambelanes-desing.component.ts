import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chambelanes-desing',
  templateUrl: './chambelanes-desing.component.html',
  styleUrls: ['./chambelanes-desing.component.css']
})
export class ChambelanesDesingComponent implements AfterViewInit {
  @Input() data: any
  chambelanes = []
  constructor() {

  }
  ngAfterViewInit() {
    this.chambelanes = (typeof (this.data.chambelanes) == 'string') ? JSON.parse(this.data.chambelanes) : this.data.chambelanes

  }
}
