import { AfterViewInit, Component } from '@angular/core';
import Parallax from 'parallax-js'
@Component({
  selector: 'app-parralax',
  templateUrl: './parralax.component.html',
  styleUrls: ['./parralax.component.scss']
})
export class ParralaxComponent implements AfterViewInit {
  constructor() {
  }
  ngAfterViewInit() {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
      relativeInput: true
    });

  }

}
