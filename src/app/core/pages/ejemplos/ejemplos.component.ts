import { Component, OnInit } from '@angular/core';
import { Meta, Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { PaquetesService } from '../../services/paquete.service';
import { FiestasService } from '../../services/fiestas.service';
import { EjemplosService } from '../../services/ejemplo.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

import { CargarEjemplos } from '../../interfaces/cargar-interfaces.interfaces';
import { Paquete } from '../../models/paquete.model';

@Component({
  selector: 'app-ejemplos',
  templateUrl: './ejemplos.component.html',
  styleUrls: ['./ejemplos.component.scss']
})
export class EjemplosComponent implements OnInit {
  paquetes: Paquete[] = [];
  ejemplos: any[] = [];
  fiestas: any[] = [];

  url = environment.base_url;
  urlInvitacion = environment.urlInvitacion;
  urlInvitacionFile = environment.urlInvitacionFile;
  examples = environment.examples;

  sanitizedUrl: any;
  sanitizedUrlFile: any;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private functionsService: FunctionsService,
    private paquetesService: PaquetesService,
    private fiestasService: FiestasService,
    private ejemplosService: EjemplosService
  ) { }

  ngOnInit(): void {
    this.setMetaTags();
    this.loadCatalogs();
  }

  private setMetaTags(): void {
    const titulo = 'My Ticket Party | Ejemplos de invitaciones digitales';
    const descripcion = 'Las invitaciones digitales para logística son herramientas eficaces para coordinar eventos, reuniones o capacitaciones en el sector.';

    this.functionsService.removeTags();
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'invitaciones digitales, boletos digitales, fiestas, eventos, QR, logística' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/examples' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: 'core/examples' },
      { name: 'colorBar', content: '#13547a' }
    ]);
  }

  private loadCatalogs(): void {
    this.ejemplosService.cargarEjemplosAll().subscribe((resp: CargarEjemplos) => {

      const activos = this.functionsService.getActives(resp.ejemplos);
      this.ejemplos = activos;

      this.sanitizedUrl = this.getExampleUrl('default');
      this.sanitizedUrlFile = this.getExampleUrl('file');

      this.fiestas = activos.map(ej => ({
        fiesta: ej.fiesta,
        url: ej.urlFiestaBoleto
      }));
    });
  }

  getExampleUrl(type: string): any {
    const ejemplo = this.ejemplos.find(ex => ex.activated && ex.tipo.toLowerCase() === type);
    return ejemplo ? this.sanitizer.bypassSecurityTrustResourceUrl(ejemplo.urlFiestaBoleto) : null;
  }

  convertDes(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  returnSanitizerUrl(): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
