import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaService } from '../../services/meta.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  img: String = ''
  constructor(private modalService: NgbModal,
    private metaService: MetaService,
    private title: Title,
  ) {

    let t: string = 'My Ticket Party | Nosotros';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'My Ticket Party | Nosotros',
      description:
        'Nosotros , Invitaciones digitales, logistica y marketplace de servicios y productos para eventos ha revolucionado la forma en que se planifican y organizan celebraciones.',
      keywords:
        'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'core/about',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.jpeg',
    });

  }
  openXl(content, img) {

    this.modalService.open(content, { fullscreen: true });
    this.img = img
  }
}
