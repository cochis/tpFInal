import { Component } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { PaquetesService } from '../../services/paquete.service';
import { Paquete } from '../../models/paquete.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ejemplos',
  templateUrl: './ejemplos.component.html',
  styleUrls: ['./ejemplos.component.css']
})
export class EjemplosComponent {
  paquetes: Paquete[]
  url = environment.base_url
  urlInvitacion = environment.urlInvitacion
  urlInvitacionFile = environment.urlInvitacionFile
  sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlInvitacion);
  sanitizedUrlFile = this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlInvitacionFile);
  constructor(private metaService: MetaService,
    private functionsService: FunctionsService,
    private paquetesService: PaquetesService,
    private domSanitizer: DomSanitizer
  ) {
    this.metaService.createCanonicalURL()
    let data = {
      title: 'Ticket Party | Ejemplos ',
      description:
        'Muestra de Invitaciones, Galerías, Envíos y Logística',
      keywords:
        'Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
      slug: 'examples',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/img/logo/l_100.png',
    }
    this.metaService.generateTags(data)


  }

}
