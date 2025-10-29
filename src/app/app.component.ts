import { Component, Inject, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { FunctionsService } from './shared/services/functions.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { TraductorService } from './core/services/traductor.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  title = 'TicketParty';
  ver = environment.version
  rutaActual: string = '';
  showChat: boolean = false
  constructor(
    private update: SwUpdate,
    private functionsService: FunctionsService,
    private traductor: TraductorService,
    @Inject(DOCUMENT) private document: Document
  ) {

    console.info('Version ', this.ver);
    this.updateClient()


  }
  ngOnInit() {
    const urlCompleta = this.document.location.href;
    console.log('this.document.location::: ', this.document.location);
    console.log('URL completa:', urlCompleta);

    if (urlCompleta.includes('/templates')) {
      this.showChat = false
    } else {

      this.showChat = true
    }
    console.log('this.showChat::: ', this.showChat);
  }
  updateClient() {
    this.update.checkForUpdate().then((event) => {
      this.update.activateUpdate()
    })
  }

}