import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UsuariosService } from '../../services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BoletosService } from '../../services/boleto.service';
import { ProveedorsService } from '../../services/proveedor.service';
import { MetaService } from '../../services/meta.service';
import { Boleto } from '../../models/boleto.model';
import { CargarUsuario } from '../../interfaces/cargar-interfaces.interfaces';
import Swal from 'sweetalert2';
import { ItemsService } from '../../services/item.service';
import { TraductorService } from '../../services/traductor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  scannerActive = false
  today: Number = this.functionsService.getToday()
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  PRV = environment.prv_role
  editBoleto = false
  role = ''
  uid = ''
  invitado: any
  idx: number = undefined
  boleto: Boleto

  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private proveedorsService: ProveedorsService,
    private boletosService: BoletosService,
    private meta: Meta,
    private titleService: Title

  ) {
    this.role = this.functionsService.getLocal('role')
    this.uid = this.functionsService.getLocal('uid')
  }
  ngOnInit(): void {
    const titulo = 'Invitaciones Digitales y Logistica de eventos- MyTicketParty';
    const descripcion = 'Crea y personaliza invitaciones digitales para tus eventos con MyTicketParty. Gestiona boletos, asigna mesas y comparte tu celebración fácilmente.';
    this.functionsService.removeTags()
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
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
    this.getUser(this.role)
  }

  getUser(role) {
    if (role == this.SLN || role == this.ANF) {

      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {

        if (resp.usuario.salon.length < 1 || resp.usuario.salon == undefined || resp.usuario.salon == null) {

          this.functionsService.navigateTo('core/salones/registrar-salon')

        }

      },
        (error) => {
          this.functionsService.alertError(error, 'Home')
        })
    }
    else if (role == this.PRV) {

      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {


        if (resp.usuario.salon.length < 1 || resp.usuario.salon == undefined || resp.usuario.salon == null) {

          Swal.fire({
            title: "¿Tienes alguna ubicación?  ",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Si",
            confirmButtonColor: "#13547a",
            denyButtonText: `No`,
            denyButtonColor: "#81d0c7",
          }).then((result) => {


            if (result.isConfirmed) {

              this.functionsService.navigateTo('core/salones/registrar-salon')



            } else if (result.isDenied) {

              this.proveedorsService.cargarProveedorsByCreador(this.uid).subscribe(resp => {
                if (resp.proveedors.length == 0) {
                  this.functionsService.navigateTo('core/proveedores/editar-datos')
                }

              })
            }
          });

        }

        /* if (resp.usuario.proveedor.length < 1 || resp.usuario.proveedor == undefined || resp.usuario.proveedor == null) {
          this.functionsService.navigateTo('core/proveedores/editar-datos')
        } */


      },
        (error) => {
          this.functionsService.alertError(error, 'Home')
        })








    }
  }







  scan() {


    this.scannerActive = true
    setTimeout(() => {
      this.scannerActive = false
    }, 15000);




  }

  stop() {
    this.scannerActive = false
  }
  showQr(qr: any) {

    if (qr.ok) {

      this.stop()


      this.boletosService.cargarBoletoByFiesta(qr.data.fiesta).subscribe((res: any) => {
        this.idx = undefined
        this.editBoleto = true
        let invi: any = qr.data.invitado
        let bt: any = res.boleto[0].invitados
        this.boleto = res.boleto[0]

        bt.includes(invi)


        bt.forEach((b, index) => {

          if (
            b.grupo == invi.grupo &&
            b.nombreGrupo == invi.nombreGrupo &&
            b.cantidad == invi.cantidad
          ) {

            this.idx = index

          } else {


          }

        });

        /* this.functionsService.alert('Check in', 'El boleto ha sido modificado favor de comunicarse con el anfitrión', 'error') */
        if (this.idx !== undefined) {
          this.editBoleto = true
          this.invitado = bt[this.idx]
          this.invitado.confirmado = true



          this.boletosService.actualizarBoletoRegistro(this.boleto).subscribe(res => {

            this.functionsService.alertUpdate('Confirmaste tu asistencia')


          },
            (error) => {
              console.error('Error', error)
              this.functionsService.alertError(error, 'Confirma asistencia')
            })
        } else {
          this.editBoleto = false
          this.invitado = undefined
          this.functionsService.alert('Check in', 'El boleto ha sido modificado favor de comunicarse con el anfitrión', 'error')
        }

      })



    } else {
      this.functionsService.alert('Check in', 'El ha sucedido algo extraño', 'error')
    }


  }


}
