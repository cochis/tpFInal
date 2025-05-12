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
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
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
    private functionService: FunctionsService,
    private title: Title,

  ) {


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
              this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);



              let t: string = `My Ticket Party | ${resF.invitacion.fiesta.nombre} | ${this.shared.data.boleto.nombreGrupo} | ${this.functionService.numberDateTimeLocal(resF.invitacion.fiesta.fecha)}`;
              this.title.setTitle(t);
              this.metaService.generateTags({
                title: `My Ticket Party | ${resF.invitacion.fiesta.nombre} | ${this.shared.data.boleto.nombreGrupo} | ${this.functionService.numberDateTimeLocal(resF.invitacion.fiesta.fecha)}`,
                description:
                  `${resF.invitacion.fiesta.nombre} | ${this.shared.data.boleto.nombreGrupo} | ${this.functionService.numberDateTimeLocal(resF.invitacion.fiesta.fecha)}`,
                keywords:
                  'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
                slug: 'core/shared',
                colorBar: '#13547a',
                image: `${this.urlB}/upload/fiestas/${this.shared.data.fiesta.img}`
                /* window.location.origin + '/assets/images/qr.jpeg', */
              });

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
