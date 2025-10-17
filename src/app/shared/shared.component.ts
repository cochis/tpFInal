import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, SafeUrl, Title } from '@angular/platform-browser';
// Importaciones de servicios personalizados
import { SharedsService } from '../core/services/shared.service';
import { InvitacionsService } from '../core/services/invitaciones.service';
import { MetaService } from '../core/services/meta.service';
import { FunctionsService } from './services/functions.service';

// Importaciones de modelos (aunque algunos no se usan en este snippet, se mantienen)
import { Shared } from '../core/models/shared.model';
import { Fiesta } from '../core/models/fiesta.model';
import { Boleto } from '../core/models/boleto.model';
import { Invitacion } from '../core/models/invitacion.model';

// Importación de entorno para URLs
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit { // Agregamos OnInit por buenas prácticas

  // Propiedades del componente
  evt!: string; // ID del shared (evento) pasado por query param
  shared!: any; // Objeto compartido (incluye ID del boleto y fiesta)
  fiesta!: Fiesta;
  boleto!: Boleto;
  invitacion!: Invitacion;

  urlT = environment.text_url; // URL base para templates/invitaciones
  urlB = environment.base_url; // URL base para la ruta del backend (útil para imágenes)

  iframeSrc!: SafeUrl; // URL segura para el iframe (usada por DomSanitizer)
  url!: any;
  loading = false; // Indicador de carga

  // Constructor: Inyección de Dependencias
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedsService,
    private invitacionService: InvitacionsService,
    private sanitizer: DomSanitizer, // Para hacer URLs seguras (iframe)
    private metaService: MetaService, // Servicio SEO personalizado (asumido)
    private titleService: Title, // Angular Title Service para SEO
    private meta: Meta, // Angular Meta Service para SEO
    private functionsService: FunctionsService, // Funciones utilitarias
    // Se omiten FiestasService y BoletosService porque no se usan directamente en el flujo principal aquí
  ) {
    // Inicialización de la lógica principal en el constructor
    this.functionsService.quitarChatShared(); // Lógica para ocultar chat o similar
    this.loading = true;

    // 1. Obtener el query parameter 'evt' (ID del shared)
    this.route.queryParams.subscribe(params => {
      this.evt = params['evt']; // Acceso por corchetes recomendado para seguridad

      // 2. Cargar el objeto Shared por ID
      this.sharedService.cargarSharedById(this.evt).subscribe(res => {
        this.shared = res.shared;

        // 3. Cargar la información completa de la invitación asociada a la fiesta
        // 'resF' contiene la información de la invitación y la fiesta (resF.invitacion.fiesta)
        this.invitacionService.cargarInvitacionByFiesta(this.shared.fiesta).subscribe((resF: any) => {

          // 4. Aumentar el contador de vistas y actualizar el shared
          this.shared.vistas = this.shared.vistas + 1;
          this.sharedService.actualizarShared(this.shared).subscribe((resAct: any) => {

            if (this.shared.type == 'invitacion') {

              // 5. Construir la URL del Iframe (Template de la Invitación)
              this.url = `${this.urlT}core/templates/${resF.invitacion.fiesta.invitacion}/${resF.invitacion.fiesta._id}/${this.shared.boleto}`;

              // 6. Sanitizar la URL para permitir que se cargue en el iframe
              this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

              // 7. --- CONFIGURACIÓN SEO SOCIAL (META TAGS) ---

              // Definición de variables clave basadas en resF.invitacion.fiesta
              let nombreFiesta: string = resF.invitacion.fiesta.nombre;
              let imagenFiesta: string = resF.invitacion.fiesta.img; // Imagen de la fiesta

              // Título y Descripción para SEO
              let t: string = `My Ticket Party | Estás invitado a ${nombreFiesta}`;
              let d: string = `${nombreFiesta} | ${this.functionsService.numberDateTimeLocal(resF.invitacion.fiesta.fecha)}`;

              // URL de la imagen para OG y Twitter
              let imagenUrl: string = `${this.urlB}/upload/fiestas/${imagenFiesta}`;

              this.titleService.setTitle(t); // Establece el título de la página
              this.functionsService.removeTags(); // Limpia meta tags previos (asumido)

              this.meta.addTags([
                { name: 'author', content: 'MyTicketParty' },
                { name: 'description', content: d },
                { name: 'keywords', content: 'MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },

                // Open Graph (OG) - Meta tags para compartir en Facebook, WhatsApp, etc.
                { property: 'og:title', content: t },
                { property: 'og:description', content: d },
                { property: 'og:image', content: imagenUrl }, // Imagen de la fiesta (resF.invitacion.fiesta.img)
                { property: 'og:url', content: 'https://www.myticketparty.com' },

                // Twitter Card - Meta tags para compartir en Twitter/X
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: t },
                { name: 'twitter:description', content: d },
                { name: 'twitter:image', content: imagenUrl }, // Imagen de la fiesta (resF.invitacion.fiesta.img)

                { name: 'slug', content: '/' },
                { name: 'colorBar', content: '#13547a' },
              ]);
              // ---------------------------------------------

              setTimeout(() => {
                this.loading = false; // Desactiva la carga después de un tiempo prudente
              }, 500);
            }
          })
        },
          (error) => {
            console.error('Error cargando invitación:', error);
          })
      },
        (error) => {
          console.error('Error cargando Shared:', error);
        })
    });
  }

  // Implementación del ciclo de vida (aunque está vacío, es buena práctica)
  ngOnInit(): void {
    // Si la lógica estuviera aquí, se dispararía una sola vez después del constructor
  }
}