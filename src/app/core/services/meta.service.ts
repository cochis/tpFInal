
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MetaService {
  url = environment.text_url
  constructor(@Inject(DOCUMENT) private doc: any, private meta: Meta) { }

  createCanonicalURL() {
    let link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    link.setAttribute('href', this.doc.URL);
    let linkAlternate: HTMLLinkElement = this.doc.createElement('link');
    linkAlternate.setAttribute('rel', 'alternate');
    this.doc.head.appendChild(linkAlternate);
    linkAlternate.setAttribute('href', this.doc.URL);
    linkAlternate.setAttribute('hreflang', 'es-mx');
  }





  generateTags(config: any) {
    config = {
      title: 'MyTicketParty',
      description:
        'Organiza cualquier tipo de evento con invitaciones digitales personalizadas digitales y organiza tu evento con MyTicketParty con o sin conteo de invitados, check-in opcional,Ocupa nuestra galeria de imagenes para tus invitados y que ellos compartan los mejores momentos de tu evento, galería de imágenes de tu evento y un marketplace para eventos  completo ¡Fácil, elegante y 100% digital!',
      keywords: "invitaciones digitales, galería de imágenes, eventos, marketplace, bodas, baby showers, fiestas, cumpleaños, logística de eventos, check-in, RSVP, MyTicketParty",
      image: 'https://myticketparty.com/assets/images/logo.svg',
      author: 'MyTicketParty',
      slug: '/',
      colorBar: '#13547a',
      viewport: 'width=device-width, initial-scale=1.0',
      ...config,
    };


    this.meta.updateTag({ name: 'author', content: config.autor });
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords });
    this.meta.updateTag({ name: 'theme-color', content: config.colorBar });
    this.meta.updateTag({ name: 'viewport', content: config.viewport });
    this.meta.updateTag({ name: 'msapplication-TileColor', content: config.colorBar, });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description, });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description, });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: config.title });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: `https://myticketparty.com/${config.slug}`, });

  }
}


