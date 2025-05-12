import { Component } from '@angular/core';
import { TraductorService } from './services/traductor.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent {
  constructor(private traductor: TraductorService) {

  }

}
