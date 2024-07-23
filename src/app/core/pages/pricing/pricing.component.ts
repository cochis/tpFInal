import { Component } from '@angular/core';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {


  constructor( private metaService: MetaService){
    this.metaService.createCanonicalURL()
    let  data = {
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
}
