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

    private meta: Meta,
    private titleService: Title
  ) {

    this.getCatalogos()
  }
  ngOnInit(): void {
    const titulo = 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!';
    const descripcion = 'Encuentra los mejores proveedores para tu evento: decoración, catering, fotografía, música, logística y mucho más. ¡Organiza tu evento ideal!';
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('twitter:card');
    this.meta.removeTag('twitter:title');
    this.meta.removeTag('twitter:description');
    this.meta.removeTag('twitter:image');
    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'marketplace de eventos, proveedores de eventos, decoración, banquetes, sonido, iluminación, fotografía, organización de eventos, MyTicketParty,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/proveedores' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
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
