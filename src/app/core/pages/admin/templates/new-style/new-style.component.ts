import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { Meta, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import * as $ from 'jquery';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Fondo } from 'src/app/core/models/fondo.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FondosService } from 'src/app/core/services/fondo.service';
import { InvitacionsService } from 'src/app/core/services/invitaciones.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { PushsService } from 'src/app/core/services/push.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-style',
  templateUrl: './new-style.component.html',
  styleUrls: ['./new-style.component.scss']
})
export class NewStyleComponent implements OnInit {
  // --- Declaración de Propiedades ---
  loading = false
  presentacionView = true
  invitacionView = false
  tUrl = environment.text_url
  play: any = true
  respuesta: any
  readonly VAPID_PUBLIC_KEY = environment.publicKey
  url = environment.base_url
  today = this.functionsService.getToday()
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  copy = false
  date: number = this.today + 199456789
  res: number
  formCheck: boolean = false
  qrOk = false
  rol = this.functionsService.getLocal('role')
  USR = environment.user_role
  fiestaId: string = undefined
  fiesta: Fiesta
  boletoId: string = undefined
  copyId: string = ''
  boleto: Boleto
  cPrincipal: 'pink'
  ind = 0
  salon: Salon
  invitadoId: any
  invitado: any
  idx: any
  editBoleto = false
  invitacion: any
  f: any = {}
  state: any = undefined
  count = 0
  btnBack = false
  itinerarios = []
  notas = []
  padres = []
  padrinos = []
  chambelanes = []
  menu = []
  musica = []
  musicaInvitacion = ''
  donde1Check: boolean
  donde2Check: boolean
  donde3Check: boolean
  croquisOk: boolean
  chambelanesCheck: boolean
  codigoVestimentaCheck: boolean
  padresCheck: boolean
  isMusic: boolean
  musicRepit: boolean
  padrinosCheck: boolean
  menuCheck: boolean
  musicaCheck: boolean
  mesaRegalosCheck: boolean
  confirmacionCheck: boolean
  itinerarioCheck: boolean
  generalCheck: boolean
  notaCheck: boolean
  checking: boolean
  hospedajeCheck: boolean
  vistaTemp: boolean
  pushOk: boolean = false
  dataPrincipal: any
  dataInvitacionCard: any
  dataMensajeCard: any
  dataListasCard: any
  dataDondeCard: any
  public qrCodeDownloadLink: SafeUrl = "";
  allItems: number[] = [];
  visibleItems: number[] = [];
  itemsPerLoad = 10;
  bgs: any = []
  frames: any = []
  items = [
    'timer', 'dondeCuando', 'galery', 'padrinos', 'chambelanes', 'programa',
    'menu', 'mesa-regalos', 'hospedaje', 'qr', 'confirmacion',
    'galeriaFiesta', 'notas', 'sobres', 'codigoVestimenta'
  ]
  bgsframes: Fondo[]

