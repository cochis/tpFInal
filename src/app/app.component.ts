import { Component } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { FunctionsService } from './shared/services/functions.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { TraductorService } from './core/services/traductor.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'TicketParty';
  ver = environment.version
  constructor(
    private update: SwUpdate,
    private functionsService: FunctionsService,
    private traductor: TraductorService
  ) {

    console.info('Version ', this.ver);
    this.updateClient()


  }
  updateClient() {
    this.update.checkForUpdate().then((event) => {
      this.update.activateUpdate()
    })
  }

}