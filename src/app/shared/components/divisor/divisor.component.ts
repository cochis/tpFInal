import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-divisor',
  templateUrl: './divisor.component.html',
  styleUrls: ['./divisor.component.scss']
})
export class DivisorComponent {
  CP = environment.cPrimary
  @Input() color: any = this.CP;
}
