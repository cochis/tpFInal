import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-img-principal',
  templateUrl: './img-principal.component.html',
  styleUrls: ['./img-principal.component.scss']
})
export class ImgPrincipalComponent implements AfterViewInit {
  @Input() data: any
  url = environment.base_url
  ngAfterViewInit() {



  }
}
