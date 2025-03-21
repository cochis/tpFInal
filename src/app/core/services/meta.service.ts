
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
      title: 'Ticket Party',
      description:
        'Empresa dedicada a la administración y gestión de eventos sociales,y marketplace de servicios y productos para públicos o privados para Salones de eventos  o personas.',
      keywords:
        'Marketplace Productos Servicios Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
      image: '',
      slug: '/',
      colorBar: '#13547a',
      ...config,
    };
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords });
    this.meta.updateTag({ name: 'theme-color', content: config.colorBar });
    this.meta.updateTag({
      name: 'msapplication-TileColor',
      content: config.colorBar,
    });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: config.title });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({
      property: 'og:url',
      content: `https://myticketparty.com/${config.slug}`,
    });
  }
}


