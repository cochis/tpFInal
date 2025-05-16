import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaService } from '../../services/meta.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  img: String = ''
  constructor(private modalService: NgbModal,
    private metaService: MetaService,
    private title: Title,
  ) {

    let t: string = 'Nosotros | MyTicketParty - Invitaciones Digitales Logística de Eventos y Marketplace para Eventos';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'Nosotros | MyTicketParty - Invitaciones Digitales Logística de Eventos y Marketplace para Eventos',
      description:
        'Conoce a MyTicketParty: un equipo apasionado por ayudarte a organizar eventos inolvidables con invitaciones digitales, logística y un marketplace para eventos  completo.',
      keywords:
        'sobre nosotros, quiénes somos, empresa de eventos, organización de eventos, MyTicketParty, invitaciones digitales, marketplace de eventos, logística para eventos, Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'core/about',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.svg',
    });

  }
  openXl(content, img) {

    this.modalService.open(content, { fullscreen: true });
    this.img = img
  }
}
