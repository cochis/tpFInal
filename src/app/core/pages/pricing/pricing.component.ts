import { Component } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { PaquetesService } from '../../services/paquete.service';
import { Paquete } from '../../models/paquete.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  paquetes: Paquete[]
  url = environment.base_url
  constructor(private metaService: MetaService,
    private functionsService: FunctionsService,
    private paquetesService: PaquetesService) {

    this.getPaquetes()
    this.metaService.createCanonicalURL()
    let data = {
      title: 'Ticket Party | Pricing ',
      description:
        'Costos, cuotas ,paquetes y promociones que ofrecemos',
      keywords:
        'Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
      slug: 'pricing',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/img/logo/l_100.png',
    }
    this.metaService.generateTags(data)
  }
  getPaquetes() {
    this.paquetesService.cargarPaquetesAll().subscribe(resp => {
      this.paquetes = resp.paquetes
      console.log('this.paquetes ::: ', this.paquetes);
    },
      (error) => {
        this.functionsService.alertError(error, 'Paquetes')
      })
  }
}
