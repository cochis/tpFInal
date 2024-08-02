import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarStatusCompra, CargarPaquetes, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Compra } from 'src/app/core/models/compra.model';
import { StatusCompra } from 'src/app/core/models/statusCompra.model';
import { Paquete } from 'src/app/core/models/paquete.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { ComprasService } from 'src/app/core/services/compra.service';
import { PaypalService } from 'src/app/core/services/paypal.service';
import { StatusComprasService } from 'src/app/core/services/statusCompra.service';
import { PaquetesService } from 'src/app/core/services/paquete.service';
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
  paquetesTipo: Paquete[]
  statusCompra: StatusCompra
  paqueteSeleccionado: Paquete
  clave = ''
  compra: Compra
  id: string
  uid = this.functionsService.getLocal('uid')
  PAGSC = environment.PAGSC
  url = environment.text_url
  urlImg = environment.base_url = environment.base_url
  today: Number = this.functionsService.getToday()
  readOn = false
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private statusComprasService: StatusComprasService,
    private paquetesService: PaquetesService,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private functionsService: FunctionsService,
    private paypalService: PaypalService,
  ) {
    this.id = this.route.snapshot.params['usuario']
    // console.log(' this.id ::: ', this.id);

    this.getCatalogos()
    this.createForm()
  }
  createForm() {
    this.form = this.fb.group({
      usuario: [this.uid],
      paquetes: this.fb.array([], Validators.required),
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  getCatalogos() {
    this.paquetesService.cargarPaquetesAll().subscribe(resp => {
      this.paquetesTipo = resp.paquetes
      // console.log('this.paquetesTipo::: ', this.paquetesTipo);

    })
    this.usuariosService.cargarUsuarioById(this.id).subscribe((resp: CargarUsuario) => {

      this.usuario = resp.usuario
      // console.log('this.usuario::: ', this.usuario);

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

    this.statusComprasService.cargarStatusCompraByStep(1).subscribe((resp: CargarStatusCompra) => {
      // console.log('resp::: ', resp);

      this.statusCompra = resp.statusCompra
      // console.log('this.statusCompra::: ', this.statusCompra);

    },
      (error: any) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Estatus de compra')
        this.loading = false
      })

  }
  setTipos(event, i) {

    this.paquetesTipo.forEach((paquete: any) => {

      if (paquete.tipo == event) {
        this.paqueteSeleccionado = paquete

      }
    });


    this.paquetes.controls[i].patchValue({ paquete: '', costo: '', img: '', cantidad: '' });



  }
  selectPaquete(event, i) {

    if (event !== '') {

      this.paquetesTipo.forEach(paquete => {
        if (paquete.uid == event) {
          this.paqueteSeleccionado = paquete

        }
      });

      // console.log('this.paqueteSeleccionado::: ', this.paqueteSeleccionado);
      var cantidad = 0
      if (this.paqueteSeleccionado.tipoCosto.includes('mensual')) {
        cantidad = 12

      }
      this.paquetes.controls[i].patchValue(
        {
          costo: this.paqueteSeleccionado.costo,
          tipoCosto: this.paqueteSeleccionado.tipoCosto,
          cantidad: this.paqueteSeleccionado.tipoCosto.includes('mensual') ? 12 : 1,
          img: this.paqueteSeleccionado.img
        });
    } else {
      this.paquetes.controls[i].patchValue(
        {
          costo: '',
          tipoCosto: '',
          cantidad: '',
          img: ''
        });

    }
    // console.log('this.paquetes.controls[i]::: ', this.paquetes.controls[i].value);
  }
  back() {
    this.functionsService.navigateTo('/core/mis-compras')
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
        tipoCosto: paquete.tipoCosto,
        img: paquete.img,
        costo: paquete.costo,
      })
    } else {

      return this.fb.group({
        tipo: '',
        paqueteActual: '',
        cantidad: '',
        tipoCosto: '',
        img: '',
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
  onSubmit() {
    this.loading = true
    if (this.form.valid) {
      var paqs = []
      this.paquetesTipo.forEach((pt, i) => {
        this.form.value.paquetes.forEach((el, j) => {
          if (el.paqueteActual === this.paquetesTipo[i].uid) {
            pt.img = this.urlImg + '/upload/paquetes/' + pt.img
            pt.value = el.cantidad
            paqs.push(pt)
          }
        });

      });
      let compra = {

        items: paqs,
        url_success: this.url + 'core/fiestas/vista-fiestas',
        url_cancel: this.url + 'core/compras/crear-compra/' + this.uid,
        usuarioCreated: this.uid,
        lastEdited: this.today,
        dateCreated: this.today,
        activated: true,
      }

      // console.log('compra::: ', compra);
      this.comprasService.crearCompra(compra).subscribe({
        error: (err) => console.error('Error', err)
      })
    }
  }
  async setTime(data) {
    return await data
  }

}



