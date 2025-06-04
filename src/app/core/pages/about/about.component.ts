import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  img: String = ''
  constructor(private modalService: NgbModal,
    private title: Title,
    private meta: Meta,
    private titleService: Title
  ) { }
  ngOnInit() {
    const titulo = 'Nosotros | MyTicketParty - Invitaciones Digitales Logística de Eventos y Marketplace para Eventos';
    const descripcion = 'Conoce a MyTicketParty: un equipo apasionado por ayudarte a organizar eventos inolvidables con invitaciones digitales, logística y un marketplace para eventos  completo.';
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('twitter:card');
    this.meta.removeTag('twitter:title');
    this.meta.removeTag('twitter:description');
    this.meta.removeTag('twitter:image');
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'sobre nosotros, quiénes somos, empresa de eventos, organización de eventos, MyTicketParty, invitaciones digitales, marketplace de eventos, logística para eventos, Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/about' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: 'core/about' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }
  openXl(content, img) {
    this.modalService.open(content, { fullscreen: true });
    this.img = img
  }
}
