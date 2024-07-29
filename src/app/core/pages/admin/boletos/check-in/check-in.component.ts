import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'jquery';
import { CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements AfterViewInit {
  scannerActive = false
  loading = false
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  idx: number = undefined
  boleto: Boleto
  fiesta: Fiesta
  editBoleto = false
  invitado: any
  today = this.functionsService.getToday()
  role = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  public form!: FormGroup
  constructor(
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private boletosService: BoletosService,
    private fiestasService: FiestasService,
    private fb: FormBuilder,
  ) {
  }
  ngAfterViewInit() {
    this.getUser(this.role)
    this.createForm()
  }
  createForm() {
    this.form = this.fb.group({
      cantidad: ['', [Validators.required]],
    })
  }
  getUser(role) {
    if (role == this.SLN) {
      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
        if (!resp.usuario.salon || resp.usuario.salon == undefined || resp.usuario.salon == null) {
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
      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
        let slns = resp.usuario.salon.filter((salon: any) => {
          if (salon._id == qr.data.salon) {
            return salon
          }
        })
        if (slns.length == 0 && this.role !== this.ADM) {
          this.functionsService.alert('Boletos', 'Ese boleto no existe en este salon', 'info')
          this.editBoleto = false
          return
        } else {
          this.boletosService.cargarBoletoById(qr.data.uid).subscribe((res: any) => {
            this.idx = undefined
            this.boleto = res.boleto
            console.log('  this.boleto ::: ', this.boleto);
            this.fiestasService.cargarFiestaById(this.boleto.fiesta).subscribe((resp) => {
              console.log('resp::: ', resp);
              this.fiesta = resp.fiesta

              if (this.fiesta.checking) {

                this.editBoleto = true
              } else {

                Swal.fire({
                  title: "¿Cuantas personas ingresan?",
                  input: "number",
                  inputAttributes: {
                    min: "0"
                  },
                  showCancelButton: true,
                  confirmButtonText: "Ingresar",
                  showLoaderOnConfirm: true,
                  confirmButtonColor: "#13547a",
                  preConfirm: async (cantidad) => {
                    try {
                      console.log('cantidad::: ', cantidad);
                      this.boleto.confirmado = true
                      this.boleto.ocupados = Number(this.boleto.ocupados) + Number(cantidad)
                      this.boleto.fechaConfirmacion = this.today
                      this.boletosService.actualizarBoleto(this.boleto).subscribe((resp) => {
                        if (this.fiesta.mesaOk) {
                          this.functionsService.alert('Bienvenidos', 'Su lugar se encuentra en la mesa ' + this.boleto.mesa, 'success')

                        } else {
                          this.functionsService.alert('Bienvenidos', 'Los estábamos esperando ', 'success')
                        }
                      })
                    } catch (error) {
                      Swal.showValidationMessage(`
        Request failed: ${error}
      `);
                    }
                  },
                  allowOutsideClick: () => !Swal.isLoading()
                })


              }

            })




          })
        }
      })
    }
  }
  onSubmit() {
    this.loading = true
    if (this.boleto.ocupados === 0) {
      this.boleto.ocupados = this.form.value.cantidad
    } else {
      this.boleto.ocupados += this.form.value.cantidad
    }
    if (this.boleto.ocupados > this.boleto.cantidadInvitados) {
      this.functionsService.alert('Boletos', 'No tiene disponibles esa cantidad de boletos', 'info')
    }
    this.boleto.confirmado = true
    this.boleto.fechaConfirmacion = this.today
    this.boletosService.actualizarBoleto(this.boleto).subscribe(resp => {
      this.functionsService.alert('Bienvenidos', 'Los estábamos esperando ', 'success')
      this.form.reset()
      this.functionsService.alertUpdate('Check in')
      this.editBoleto = false
      this.loading = false
    },
      (error) => {
        this.functionsService.alertError(error, 'Check in')
      })
  }

  back() {
    this.form.reset()
    this.editBoleto = false
  }
}
