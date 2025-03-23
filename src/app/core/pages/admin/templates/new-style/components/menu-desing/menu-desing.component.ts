import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-desing',
  templateUrl: './menu-desing.component.html',
  styleUrls: ['./menu-desing.component.css']
})
export class MenuDesingComponent implements AfterViewInit {
  @Input() data: any
  menus = []
  ngAfterViewInit() {
    this.menus = (typeof (this.data.menu) == 'string') ? JSON.parse(this.data.menu) : this.data.menu



  }
}
