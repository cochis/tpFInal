import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedsService } from '../core/services/shared.service';
import { FiestasService } from '../core/services/fiestas.service';
import { BoletosService } from '../core/services/boleto.service';
import { InvitacionsService } from '../core/services/invitaciones.service';
import { Shared } from '../core/models/shared.model';
import { Fiesta } from '../core/models/fiesta.model';
import { Boleto } from '../core/models/boleto.model';
import { Invitacion } from '../core/models/invitacion.model';
import { error } from 'console';
import { environment } from 'src/environments/environment';
import { DomSanitizer, Meta, SafeUrl, Title } from '@angular/platform-browser';
import { MetaService } from '../core/services/meta.service';
import { FunctionsService } from './services/functions.service';
@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent {
  evt: string
  shared!: any
  fiesta!: Fiesta
  boleto!: Boleto
  invitacion!: Invitacion
  urlT = environment.text_url
  iframeSrc: SafeUrl;
  url!: any
  urlB = environment.base_url
  loading = false

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedsService,
    private fiestaService: FiestasService,
    private invitacionService: InvitacionsService,
    private boletoService: BoletosService,
    private sanitizer: DomSanitizer,
    private metaService: MetaService,

    private title: Title,
    private meta: Meta,
    private titleService: Title,
    private functionsService: FunctionsService
  ) {

    this.functionsService.quitarChatShared()
    this.loading = true
    this.route.queryParams.subscribe(params => {

      this.evt = params.evt

      this.sharedService.cargarSharedById(this.evt).subscribe(res => {
        this.shared = res.shared


        this.invitacionService.cargarInvitacionByFiesta(this.shared.fiesta).subscribe((resF: any) => {

          this.shared.vistas = this.shared.vistas + 1
          this.sharedService.actualizarShared(this.shared).subscribe((resAct: any) => {

            if (this.shared.type == 'invitacion') {
              this.url = `${this.urlT}core/templates/${resF.invitacion.fiesta.invitacion}/${resF.invitacion.fiesta._id}/${this.shared.boleto}`
              console.log(' this.url ::: ', this.url);



              this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);


              let t: string = `My Ticket Party | Estas invitado ${resF.invitacion.fiesta.nombre}  `;
              let d: string = `${this.shared.data.boleto.nombreGrupo} | ${this.functionsService.numberDateTimeLocal(resF.invitacion.fiesta.fecha)}`;
              this.titleService.setTitle(t);
              this.functionsService.removeTags()

              this.meta.addTags([
                { name: 'author', content: 'MyTicketParty' },
                { name: 'description', content: d },
                { name: 'keywords', content: 'MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
                { property: 'og:title', content: t },
                { property: 'og:description', content: d },
                { property: 'og:image', content: `${this.urlB}/upload/fiestas/${this.shared.data.fiesta.img}` },
                { property: 'og:url', content: 'https://www.myticketparty.com' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: t },
                { name: 'twitter:description', content: d },
                { name: 'twitter:image', content: `${this.urlB}/upload/fiestas/${this.shared.data.fiesta.img}` },
                { name: 'slug', content: '/' },
                { name: 'colorBar', content: '#13547a' },
              ]);



              setTimeout(() => {

                this.loading = false
              }, 500);
            }
          })


        })


      },
        (error) => {
          console.error('error::: ', error);

        })

    });
  }
}
