import { Component } from '@angular/core';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.css']
})
export class CongratsComponent {

  constructor(private functionsServices: FunctionsService) {


  }
}
