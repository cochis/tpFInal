import { Component } from '@angular/core';

@Component({
  selector: 'app-new-style',
  templateUrl: './new-style.component.html',
  styleUrls: ['./new-style.component.css']
})
export class NewStyleComponent {
  loading = false
  presentacionView = false
  invitacionView = true


  constructor() {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500);
  }



  closePresentacion(close) {

    document.getElementById('presentacion').classList.add('animate__bounceOutUp');


    setTimeout(() => {
      this.presentacionView = false
      this.invitacionView = true

      setTimeout(() => {
        document.getElementById('invitacion').classList.remove('dn');
        document.getElementById('invitacion').classList.add('animate__bounceInRight');

      }, 10);
    }, 2500);


  }
}
