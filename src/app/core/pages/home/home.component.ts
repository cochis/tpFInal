// --- Se añaden Inject y DOCUMENT para el manejo del tag <link> ---
import { Component, OnInit, Inject } from '@angular/core';
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
  // --- DATOS SEO OPTIMIZADOS ---
  private readonly SEO_TITLE =
    'MyTicketParty | Crea Invitaciones Digitales Personalizadas con QR ';
  private readonly SEO_DESCRIPTION =
    'Diseña tu invitación digital para bodas, XV años y más. Gestiona la logística, envío de invitaciones por WhatsApp y usa la app de check-in con QR. ¡Todo en un solo lugar!';
  private readonly SEO_IMAGE =
    'https://www.myticketparty.com/assets/images/logo.svg'; // Asegúrate que esta imagen exista
  private readonly BASE_URL = 'https://www.myticketparty.com';

  // --- Roles y Estado (Tu lógica de negocio) ---
  ADM = environment.admin_role;
  SLN = environment.salon_role;
  URS = environment.user_role;
  ANF = environment.anf_role;
  PRV = environment.prv_role;
  scannerActive = false;
  editBoleto = false;
  today: number = this.functionsService.getToday();
  role = this.functionsService.getLocal('role');
  uid = this.functionsService.getLocal('uid');
  idx: number | undefined;
  invitado: any;
  boleto!: Boleto;

  constructor(
    // Servicios de tu lógica
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private proveedorsService: ProveedorsService,
    private boletosService: BoletosService,

    // Servicios de SEO
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document // Inyecta DOCUMENT
  ) { }

  ngOnInit(): void {
    // 1. Configura el SEO
    this.setupMetaTags();

    // 2. Ejecuta tu lógica de carga
    this.getUser(this.role);
  }

  // ===================================================================
  // --- SECCIÓN DE SEO ---
  // ===================================================================

  /**
   * Configura todas las etiquetas Meta y el Título para esta página.
   */
  private setupMetaTags(): void {
    // Define la URL canónica específica para esta página
    const pageUrl = `${this.BASE_URL}/home`;

    // 1. Título de la página
    this.titleService.setTitle(this.SEO_TITLE);

    // 2. Meta Descripción
    this.meta.updateTag({
      name: 'description',
      content: this.SEO_DESCRIPTION,
    });

    // 3. Open Graph (para Facebook, WhatsApp, LinkedIn, etc.)
    this.meta.updateTag({ property: 'og:title', content: this.SEO_TITLE });
    this.meta.updateTag({
      property: 'og:description',
      content: this.SEO_DESCRIPTION,
    });
    this.meta.updateTag({ property: 'og:image', content: this.SEO_IMAGE });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // 4. Twitter Cards (para Twitter)
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.SEO_TITLE });
    this.meta.updateTag({
      name: 'twitter:description',
      content: this.SEO_DESCRIPTION,
    });
    this.meta.updateTag({ name: 'twitter:image', content: this.SEO_IMAGE });
    this.meta.updateTag({ name: 'twitter:site', content: '@My_TicketParty' }); // <-- Opcional: añade tu @ de Twitter

    // 5. Llama a la función para actualizar la URL Canónica
    this.updateCanonicalUrl(pageUrl);
  }

  /**
   * Actualiza o crea la etiqueta <link rel="canonical"> en el <head>.
   */
  private updateCanonicalUrl(url: string): void {
    // Busca el tag <link rel="canonical">
    let canonicalLink = this.document.querySelector('link[rel="canonical"]');

    if (canonicalLink) {
      // Si existe, actualiza su href
      canonicalLink.setAttribute('href', url);
    } else {
      // Si no existe, créalo y añádelo al <head>
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', url);
      this.document.head.appendChild(canonicalLink);
    }
  }

  // ===================================================================
  // --- SECCIÓN DE LÓGICA DE NEGOCIO ---
  // (Tus funciones originales)
  // ===================================================================

  getUser(role: string): void {
    // Aquí va tu lógica para obtener el usuario...
    console.log('Cargando datos del usuario para el rol:', role);
  }

  scan(): void {
    // Tu lógica para iniciar el scanner...
    this.scannerActive = true;
  }

  stop(): void {
    // Tu lógica para detener el scanner...
    this.scannerActive = false;
  }

  showQr(qr: any): void {
    // Tu lógica para mostrar el modal del QR...
    Swal.fire({
      title: 'QR Code',
      text: `Datos: ${qr}`,
      // ...
    });
  }
}