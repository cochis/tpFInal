import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-market-items',
  templateUrl: './market-items.component.html',
  styleUrls: ['./market-items.component.css']
})
export class MarketItemsComponent implements AfterViewInit {
  @Input() items: any;
  CP = environment.cPrimary
  CS = environment.cSecond
  @Input() cP: any = this.CP;
  @Input() cS: any = this.CS;
  CW = '#ffffff'
  p: any
  constructor() {




  }
  ngAfterViewInit(): void {



  }
}
