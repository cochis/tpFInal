import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'jquery';
import { CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Boleto } from 'src/app/core/models/boleto.model';
import { BoletosService } from 'src/app/core/services/boleto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';


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
    // console.log('qr::: ', qr);



    if (qr.ok) {

      this.stop()




      this.usuariosService.cargarUsuarioById(this.uid).subscribe((resp: CargarUsuario) => {
        // console.log('resp.usuario.salon::: ', resp.usuario);

        if (!resp.usuario.salon.includes(qr.data.salon)) {
          this.functionsService.alert('Boletos', 'Ese boleto no existe en este salon', 'info')
          this.editBoleto = false
          return

        } else {
          this.boletosService.cargarBoletoById(qr.data.uid).subscribe((res: any) => {

            this.idx = undefined
            this.editBoleto = true
            this.boleto = res.boleto


          })
        }


      })

    }
  }

  onSubmit() {
    this.loading = true

    // console.log('this.boleto::: ', this.boleto);

    // console.log('this.form::: ', this.form);
    if (this.boleto.ocupados === 0) {
      this.boleto.ocupados = this.form.value.cantidad
    } else {
      this.boleto.ocupados += this.form.value.cantidad
    }
    // console.log('this.boleto.ocupados::: ', this.boleto.ocupados);
    if (this.boleto.ocupados > this.boleto.cantidadInvitados) {
      this.functionsService.alert('Boletos', 'No tiene disponibles esa cantidad de boletos', 'info')
    }


    // console.log('this.boleto::: ', this.boleto);



    this.boletosService.actualizarBoleto(this.boleto).subscribe(resp => {
      this.functionsService.alertUpdate('Boletos')
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
