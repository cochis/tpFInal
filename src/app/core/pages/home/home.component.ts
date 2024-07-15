import { AfterViewInit, Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { UsuariosService } from '../../services/usuarios.service';
import { CargarUsuario } from '../../interfaces/cargar-interfaces.interfaces';
import { BoletosService } from '../../services/boleto.service';
import { Boleto } from '../../models/boleto.model';
import Swal from 'sweetalert2';
import { TokenPushsService } from '../../services/tokenPush.service';
import { SwPush } from '@angular/service-worker';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  scannerActive = false
  today: Number = this.functionsService.getToday()
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  editBoleto = false
  role = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  invitado: any
  idx: number = undefined
  boleto: Boleto
  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private boletosService: BoletosService,
    private tokenPushService: TokenPushsService,
    private swpush: SwPush,

  ) {
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
            /* Swal.fire({
              title: "Notificaciones",
              text: "¿Quieres que te enviemos notificaciones de la fiesta?",
              icon: "info",
              showCancelButton: true,
              confirmButtonColor: "#13547a",
              cancelButtonColor: "#80d0c7",
              confirmButtonText: "Si",
              cancelButtonText: "No"
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Permisos",
                  text: "Acepta los permisos de notificaciones",
                  icon: "success"
                });

                this.functionsService.subscribeToPush().then(resp => {
                  // console.log('resp::: ', resp);


                  let token = {
                    tokenPush: resp,
                    fiesta: qr.data.fiesta,
                    activated: true,

                  }

                  this.tokenPushService.crearTokenPush(token).subscribe(resp => {
                    // console.log('resp::: ', resp);

                  })

                })
              }
            }); */

          },
            (error) => {
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
