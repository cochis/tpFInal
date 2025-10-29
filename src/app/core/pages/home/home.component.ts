// --- Se añaden Inject y DOCUMENT para el manejo del tag <link> ---
import { Component, OnInit, Inject, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; // Importación clave para el tag <link>
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UsuariosService } from '../../services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BoletosService } from '../../services/boleto.service';
import { ProveedorsService } from '../../services/proveedor.service';
import { Boleto } from '../../models/boleto.model';
import { CargarUsuario } from '../../interfaces/cargar-interfaces.interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Lógica del componente (para el menú móvil)
  isMobileMenuOpen = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  // --- ¡SEO INTEGRADO! ---
  // Se utiliza inject() (minúscula) como inicializador de propiedad.
  private title: Title = inject(Title);
  private meta: Meta = inject(Meta);

  constructor() {
    this.setPageSEO();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  setPageSEO() {
    // --- Título de la Página ---
    // Este es el texto que aparece en la pestaña del navegador y en el resultado de Google.
    const pageTitle = 'MyTicketParty | Invitaciones Digitales con QR, RSVP y Logística';
    this.title.setTitle(pageTitle);

    // --- Meta Etiquetas Esenciales ---
    this.meta.addTags([
      {
        name: 'description',
        content: 'Crea invitaciones digitales únicas para bodas, XV años y fiestas. Gestiona RSVP, boletos QR, check-in, mapas y más. ¡Prueba MyTicketParty!'
      },
      {
        name: 'keywords',
        content: 'invitaciones digitales, invitaciones para boda, invitaciones xv años, boletos qr para eventos, rsvp online, check-in eventos, myticketparty, logística de eventos'
      },
      { name: 'robots', content: 'index, follow' }, // Indica a Google que rastree esta página

      // --- Open Graph (para Facebook, WhatsApp, LinkedIn) ---
      { property: 'og:title', content: pageTitle },
      {
        property: 'og:description',
        content: 'Gestiona RSVP, boletos QR, check-in, mapas y más para tu evento. ¡Diseña tu invitación digital inolvidable!'
      },
      {
        property: 'og:image',
        // ¡Importante! Reemplaza esta imagen de 1200x630 con una imagen promocional tuya.
        content: 'assets/myticketparty-og-image.png'
      }, // Usando la misma imagen para OG
      { property: 'og:url', content: 'https://myticketparty.com' }, // ¡Importante! Reemplaza con tu dominio real
      { property: 'og:type', content: 'website' },

      // --- Twitter Card (para Twitter) ---
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      {
        name: 'twitter:description',
        content: 'Gestiona RSVP, boletos QR, check-in, mapas y más para tu evento. ¡Diseña tu invitación digital inolvidable!'
      },
      {
        name: 'twitter:image',
        // ¡Importante! Reemplaza esta imagen con la tuya.
        content: 'assets/myticketparty-og-image.png'
      } // Usando la misma imagen para Twitter
    ]);
  }
}