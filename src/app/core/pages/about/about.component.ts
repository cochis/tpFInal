import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaService } from '../../services/meta.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  img: String = ''
  constructor(private modalService: NgbModal,
    private metaService: MetaService,
    private title: Title,
    private meta: Meta,
    private titleService: Title
  ) {

    /*  let t: string = 'Nosotros | MyTicketParty - Invitaciones Digitales Logística de Eventos y Marketplace para Eventos';
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
     }); */

  }
  ngOnInit() {
    const titulo = 'Nosotros | MyTicketParty - Invitaciones Digitales Logística de Eventos y Marketplace para Eventos';
    const descripcion = 'Conoce a MyTicketParty: un equipo apasionado por ayudarte a organizar eventos inolvidables con invitaciones digitales, logística y un marketplace para eventos  completo.';

    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'sobre nosotros, quiénes somos, empresa de eventos, organización de eventos, MyTicketParty, invitaciones digitales, marketplace de eventos, logística para eventos, Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/about' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
      { name: 'slug', content: 'core/about' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }
  openXl(content, img) {

    this.modalService.open(content, { fullscreen: true });
    this.img = img
  }
}
