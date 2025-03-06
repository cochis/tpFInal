import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { PaquetesService } from '../../services/paquete.service';
import { Paquete } from '../../models/paquete.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml, SafeUrl, Title } from '@angular/platform-browser';
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
  res = []
  sanitizedUrl: any
  sanitizedUrlFile: any
  descripcionHTML: SafeHtml;
  classView = ''
  showOk = false

  constructor(

    private functionsService: FunctionsService,
    private paquetesService: PaquetesService,
    private domSanitizer: DomSanitizer,
    private fiestasService: FiestasService,
    private ejemplosService: EjemplosService,
    private sanitizer: DomSanitizer,
    private metaService: MetaService,
    private title: Title,
  ) {

    let t: string = 'My Ticket Party | Inicio';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'My Ticket Party | Ejemplos de invitaciones digitales',
      description:
        'Las invitaciones digitales para logística son herramientas eficaces para coordinar eventos, reuniones o capacitaciones en el sector.',
      keywords:
        'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'core/examples',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.jpeg',
    });
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

  viewAcooridion(i) {

  }
  getCatalogos() {
    this.ejemplosService.cargarEjemplosAll().subscribe((resp: CargarEjemplos) => {

      this.ejemplos = resp.ejemplos
      console.log('   this.ejemplos ::: ', this.ejemplos);

      this.sanitizedUrl = this.getExamplesURL('default', 'url')
      this.sanitizedUrlFile = this.getExamplesURL('file', 'url')



      this.ejemplos = this.functionsService.getActives(resp.ejemplos)

      resp.ejemplos.forEach(ej => {
        let r = {
          fiesta: ej.fiesta, url: ej.urlFiestaBoleto
        }
        this.fiestas.push(r)
      });

    })
  }

  getExamplesURL(type, tipo, id?) {


    if (tipo == 'url') {

      let res: any
      this.ejemplos.forEach(ex => {
        if (ex.activated && type == ex.tipo.toLowerCase()) {

          res = this.domSanitizer.bypassSecurityTrustResourceUrl(ex.urlFiestaBoleto);

          return
        }

      });
      return res
    } else {





      return this.convertDes(tipo)
    }
  }
  convertDes(des: string) {
    return this.sanitizer.bypassSecurityTrustHtml(des);
  }
}
