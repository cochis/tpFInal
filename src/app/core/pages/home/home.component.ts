// Se eliminan AfterViewInit, ViewChild, ElementRef de esta línea
import { Component, OnInit } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UsuariosService } from '../../services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BoletosService } from '../../services/boleto.service';
import { ProveedorsService } from '../../services/proveedor.service';
import { Boleto } from '../../models/boleto.model';
import { CargarUsuario } from '../../interfaces/cargar-interfaces.interfaces';
import Swal from 'sweetalert2';
// ELIMINADO: La importación de Parallax ya no es necesaria
// import Parallax from 'parallax-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
// Se elimina AfterViewInit de la implementación
export class HomeComponent implements OnInit {
  // ELIMINADO: El ViewChild para #parallaxScene ya no es necesario
  // @ViewChild('parallaxScene') parallaxScene!: ElementRef;

  // --- DATOS SEO OPTIMIZADOS PARA INVITACIONES DE BAUTIZO ---
  // El título ahora se enfoca en la personalización para cualquier evento.
  private readonly SEO_TITLE = 'Crea Invitaciones Digitales Personalizadas con QR | MyTicketParty';

  // La descripción destaca la versatilidad y las funcionalidades clave.
  private readonly SEO_DESCRIPTION = 'Diseña tu invitación digital para cualquier evento: bodas, XV años, bautizos y más. Añade boletos con QR, mapas, mesa de regalos y confirmación RSVP. ¡Totalmente a tu gusto!';

  private readonly SEO_IMAGE = 'https://www.myticketparty.com/assets/images/invitaciones-personalizadas-og.png'; // Una imagen que muestre variedad de diseños
  private readonly BASE_URL = 'https://www.myticketparty.com';
  // Roles y Estado (sin cambios)
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
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private proveedorsService: ProveedorsService,
    private boletosService: BoletosService,
    private meta: Meta,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.setupMetaTags();
    // La llamada a getUser() se puede mover aquí desde ngAfterViewInit
    this.getUser(this.role);
  }

  // ELIMINADO: El ciclo de vida ngAfterViewInit ya no es necesario para Parallax.
  // La lógica que contenía (getUser) se movió a ngOnInit.

  // ... (el resto de tu archivo .ts permanece exactamente igual)
  private setupMetaTags(): void {
    // ... (sin cambios en esta función)
  }
  private updateCanonicalUrl(url: string): void {
    // ... (sin cambios en esta función)
  }
  getUser(role: string): void {
    // ... (sin cambios en esta función)
  }
  scan(): void {
    // ... (sin cambios en esta función)
  }
  stop(): void {
    // ... (sin cambios en esta función)
  }
  showQr(qr: any): void {
    // ... (sin cambios en esta función)
  }
}