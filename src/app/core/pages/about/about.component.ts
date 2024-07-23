import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaService } from '../../services/meta.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  img: String = ''
  constructor(private modalService: NgbModal,
    private metaService: MetaService
  ) {
    this.metaService.createCanonicalURL()
    let  data = {
      title: 'Ticket Party | Quienes somos ',
      description:
        'Empresa dedicada a la administración y gestión de eventos sociales, públicos o privados para Salones de eventos  o personas, administramos a tus invitados con el envido e invitaciones personalizadas a tu gusto se envían por correo electrónico o WhatsApp, donde la entrada se valida por código QR  , se generan notificaciones push se gestiona la entrada de todos los invitados en tiempo real.',
      keywords:
        'Eventos sociales públicos privados gestión tiempo real invitados invitaciones personalizadas código QR notificaciones correo electrónico WhatsApp push notification',
      slug: 'about',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/img/logo/l_100.png',
    }
    this.metaService.generateTags(data)


   }
  openXl(content, img) {

    this.modalService.open(content, { fullscreen: true });
    this.img = img
  }
}
