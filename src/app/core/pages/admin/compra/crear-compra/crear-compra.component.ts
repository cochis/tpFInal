import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarStatusCompra, CargarTipoCantidades, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Compra } from 'src/app/core/models/compra.model';
import { StatusCompra } from 'src/app/core/models/statusCompra.model';
import { TipoCantidad } from 'src/app/core/models/tipoCantidad.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { ComprasService } from 'src/app/core/services/compra.service';
import { PaypalService } from 'src/app/core/services/paypal.service';
import { StatusComprasService } from 'src/app/core/services/statusCompra.service';
import { TipoCantidadesService } from 'src/app/core/services/tipoCantidad.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crear-compra.component.html',
  styleUrls: ['./crear-compra.component.css']
})
export class CrearCompraComponent {
  public form!: FormGroup
  loading: boolean = false;
  msnOk: string = ''
  usuario: Usuario
  paquetesTipo: TipoCantidad[]
  statusCompra: StatusCompra
  paqueteSeleccionado: TipoCantidad
  clave = ''
  compra: Compra
  id: string
  uid = this.functionsService.getLocal('uid')
  PAGSC = environment.PAGSC

  today: Number = this.functionsService.getToday()
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private statusComprasService: StatusComprasService,
    private tipoCantidadesService: TipoCantidadesService,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private functionsService: FunctionsService,
    private paypalService: PaypalService,
  ) {
    this.id = this.route.snapshot.params['usuario']

    this.getCatalogos()
    this.createForm()
  }
  createForm() {
    this.form = this.fb.group({

      paquetes: this.fb.array([]),
      paquete: ['', [Validators.required]],
      cantidadFiestas: [''],
      costo: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  getCatalogos() {
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
      ;
    this.statusComprasService.cargarStatusCompraByStep(1).subscribe((resp: CargarStatusCompra) => {

      this.statusCompra = resp.statusCompra

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Estatus de compra')
        this.loading = false
      })
    this.tipoCantidadesService.cargarTipoCantidadesAll().subscribe((resp: CargarTipoCantidades) => {
      this.paquetesTipo = resp.tipoCantidades

    })
  }
  setTipos(value, i) {

  }
  selectPaquete(event, i) {
    this.paquetesTipo.forEach(paquete => {
      if (paquete.uid == event) {
        this.paqueteSeleccionado = paquete
      }
    });

    this.paquetes.controls[i].patchValue({ costo: this.paqueteSeleccionado.costo, cantidad: this.paqueteSeleccionado.value });
  }
  back() {
    this.functionsService.navigateTo('/core/fiestas/vista-fiestas')
  }

  get paquetes(): FormArray {
    return this.form.get('paquetes') as FormArray
  }


  newPaquete(paquete?): FormGroup {
    if (paquete) {
      return this.fb.group({
        tipo: paquete.tipo,
        paqueteActual: paquete.paqueteActual,
        cantidad: paquete.cantidad,
        costo: paquete.costo,
      })
    } else {

      return this.fb.group({
        tipo: '',
        paqueteActual: '',
        cantidad: '',
        costo: '',
      })
    }
  }

  addPaquete() {
    this.paquetes.push(this.newPaquete());
  }
  setPaquete(paquete) {
    this.paquetes.push(this.newPaquete(paquete));
  }
  removePaquete(i: number) {
    this.paquetes.removeAt(i);
  }
  async onSubmit() {
    this.loading = true
    if (this.form.valid) {
      let compra = {
        ...this.form.value,

        usuario: this.uid,
        status: this.statusCompra.uid,
        iva: (this.form.value.costo * .16),
        paypalData: null,
        usuarioCreated: this.uid,
        activated: true,
      }
      this.clave = this.statusCompra.clave

      this.comprasService.crearCompra(compra).subscribe(async (resp) => {
        try {
          await this.setTime(resp).then((res: any) => {

            this.compra = res.compra
            this.statusComprasService.cargarStatusCompraByStep(2).subscribe(async (resp: CargarStatusCompra) => {
              this.statusCompra = resp.statusCompra
              this.clave = this.statusCompra.clave

              await this.setTime(resp).then((resp2) => {
                let compra = {
                  ...res.compra,
                  status: this.statusCompra.uid,
                  lastEdited: this.today
                }


                /*     this.comprasService.actualizarCompra(compra).subscribe(async (resp2: any) => {
                      this.compra = resp2.compraActualizado
                      this.statusComprasService.cargarStatusCompraByStep(3).subscribe(async (resp3: CargarStatusCompra) => {
                        this.statusCompra = resp3.statusCompra
                        this.clave = this.statusCompra.clave
                        await this.setTime(resp3).then((resp3) => {
                          compra = {
                            ...compra,
                            status: this.statusCompra.uid
                          }
                          this.comprasService.actualizarCompra(compra).subscribe(async (resp4: any) => {
                            this.compra = resp4.compraActualizado
                            this.clave = this.statusCompra.clave
                            if (this.compra.status == this.statusCompra.uid && this.statusCompra.clave == this.clave) {
                              this.usuariosService.cargarUsuarioById(this.usuario.uid).subscribe((resp5: any) => {
                                this.usuario = resp5.usuario
                                this.usuario.cantidadFiestas = this.usuario.cantidadFiestas + this.compra.cantidadFiestas
                                this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp6: any) => {
                                  this.functionsService.navigateTo('/core/fiestas/vista-fiestas')
    
                                  this.loading = false
                                })
    
                              })
    
                            }
                          })
    
                        })
                      })
    
                    }) */
              })
            },
              (error: any) => {
                this.functionsService.alertError(error, 'Estatus de compra')
                this.loading = false
              })
          })

        } catch (error) {
          // console.logror::: ', error);
        }
      })

    }
  }
  async setTime(data) {


    return await data


  }

}



