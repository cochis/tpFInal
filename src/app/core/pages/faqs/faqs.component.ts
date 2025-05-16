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

    let t: string = "Preguntas Frecuentes | Todo lo que Necesitas Saber | MyTicketParty";
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: "Preguntas Frecuentes | Todo lo que Necesitas Saber | MyTicketParty",
      description:
        'Resuelve tus dudas sobre invitaciones digitales, check-in, conteo de invitados, proveedores, pagos y cómo organizar tu evento con MyTicketParty.',
      keywords:
        'preguntas frecuentes, faqs, ayuda, soporte, dudas, eventos, invitaciones digitales, check-in, conteo de invitados, marketplace, MyTicketParty',
      slug: 'core/faqs',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.svg',
    });
  }

}
