import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UsuariosService } from '../../services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BoletosService } from '../../services/boleto.service';
import { ProveedorsService } from '../../services/proveedor.service';
import { Boleto } from '../../models/boleto.model';
import { CargarUsuario } from '../../interfaces/cargar-interfaces.interfaces';
import Swal from 'sweetalert2';
import Parallax from 'parallax-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('parallaxScene') parallaxScene!: ElementRef;

  // Roles
  ADM = environment.admin_role;
  SLN = environment.salon_role;
  URS = environment.user_role;
  ANF = environment.anf_role;
  PRV = environment.prv_role;

  // Estado
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
    const titulo = 'Invitaciones Digitales y Logistica de eventos - MyTicketParty';
    const descripcion = 'Crea y personaliza invitaciones digitales para tus eventos con MyTicketParty. Gestiona boletos, asigna mesas y comparte tu celebración fácilmente.';

    this.functionsService.removeTags();
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'MyTicketParty, invitaciones digitales personalizadas, crear invitaciones con boletos, boletos digitales para fiestas, invitaciones para eventos privados, invitaciones con código QR, entradas digitales para fiestas, invitaciones con control de acceso, tickets personalizados para eventos, cómo hacer invitaciones digitales para fiestas, plataforma para crear boletos con QR, invitaciones con entrada digital para eventos, boletos para fiestas con lista de invitados, crear invitaciones con diseño personalizado, control de acceso para eventos privados, envío de boletos digitales por WhatsApp o email, invitaciones interactivas para eventos, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: '/' },
      { name: 'colorBar', content: '#13547a' },
    ]);
  }

  ngAfterViewInit() {
    this.getUser(this.role);
    new Parallax(this.parallaxScene.nativeElement, {
      relativeInput: true,
    });
  }

  getUser(role: string): void {
    if ([this.SLN, this.ANF, this.PRV].includes(role)) {
      this.usuariosService.cargarUsuarioById(this.uid).subscribe({
        next: (resp: CargarUsuario) => {
          const user = resp.usuario;
          const hasSalon = user?.salon?.length > 0;

          if (!hasSalon) {
            if (role === this.PRV) {
              Swal.fire({
                title: '¿Tienes alguna ubicación?',
                showDenyButton: true,
                confirmButtonText: 'Si',
                confirmButtonColor: '#13547a',
                denyButtonText: 'No',
                denyButtonColor: '#81d0c7',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.functionsService.navigateTo('core/salones/registrar-salon');
                } else if (result.isDenied) {
                  this.proveedorsService.cargarProveedorsByCreador(this.uid).subscribe((res) => {
                    if (res.proveedors.length === 0) {
                      this.functionsService.navigateTo('core/proveedores/editar-datos');
                    }
                  });
                }
              });
            } else {
              this.functionsService.navigateTo('core/salones/registrar-salon');
            }
          }
        },
        error: (error) => {
          this.functionsService.alertError(error, 'Home');
        }
      });
    }
  }

  scan(): void {
    this.scannerActive = true;
    setTimeout(() => this.scannerActive = false, 15000);
  }

  stop(): void {
    this.scannerActive = false;
  }

  showQr(qr: any): void {
    if (!qr.ok) {
      this.functionsService.alert('Check in', 'Ha sucedido algo extraño', 'error');
      return;
    }

    this.stop();

    this.boletosService.cargarBoletoByFiesta(qr.data.fiesta).subscribe({
      next: (res: any) => {
        this.idx = undefined;
        this.editBoleto = false;
        const invi: any = qr.data.invitado;
        const bt: any[] = res.boleto[0].invitados;
        this.boleto = res.boleto[0];

        bt.forEach((b, index) => {
          if (
            b.grupo === invi.grupo &&
            b.nombreGrupo === invi.nombreGrupo &&
            b.cantidad === invi.cantidad
          ) {
            this.idx = index;
          }
        });

        if (this.idx !== undefined) {
          this.invitado = bt[this.idx];
          this.invitado.confirmado = true;
          this.editBoleto = true;

          this.boletosService.actualizarBoletoRegistro(this.boleto).subscribe({
            next: () => {
              this.functionsService.alertUpdate('Confirmaste tu asistencia');
            },
            error: (err) => {
              console.error('Error', err);
              this.functionsService.alertError(err, 'Confirma asistencia');
            }
          });
        } else {
          this.invitado = undefined;
          this.functionsService.alert('Check in', 'El boleto ha sido modificado. Favor de comunicarse con el anfitrión', 'error');
        }
      },
      error: (err) => {
        this.functionsService.alertError(err, 'Carga de Boleto');
      }
    });
  }
}