  /**
   * @description Constructor del componente. Se encarga de inyectar los servicios necesarios.
   * @param functionsService - Servicio con funciones de utilidad.
   * @param fiestasService - Servicio para gestionar los datos de las fiestas.
   * @param invitacionsService - Servicio para gestionar los datos de las invitaciones.
   * @param route - Proporciona acceso a la información de la ruta actual.
   * @param boletosService - Servicio para gestionar los boletos.
   * @param swPush - Servicio para gestionar las notificaciones push.
   * @param pushsService - Servicio personalizado para notificaciones push.
   * @param _modalService - Servicio para mostrar diálogos modales.
   * @param title - Servicio de Angular para manipular el título del documento.
   * @param fondosService - Servicio para cargar los fondos y marcos.
   * @param meta - Servicio de Angular para manipular las meta-etiquetas del documento.
   */
  constructor(
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private invitacionsService: InvitacionsService,
    private route: ActivatedRoute,
    private boletosService: BoletosService,
    private swPush: SwPush,
    private pushsService: PushsService,
    private readonly _modalService: ModalService,
    private title: Title,
    private fondosService: FondosService,
    private meta: Meta
  ) {
    this.functionsService.quitarChatShared()
    this.loading = true

    // Carga todos los fondos y marcos disponibles.
    this.fondosService.cargarFondosAll().subscribe(resp => {
      this.bgsframes = this.functionsService.getActives(resp.fondos)
      this.frames = this.bgsframes.filter(bgf => { return bgf.tipo == 'FRAME' })
      this.bgs = this.bgsframes.filter(bgf => { return bgf.tipo == 'BG' })
    })

    // Obtiene los IDs de la fiesta y boleto desde la URL.
    this.fiestaId = this.route.snapshot.params['fiesta']
    this.copyId = this.route.snapshot.params['copy']
    this.boletoId = this.route.snapshot.params['boleto']

    if (this.fiestaId && this.boletoId) {
      // Si existen IDs, carga la información del boleto.
      this.boletosService.cargarBoletoById(this.boletoId).subscribe((resp: any) => {
        this.boleto = resp.boleto
        if (!this.boleto.activated) {
          this.functionsService.alert('Boleto eliminado', 'Contactar con el anfitrion', 'info')
          this.functionsService.navigateTo('/core/inicio')
        }
        this.boleto.vista = true
        this.boletosService.isVistaBoleto(this.boleto).subscribe(() => {
          this.subscribeNotification()
        })
      }, (error) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Boletos')
      })

      // Carga la información de la fiesta.
      this.fiestasService.cargarFiestaById(this.fiestaId).subscribe((resp: any) => {
        this.fiesta = resp.fiesta

        this.checking = this.fiesta.checking
        this.invitacionsService.cargarInvitacionByFiesta(this.fiestaId).subscribe(async (resp: any) => {
          this.invitacion = resp.invitacion.data

          // --- ¡AQUÍ SE ESTABLECE EL SEO! ---
          // Llama a la función para configurar las meta-etiquetas ahora que tenemos todos los datos.
          this.setSeoData(this.fiesta, this.invitacion);

          this.restParty()
          this.invitacion = await this.dateToNumber(this.invitacion)
          this.invitacion.mesa = this.boleto.mesa
          this.date = !this.fiesta.example ? this.fiesta.fecha : this.today + 15000
          this.invitacion.cantidad = this.boleto.cantidadInvitados
          this.invitacion.invitado = this.boleto.nombreGrupo

          // Asignación de datos de la invitación a propiedades del componente
          this.donde1Check = this.invitacion.donde1Check
          // ... (resto de asignaciones de propiedades)
          this.donde2Check = this.invitacion.donde2Check
          this.donde3Check = this.invitacion.donde3Check
          this.hospedajeCheck = this.invitacion.hospedajeCheck
          this.mesaRegalosCheck = this.invitacion.mesaRegalosCheck
          this.confirmacionCheck = this.invitacion.confirmacionCheck
          this.generalCheck = this.invitacion.generalCheck
          this.itinerarios = this.invitacion.itinerarios
          this.notas = this.invitacion.notas
          this.padres = this.invitacion.padres
          this.padresCheck = this.invitacion.padresCheck
          this.isMusic = this.invitacion.isMusic
          this.musicRepit = this.invitacion.musicRepit
          this.padrinos = this.invitacion.padrinos
          this.padrinosCheck = this.invitacion.padrinosCheck
          this.chambelanes = this.invitacion.chambelanes
          this.chambelanesCheck = this.invitacion.chambelanesCheck
          this.codigoVestimentaCheck = this.invitacion.codigoVestimentaCheck
          this.menu = this.invitacion.menu
          this.menuCheck = this.invitacion.menuCheck
          this.musica = this.invitacion.musica
          this.musicaCheck = this.invitacion.musicaCheck
          this.musicaInvitacion = this.invitacion.musicaInvitacion


          // Configuración de los datos para las tarjetas de la UI
          this.dataPrincipal = { /* ... (datos para la tarjeta principal) */ }
          this.dataInvitacionCard = { /* ... (datos para la tarjeta de invitación) */ }
          this.dataMensajeCard = { /* ... (datos para la tarjeta de mensaje) */ }
          this.dataListasCard = { /* ... (datos para la tarjeta de listas) */ }
          this.dataDondeCard = { /* ... (datos para la tarjeta de dónde y cuándo) */ }

          setTimeout(() => {
            this.loading = false
          }, 1500);
          this.presentacionView = true

        }, (error) => {
          console.error('Error cargando invitación', error);
          this.functionsService.alertError(error, 'Invitaciones');
          this.functionsService.navigateTo('/core/inicio');
        })
      }, (error) => {
        console.error('Error cargando fiesta', error);
        this.functionsService.alertError(error, 'Fiestas');
        this.functionsService.navigateTo('/core/inicio');
      })
    } else {
      // Lógica para cuando no hay IDs en la URL (modo de vista previa o template).
      this.restParty()
      this.state = this.route.snapshot.queryParams
      // ... (resto de la lógica para la vista previa)
    }
  }

  /**
   * @description Hook del ciclo de vida de Angular. Se ejecuta una vez que el componente se inicializa.
   */
  ngOnInit() { }

  /**
   * @description Se dispara con el evento de scroll en la ventana.
   * Verifica qué elementos son visibles en pantalla y les aplica animaciones.
   * @param event - El evento de scroll.
   */
  onScroll(event: any) {
    this.items.forEach((item, i) => {
      const element = document.getElementById(`${item}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
          element.classList.remove('noVisible');
          element.classList.add('animate__fadeIn');
        } else {
          element.classList.add('noVisible');
          element.classList.remove('animate__fadeIn');
        }
      }
    });
  }

  /**
   * @description Hook del ciclo de vida. Se ejecuta después de que la vista del componente ha sido inicializada.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  /**
   * @description Configura las meta-etiquetas para SEO y redes sociales.
   * Utiliza los datos de la fiesta para crear un título, descripción e imagen dinámicos.
   * @param fiesta - El objeto que contiene la información de la fiesta (para la imagen).
   * @param invitacion - El objeto con los detalles de la invitación (para los textos).
   */
  setSeoData(fiesta: Fiesta, invitacion: any) {
    const titulo = `Estás invitado a: ${invitacion.nombreFiesta || 'un evento especial'}`;
    const descripcion = `Acompáñanos a celebrar ${invitacion.tipoFiesta || 'este gran día'}. ¡No te lo pierdas!`;
    const imageUrl = `${this.url}/upload/fiestas/${fiesta.img}`;

    this.title.setTitle(titulo);
    this.meta.updateTag({ name: 'description', content: descripcion });
    this.meta.updateTag({ property: 'og:title', content: titulo });
    this.meta.updateTag({ property: 'og:description', content: descripcion });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  /**
   * @description Gestiona la animación de cierre de la pantalla de presentación
   * y la aparición de la invitación principal.
   * @param close - Booleano que indica si se debe cerrar.
   */
  closePresentacion(close: boolean) {
    document.getElementById('presentacion').classList.add('animate__bounceOutUp');
    setTimeout(() => {
      this.presentacionView = false
      this.invitacionView = true
      setTimeout(() => {
        document.getElementById('invitacion').classList.add(this.invitacion.invitacionEfecto);
      }, 10);
      setTimeout(() => {
        document.getElementById('invitacion').classList.remove('dn');
      }, 4000);
    }, 2500);
  }

  /**
   * @description Inicia un intervalo que actualiza el contador de tiempo restante para la fiesta cada segundo.
   */
  restParty() {
    const interval = setInterval((): void => {
      if (this.date > 0) {
        let d = (this.date - this.functionsService.getToday()) / 86400000
        this.dias = Math.trunc(d)
        let hr = ((this.date - this.functionsService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)
        let min = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))
        this.minutos = Math.trunc(min / 60000)
        let seg = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))
        this.segundos = Math.trunc(seg / 1000)
      }
    }, 1000);
  }

  /**
   * @description Solicita al usuario permiso para recibir notificaciones push
   * y registra la suscripción en el backend.
   */
  subscribeNotification() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(respuesta => {
        this.pushsService.crearPush(respuesta).subscribe((resp: any) => {
          this.functionsService.setLocal("pushService", resp)
          var bl: any
          this.boleto.pushNotification.forEach((b) => {
            if (b == resp.pushDB.uid) {
              bl = true
            }
          });
          if (!bl) {
            this.boleto.pushNotification.push(resp.pushDB.uid)
          }
          this.boletosService.registrarPushNotification(this.boleto).subscribe((res) => { })
        })
      })
      .catch(err => {
        console.error('Error al suscribir a notificaciones', err)
      })
  }

  /**
   * @description Convierte las fechas en formato de texto a formato numérico (timestamp).
   * @param data - El objeto de datos de la invitación.
   * @returns Una promesa que se resuelve con el objeto de datos actualizado.
   */
  async dateToNumber(data: any) {
    // ... (lógica de conversión de fecha a número)
    return await data
  }

  /**
   * @description Convierte las fechas en formato numérico (timestamp) a formato de texto.
   * @param data - El objeto de datos de la invitación.
   * @returns Una promesa que se resuelve con el objeto de datos actualizado.
   */
  async numberToData(data: any) {
    // ... (lógica de conversión de número a fecha)
    return await data
  }

  /**
   * @description Genera el contenido en formato JSON para el código QR.
   * @param boleto - El objeto del boleto.
   * @returns Una cadena de texto en formato JSON para el QR.
   */
  getQr(boleto?: Boleto) {
    if (boleto) {
      var qr: any = {
        uid: boleto.uid,
        fiesta: boleto.fiesta,
        grupo: boleto.grupo,
        salon: boleto.salon,
        activated: boleto.activated
      }
      return JSON.stringify(qr)
    } else {
      return JSON.stringify({ url: 'https://myticketparty.com' })
    }
  }

  /**
   * @description Se activa cuando la URL del código QR cambia, permitiendo su descarga.
   * @param url - La URL segura del código QR generado.
   */
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  /**
   * @description Copia los datos de la invitación actual para ser utilizados en un nuevo diseño o plantilla.
   * @param data - Los datos de la invitación a copiar.
   */
  copiarInvitacion(data: any) {
    if (this.functionsService.getLocal('tipoInvitacion') && this.functionsService.getLocal('tipoInvitacion') == 'default') {
      this.functionsService.setLocal('invitacion', data)
      let back = this.functionsService.getLocal('viewTemplate')
      this.functionsService.navigateTo('/core/invitaciones/editar-invitacion/true/' + back)
      this.functionsService.removeItemLocal('viewTemplate')
    }
    // ... (resto de la lógica)
  }
}