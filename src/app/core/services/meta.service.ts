
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
  generateTags(data?: any) {

    if (!data) {

      data = {
        title: 'Ticket Party  | Inicio',
        description:
          'Empresa dedicada a la administración y gestión de eventos sociales, públicos o privados para Salones de eventos  o personas, administramos a tus invitados con el envido e invitaciones personalizadas a tu gusto se envían por correo electrónico o WhatsApp, donde la entrada se valida por código QR  , se generan notificaciones push se gestiona la entrada de todos los invitados en tiempo real.',
        keywords:
          'Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
        slug: 'Inicio',
        colorBar: '#13547a',
        image:
          window.location.origin + '/assets/img/logo/l_100.png',
      }

    }

    let config = {
      title: 'Tickets Party | Administra tu fiesta',
      description: '¡¡Ven te pruebalo!!',
      keywords:
        'Administracion, Fiestas , invitaciones, boletos, CheckIn, Galeria de Imagenes',
      image: this.url + 'assets/images/logo.png',
      slug: '',
      colorBar: '#13547a',
      ...data,
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
      content: `${this.url}${config.slug}`,
    });
  }
}


