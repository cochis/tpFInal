import { Component } from '@angular/core';
import { Proveedor } from '../../../../models/proveedor.model';
import { ProveedorsService } from '../../../../services/proveedor.service';
import { CargarProveedors } from '../../../../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent {
  proveedores: Proveedor[] = undefined
  constructor(
    private proveedoresService: ProveedorsService,
    private functionsService: FunctionsService,
    private metaService: MetaService,
    private title: Title,
  ) {
    let t: string = 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!',
      description:
        'proveedores de eventos, decoración, banquetes, catering, música para eventos, fotografía, organización de eventos, DJ, floristas, MyTicketParty',
      keywords:
        'marketplace de eventos, proveedores de eventos, decoración, banquetes, sonido, iluminación, fotografía, organización de eventos, MyTicketParty ',
      slug: 'core/market',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.svg',
    });
    this.getCatalogos()
  }

  getCatalogos() {



    this.proveedoresService.cargarProveedorsAll().subscribe((res: CargarProveedors) => {

      this.proveedores = this.functionsService.getActivos(res.proveedors)



    })
  }

}
