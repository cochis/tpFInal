import { Injectable, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(@Inject(DOCUMENT) private doc: any, private meta: Meta) { }
  createLinkForCanonicalURL() {
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
      title: 'Colegio Libertadores de América | Preescolar  Primaria',
      description:
        'Escuela lider en nezahualcoyotl, preescolar, primaria,de excelencia academica que cuenta con ingles y computacion obligatorios ademas de tae kwon do , futbol, futbol americano danza y artes',
      keywords:
        'preescolar, guarderia, primaria , excelencia academica, ingles, computacion , futbol, cancha de futbol, basquetbol, futbol americano , educacion de calidad',
      image: '',
      slug: '',
      colorBar: '#019342',
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
      content: `https://colegiolibam.com/${config.slug}`,
    });
  }
}
