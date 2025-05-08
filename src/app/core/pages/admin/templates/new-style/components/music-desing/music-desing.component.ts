import { AfterViewInit, Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-music-desing',
  templateUrl: './music-desing.component.html',
  styleUrls: ['./music-desing.component.scss']
})
export class MusicDesingComponent implements AfterViewInit {
  @Input() data: any
  url = environment.base_url
  isMusic = false
  isMusicRep = false
  play = true
  icon = 'bi bi-volume-mute-fill'
  ngAfterViewInit() {


    this.isMusic = (this.data.isMusic == 'false' || this.data.isMusic == false) ? false : true
    this.isMusicRep = (this.data.isMusicRep == 'false' || this.data.isMusicRep == false) ? false : true


  }
  playStop() {
    var v = document.getElementsByTagName("audio")[0];
    this.play = !this.play;

    if (this.play) {
      this.icon = 'bi bi-volume-mute-fill'
    } else {
      this.icon = 'bi bi-play-fill'
    }

  }


}
