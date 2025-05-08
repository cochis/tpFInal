import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent {
  constructor(
    private metaService: MetaService,
    private title: Title,
  ) {

    let t: string = "My Ticket Party | FAQ'S";
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: "My Ticket Party | FAQ'S",
      description:
        'Las preguntas frecuentes de la plataforma son una sección esencial donde los usuarios pueden encontrar respuestas a inquietudes comunes sobre su funcionamiento. ',
      keywords:
        'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'core/faqs',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.jpeg',
    });
  }

}
