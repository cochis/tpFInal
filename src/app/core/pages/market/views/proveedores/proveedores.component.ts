import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../../../models/proveedor.model';
import { ProveedorsService } from '../../../../services/proveedor.service';
import { CargarProveedors } from '../../../../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = undefined
  constructor(
    private proveedoresService: ProveedorsService,
    private functionsService: FunctionsService,
    private metaService: MetaService,
    private title: Title,
    private meta: Meta,
    private titleService: Title
  ) {
    /* let t: string = 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!';
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
    }); */
    this.getCatalogos()
  }
  ngOnInit(): void {
    const titulo = 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!';
    const descripcion = 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!';

    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'marketplace de eventos, proveedores de eventos, decoración, banquetes, sonido, iluminación, fotografía, organización de eventos, MyTicketParty' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/proveedores' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/qr.svg' },
      { name: 'slug', content: 'core/proveedores' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }
  getCatalogos() {



    this.proveedoresService.cargarProveedorsAll().subscribe((res: CargarProveedors) => {

      this.proveedores = this.functionsService.getActivos(res.proveedors)



    })
  }

}
