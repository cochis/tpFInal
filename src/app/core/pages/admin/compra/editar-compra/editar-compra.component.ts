import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarCompra, CargarPaquete, CargarPaquetes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Compra } from 'src/app/core/models/compra.model';
import { Paquete } from 'src/app/core/models/paquete.model';
import { ComprasService } from 'src/app/core/services/compra.service';
import { PaquetesService } from 'src/app/core/services/paquete.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar-compra',
  templateUrl: './editar-compra.component.html',
  styleUrls: ['./editar-compra.component.css']
})
export class EditarCompraComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  compra: any
  info: any
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  paquetesDB: Paquete[]
  urlImg = environment.base_url = environment.base_url
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  CHK = environment.chk_role
  ANF = environment.anf_role
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private comprasService: ComprasService,

    private route: ActivatedRoute,
    private paquetesService: PaquetesService

  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getCatalogos()

    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.comprasService.cargarCompraById(id).subscribe((resp: CargarCompra) => {
      this.compra = resp.compra

      this.info = this.compra.compra.info;
      this.info.paquetes.forEach((paq: any, i: number) => {
        this.paquetesService.cargarPaqueteById(paq.uid).subscribe((resp: CargarPaquete) => {
          this.info.paquetes[i].infoPaq = resp.paquete
        })
      });



      setTimeout(() => {

        this.setForm(this.info)
      }, 800);

    },
      (error: any) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Compras')
        this.loading = false


      })
  }
  getCatalogos() {
    this.loading = true

    this.paquetesService.cargarPaquetesAll().subscribe((resp: CargarPaquetes) => {
      this.paquetesDB = this.functionsService.getActives(resp.paquetes)


    },
      (error: any) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Paquetes')
        this.loading = false
      })

    this.getId(this.id)
  }


  get errorControl() {
    return this.form.controls;
  }
  get paquetes(): FormArray {
    return this.form.get("paquetes") as FormArray
  }
  newPaquete(paquete?): FormGroup {
    if (paquete) {


      return this.fb.group({
        nombre: paquete.infoPaq.nombre,
        tipo: paquete.infoPaq.tipo,
        value: paquete.infoPaq.value,
        cantidad: paquete.cantidad,
        costo: paquete.costo,
        vigencia: paquete.infoPaq.vigencia,
        tipoVigencia: paquete.infoPaq.tipoVigencia,
        typeOfVigencia: paquete.infoPaq.typeOfVigencia,
        img: paquete.infoPaq.img,
      })
    } else {
      return this.fb.group({
        nombre: '',
        tipo: '',
        value: '',
        cantidad: '',
        costo: '',
        vigencia: '',
        tipoVigencia: '',
        typeOfVigencia: '',
        img: '',
      })
    }
  }
  addPaquetes() {
    this.paquetes.push(this.newPaquete());
  }
  removePaquete(i: number) {
    this.paquetes.removeAt(i);
  }
  createForm() {
    this.form = this.fb.group({
      paquetes: this.fb.array([]),
      activa: [false],
      total: [''],
      iva: [''],
      fechaCompra: [this.today],

    })
  }
  setForm(compra: any) {



    this.form = this.fb.group({
      paquetes: this.fb.array([]),
      activa: [compra.activa],
      total: [compra.total.toFixed(2)],
      iva: [compra.iva.toFixed(2)],
      fechaCompra: [this.functionsService.numberToDate(compra.date)],

    })
    compra.paquetes.forEach(paq => {

      this.paquetes.push(this.newPaquete(paq));

    });


  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Compras')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.compra = {
        ...this.compra,
        ...this.form.value,


      }
      this.comprasService.actualizarCompra(this.compra).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Compras')
        this.functionsService.navigateTo('core/compras/vista-compras')
        this.loading = false
      },
        (error) => {
          console.error('error::: ', error);
          this.loading = false
          this.functionsService.alertError(error, 'Compras')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/mis-compras')
  }

}

