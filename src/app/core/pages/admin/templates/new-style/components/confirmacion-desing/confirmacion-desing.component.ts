import { AfterViewInit, Component, Input } from '@angular/core';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-confirmacion-desing',
  templateUrl: './confirmacion-desing.component.html',
  styleUrls: ['./confirmacion-desing.component.scss']
})
export class ConfirmacionDesingComponent implements AfterViewInit {
  @Input() data: any
  @Input() boleto: any
  @Input() fiesta: any
  today = this.functionsService.getToday()
  loading = false


  constructor(
    private functionsService: FunctionsService,
    private boletosService: BoletosService) {

  }
  ngAfterViewInit(): void {
    this.data


  }

  confirmar(data, confirmarCheck?: Boolean) {


    this.loading = true
    data = JSON.parse(data)
    this.boleto.confirmado = !this.boleto.confirmado
    if (!this.boleto.confirmado) {
      this.boleto.fechaConfirmacion = undefined
      this.boleto.requeridos = 0
      this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
        this.functionsService.alert('Invitación', 'Se quito la confirmación', 'success')
        this.loading = false
      })
    } else {
      this.boleto.fechaConfirmacion = this.today
      if (this.fiesta.checking) {
        if (confirmarCheck) {

          Swal.fire({
            title: '¿Cuantas personas asistiran?',
            html: `<input type="number" class="form-control" value="${(this.boleto.cantidadInvitados) ? this.boleto.cantidadInvitados : '0'}" step="1"id="range-value"  class="form-control">`,
            input: 'range',
            confirmButtonColor: "#13547a",
            inputValue: (this.boleto.cantidadInvitados) ? this.boleto.cantidadInvitados : '0',
            inputAttributes: {
              min: '0',
              max: '20',
              step: '1',
            },
            didOpen: () => {
              const inputRange = Swal.getInput()!
              const inputNumber = Swal.getPopup()!.querySelector('#range-value') as HTMLInputElement
              // remove default output
              Swal.getPopup()!.querySelector('output')!.style.display = 'none'
              inputRange.style.width = '100%'
              // sync input[type=number] with input[type=range]
              inputRange.addEventListener('input', () => {
                inputNumber.value = inputRange.value
              })
              // sync input[type=range] with input[type=number]
              inputNumber.addEventListener('change', () => {
                inputRange.value = inputNumber.value
              })
            },
          }).then((result) => {
            this.boleto.requeridos = Number(result.value)
            this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
              this.boleto.cantidadInvitados
              this.loading = false
              this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
            })
          });
        } else {
          this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
            this.boleto.cantidadInvitados
            this.loading = false
            this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
          })
        }
      } else {
        this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
          this.boleto.cantidadInvitados
          this.loading = false
          this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
        })
      }

      if (confirmarCheck) {

        Swal.fire({
          title: '¿Cuantas personas asistiran?',
          html: `<input type="number" value="${this.boleto.cantidadInvitados}" step="1"id="range-value">`,
          input: 'range',
          confirmButtonColor: "#13547a",
          inputValue: this.boleto.cantidadInvitados.toString(),
          inputAttributes: {
            min: '0',
            max: '20',
            step: '1',
          },
          didOpen: () => {
            const inputRange = Swal.getInput()!
            const inputNumber = Swal.getPopup()!.querySelector('#range-value') as HTMLInputElement
            // remove default output
            Swal.getPopup()!.querySelector('output')!.style.display = 'none'
            inputRange.style.width = '100%'
            // sync input[type=number] with input[type=range]
            inputRange.addEventListener('input', () => {
              inputNumber.value = inputRange.value
            })
            // sync input[type=range] with input[type=number]
            inputNumber.addEventListener('change', () => {
              inputRange.value = inputNumber.value
            })
          },
        }).then((result) => {
          this.boleto.declinada = false
          this.boleto.requeridos = Number(result.value)
          this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
            this.boleto.cantidadInvitados
            this.loading = false
            this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
          })
        });
      } else {
        this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
          this.boleto.cantidadInvitados
          this.loading = false
          this.functionsService.alert('Invitación', 'Se confirmo tu asistencia', 'success')
        })
      }



    }
  }
  declinar(data, confirmarCheck?: Boolean) {


    this.loading = true
    data = JSON.parse(data)

    this.boleto.declinada = true

    this.boleto.fechaConfirmacion = this.functionsService.getToday()
    this.boleto.requeridos = 0
    this.boleto.cantidadInvitados = 0

    this.boletosService.registrarAsistencia(this.boleto).subscribe((res: any) => {
      this.functionsService.alert('Invitación', 'Gracias por avisar', 'success')
      this.loading = false
    })

  }
  getQr(invitado?) {
    var qr
    if (invitado) {
      qr = {
        uid: this.boleto.uid,
        fiesta: this.boleto.fiesta,
        grupo: this.boleto.grupo,
        salon: this.boleto.salon,
      }
    } else {
      qr = {
        uid: '0000000000',
        fiesta: 'Muestra',
        grupo: 'Muestra',
        salon: 'Muestra',
        nombreGrupo: 'Muestra',
        whatsapp: 'Muestra',
        email: 'Muestra',
        cantidadInvitados: 'Muestra',
        ocupados: 'Muestra',
        confirmado: 'Muestra',
        invitacionEnviada: 'Muestra',
        fechaConfirmacion: 'Muestra',
        activated: true
      }
    }
    return JSON.stringify(qr)
  }
}
