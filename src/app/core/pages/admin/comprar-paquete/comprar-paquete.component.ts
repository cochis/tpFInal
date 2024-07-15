import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoCantidades, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { PaypalService } from 'src/app/core/services/paypal.service';
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-comprar-paquete',
  templateUrl: './comprar-paquete.component.html',
  styleUrls: ['./comprar-paquete.component.css']
})
export class ComprarPaqueteComponent {
  public form!: FormGroup
  loading: boolean = false;
  msnOk: string = ''
  usuario: Usuario
  paquetes: TipoCantidad[]
  paqueteSeleccionado: TipoCantidad
  id: string
  today: Number = this.functionsService.getToday()
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private tipoCantidadesService: TipoCantidadesService,
    private route: ActivatedRoute,
    private functionsService: FunctionsService,
    private paypalService: PaypalService
  ) {
    this.id = this.route.snapshot.params['usuario']

    this.getCatalogos()
    this.createForm()
  }
  createForm() {
    this.form = this.fb.group({
      paqueteActual: ['', [Validators.required]],
      cantidadFiestas: [''],
      costo: [''],
      lastEdited: [this.today],
    })
  }
  async getCatalogos() {
    let res = await this.paypalService.tokenPaypal()
    this.usuariosService.cargarUsuarioById(this.id).subscribe((resp: CargarUsuario) => {

      this.usuario = resp.usuario

      if (this.usuario.activated) {
      }
      else {
        this.functionsService.alertError({}, 'Usuario no activado')
      }


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Fiestas')
        this.loading = false
      })
    this.tipoCantidadesService.cargarTipoCantidadesAll().subscribe((resp: CargarTipoCantidades) => {
      this.paquetes = resp.tipoCantidades

    })
  }
  selectPaquete(event) {
    this.paquetes.forEach(paquete => {
      if (paquete.uid == event) {
        this.paqueteSeleccionado = paquete
      }
    });
    this.form.patchValue({
      cantidadFiestas: this.paqueteSeleccionado.value,
      costo: this.paqueteSeleccionado.costo,
    })
  }
}



