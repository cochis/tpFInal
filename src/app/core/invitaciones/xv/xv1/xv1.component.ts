import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { Salon } from 'src/app/core/models/salon.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-xv1',
  templateUrl: './xv1.component.html',
  styleUrls: ['./xv1.component.css'] 
})
export class Xv1Component implements AfterViewInit {
 
 
  loading = false
 
  today = this.functionsService.getToday()
 
  dias = 0
  horas = 0
  minutos = 0
  segundos = 0
   
  date: number = this.today + 199456789
  res: number
  formCheck: boolean = false
  qrOk = false
 
  url = environment.base_url
 
  fiestaid: string = ''
  fiesta: Fiesta
  boletoid: string = ''
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
  
  
  constructor(
    private functionsService: FunctionsService,
    private route: ActivatedRoute, 
    private boletosService: BoletosService,
 
  ) {
    /*    this.init() */
    this.restParty()
 
    this.loading = true
    setTimeout(() => {
      this.invitacion = {
        cPrincipal: 'pink',
        cSecond: '#ee8fa0',
        cWhite: 'white',
        img1:'/assets/images/xv/xv3.jpeg',
        xImg1:50,
        topTitle:40,
        tipoFiesta:'Mis XV',
        topDate:50,
        nombreFiesta:'Pancha',
        textInvitacionValida:'¡Los esperamos!',
        mensajeImg:'/assets/images/xv/xv3.jpeg',
        mensaje1:'Tengo el vestido, la ilusión, la felicidad, el lugar y todo lo que se pueda soñar. Sólo me falta que ustedes estén conmigo en este día.',
        donde1Check:true,
        donde1Img:'/assets/images/xv/xv2.jpg',
        donde1Title:'Iglesia',
        donde1Text:'Basilica de Guadalupe',
        donde1Date:123,
        donde1Icon:'mt-2 mb-2 text-cente bi bi-map pointer',
        donde1AddressUbicacion:' Progreso, Yuc., México',
        donde1Address:'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
        donde2Check:true,
        donde2Img:'/assets/images/xv/xv4.jpg',
        donde2Title:'Civil',
        donde2Text:'Registro',
        donde2Date:789456123,
        donde2Icon:'mt-2 mb-2 text-cente bi bi-map pointer',
        donde2AddressUbicacion:' Progreso, Yuc., México',
        donde2Address:'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
        donde3Check:true,
        donde3Img:'/assets/images/xv/xv3.jpeg',
        donde3Title:'Pachanga',
        donde3Text:'Registro',
        donde3Date:789456123,
        donde3Icon:'mt-2 mb-2 text-center bi bi-map pointer',
        donde3AddressUbicacion:' Progreso, Yuc., México',
        donde3Address:'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846491,-99.1199821,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
         hospedajeCheck: true,
         hospedajeImg: '/assets/images/xv/hotel.jpg',
         hospedajeName:'Pisa y corre',
         hospedajeIcon:'mt-2 mb-2 text-center  bi-info-circle pointer',
         hospedajeAddress:'Centro Comercial City, Av. Andrés García Lavín 298-32, Fundura Montebello, 97113 Mérida, Yuc., México.',
         hospedajeUbicacion:'https://www.google.com/maps/place/la+Bas%C3%ADlica+de+Guadalupe,+Villa+Gustavo+A.+Madero,+07050+Ciudad+de+M%C3%A9xico,+CDMX/@19.4846441,-99.1174072,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f99dd5163e39:0x73360cc13e70980f!8m2!3d19.4846441!4d-99.1174072!16s%2Fg%2F11s0sv5b2v?entry=ttu',
         hospedajeUrl:'https://www.caminoreal.com/',
         hospedajePhone:'529996893000',
         itinerarioCheck:true,
         ItinerarioName:'pancha',
         itinerario:[
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
          {
            name:'Ceremonia',
            hr:'17:00 hrs'
          },
         ] 
      }
      
   
    }, 500);


  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      
      this.loading = false
    }, 1500);
  }
  

 
  getDate(date) {

    this.date = new Date(date).getTime()

  }
  submit() {

  }

  confirmar(data) {
    this.loading = true
    data = JSON.parse(data)
    this.boletosService.cargarBoletoByFiesta(data.fiesta).subscribe((res: any) => {
      this.idx = undefined
      this.editBoleto = true
      this.invitado = res.boleto[0].invitados[this.invitadoId]
      this.invitado.confirmado = true

      this.boletosService.actualizarBoletoRegistro(this.boleto).subscribe(res => {
        this.functionsService.alertUpdate('Boletos')
        Swal.fire({
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
        });

      },
        (error) => {
          this.functionsService.alertError(error, 'Confirma asistencia')
        })


    })
    this.loading = false


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



      }
    }, 1000);

  }
  verUbicacion() {
    let url = this.salon.ubicacionGoogle
    window.open(url, '_blank')
  }

  getQr(invitado) {
    let qr = {
      salon: this.fiesta.salon._id,
      fiesta: this.boleto.fiesta,

    }

    return JSON.stringify(qr)

  }
 }
