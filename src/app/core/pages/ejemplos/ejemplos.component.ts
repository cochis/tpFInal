import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { PaquetesService } from '../../services/paquete.service';
import { Paquete } from '../../models/paquete.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FiestasService } from '../../services/fiestas.service';
import { EjemplosService } from '../../services/ejemplo.service';
import { CargarEjemplos } from '../../interfaces/cargar-interfaces.interfaces';
@Component({
  selector: 'app-ejemplos',
  templateUrl: './ejemplos.component.html',
  styleUrls: ['./ejemplos.component.css']
})
export class EjemplosComponent implements OnInit {
  paquetes: Paquete[]
  url = environment.base_url
  urlInvitacion = environment.urlInvitacion
  examples = environment.examples
  urlInvitacionFile = environment.urlInvitacionFile
  fiestas = []
  ejemplos = []
  sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlInvitacion);
  sanitizedUrlFile = this.domSanitizer.bypassSecurityTrustResourceUrl(this.urlInvitacionFile);
  constructor(private metaService: MetaService,
    private functionsService: FunctionsService,
    private paquetesService: PaquetesService,
    private domSanitizer: DomSanitizer,
    private fiestasService: FiestasService,
    private ejemplosService: EjemplosService
  ) {
    this.metaService.createCanonicalURL()
    let data = {
      title: 'Ticket Party | Ejemplos ',
      description:
        'Muestra de Invitaciones, Galerías, Envíos y Logística',
      keywords:
        'Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
      slug: 'examples',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/img/logo/l_100.png',
    }
    this.metaService.generateTags(data)
    this.examples
    this.getCatalogos()
  }
  async ngOnInit() {

    setTimeout(() => {

    }, 1500);
  }
  returnSinitizer(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  async getInfoFiesta() {
    this.examples.forEach(async element => {
      let fiesta = element.split('|')
      await this.fiestasService.cargarFiestaById(fiesta[0]).subscribe(async (resp: any) => {
        let res = { fiesta: resp, url: fiesta[1] }
        this.fiestas.push(res)
      })
    });
  }
  getCatalogos() {
    this.ejemplosService.cargarEjemplosAll().subscribe((resp: CargarEjemplos) => {
      resp.ejemplos.forEach(ej => {
        let r = {
          fiesta: ej.fiesta, url: ej.urlFiestaBoleto
        }
        this.fiestas.push(r)
      });
    })
  }
}
