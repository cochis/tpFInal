import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarBoleto, CargarFiesta } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TokenPushsService } from 'src/app/core/services/tokenPush.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-by-images',
  templateUrl: './by-images.component.html',
  styleUrls: ['./by-images.component.scss']
})
export class ByImagesComponent {
  loading = false
  formActive: Boolean = false
  today = this.functionsService.getToday()
  tamanoDispositivo = 1024
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
  bgX = 50
  bgY = 50
  date: number = this.today + 123456789
  res: number
  formCheck: boolean = false
  qrOk = false
  clockOK = false
  textClock = ' Empezamos '
  form: FormGroup
  url = environment.base_url
  nombre
  nombreEvento = []
  initNombre = []
  cNombreEvento = 0
  fiestaid: string = ''
  fiesta: Fiesta
  boletoid: string = ''
  boleto: Boleto
  cantidad = 0

  salon: Salon
  invitadoId: any
  invitado: any
  idx: any
  editBoleto = false
  constructor(
    private functionsService: FunctionsService,
    private route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private boletosService: BoletosService,
    private salonsService: SalonsService,
    private fiestasService: FiestasService,
    private tokenPushService: TokenPushsService
  ) {
    this.init()
    this.restParty()
  }
  init() {

    this.fiestaid = this.route.snapshot.params['fiesta']
    this.boletoid = this.route.snapshot.params['boleto']
    this.invitadoId = Number(this.route.snapshot.params['invitado'])
    this.boletosService.cargarBoletoById(this.boletoid).subscribe((resp: CargarBoleto) => {
      this.boleto = resp.boleto
      this.cantidad = this.boleto.cantidadInvitados
      this.loading = false

    })
    this.fiestasService.cargarFiestaById(this.fiestaid).subscribe((resp: CargarFiesta) => {
      this.fiesta = resp.fiesta
      this.date = this.fiesta.fecha
      this.salon = this.fiesta.salon
      this.nombre = this.fiesta.nombre.split(' ')
      this.cNombreEvento = this.nombre.length
      this.nombre.forEach(ele => {
        if (ele[0] !== undefined) {
          this.initNombre.push(ele[0])
          this.nombreEvento.push(ele.slice(1, ele.length))
        }

      });

      this.loading = false

    })

    setTimeout(() => {
      this.loading = false
      this.qrOk = true

    }, 1000);

  }
  getQr(boleto) {
    let qr = {
      uid: boleto.uid,
      fiesta: boleto.fiesta,
      grupo: boleto.grupo,
      salon: boleto.salon,
      nombreGrupo: boleto.nombreGrupo,
      whatsapp: boleto.whatsapp,
      email: boleto.email,
      cantidadInvitados: boleto.cantidadInvitados,
      ocupados: boleto.ocupados,
      confirmado: boleto.confirmado,
      invitacionEnviada: boleto.invitacionEnviada,
      fechaConfirmacion: boleto.fechaConfirmacion,
      activated: boleto.activated
    }


    return JSON.stringify(this.boleto)

  }
  restParty() {


    let i = 0
    const interval = setInterval((): void => {

      if (this.date > 0) {
        ++i

        let d = (this.date - this.functionsService.getToday()) / 86400000
        this.dias = Math.trunc(d)


        let hr = ((this.date - this.functionsService.getToday()) % 86400000)
        this.horas = Math.trunc(hr / 3600000)


        let min = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000))

        this.minutos = Math.trunc(min / 60000)

        let seg = (this.date - this.functionsService.getToday()) - ((this.dias * 86400000) + (this.horas * 3600000) + (this.minutos * 60000))

        this.segundos = Math.trunc(seg / 1000)


        if (this.date <= this.functionsService.getToday()) {

          this.clockOK = true

        }

      }
    }, 1000);

  }
  confirmar(data) {
    /*     this.loading = true */
    data = JSON.parse(data)
    data.confirmado = !data.confirmado
    if (data.confirmado) {

      data.fechaConfirmacion = this.today
    } else {
      data.fechaConfirmacion = null
    }

    this.boletosService.actualizarBoletoRegistro(data).subscribe((res: any) => {

      this.boleto = res.boletoActualizado
      this.functionsService.alertUpdate('Confirmación actualizada')
      /*  Swal.fire({
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
           
 
 
           })
         }
       }); */

    },
      (error) => {
        this.functionsService.alertError(error, 'Confirma asistencia')
      })




    this.loading = false



  }
}
