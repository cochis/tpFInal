import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-codigo-desing',
  templateUrl: './codigo-desing.component.html',
  styleUrls: ['./codigo-desing.component.scss']
})
export class CodigoDesingComponent implements AfterViewInit {
  ngAfterViewInit(): void {


  }
  @Input() data: any
  url = environment.base_url
}
