import { Component } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { PaquetesService } from '../../services/paquete.service';
import { Paquete } from '../../models/paquete.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  paquetes: Paquete[]
  url = environment.base_url
  loading = true
  constructor(private metaService: MetaService,
    private title: Title,
    private functionsService: FunctionsService,
    private paquetesService: PaquetesService) {
    let t: string = 'My Ticket Party | Pricing';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'My Ticket Party | Pricing',
      description:
        'Las opciones de precios y tipos de invitaciones digitales con galería de imágenes varían según el proveedor y las características ofrecidas. Generalmente, se pueden encontrar paquetes que incluyen diseños personalizables, posibilidad de añadir fotos y una galería',
      keywords:
        'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'core/pricing',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.jpeg',
    });
    this.getPaquetes()

  }
  getPaquetes() {
    this.paquetesService.cargarPaquetesAll().subscribe(resp => {
      this.paquetes = resp.paquetes
      setTimeout(() => {
        this.loading = false
      }, 500);
    },
      (error) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Paquetes')
      })
  }
}
