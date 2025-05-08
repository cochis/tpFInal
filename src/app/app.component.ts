import { Component } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { FunctionsService } from './shared/services/functions.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'TicketParty';
  ver = environment.version
  constructor(
    private update: SwUpdate,
    private functionsService: FunctionsService) {

    console.info('Version ', this.ver);
    this.updateClient()


  }
  updateClient() {
    this.update.available.subscribe((event) => {
      Swal.fire({
        title: 'Existe una nueva version de la aplicación favor de actualizar',
        confirmButtonColor: '#22547b',
        confirmButtonText: 'Actualizar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.functionsService.logout()
          window.location.reload()
        }
      })
    })
  }

}