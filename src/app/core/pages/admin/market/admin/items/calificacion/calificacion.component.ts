import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarCotizacion } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Cotizacion } from 'src/app/core/models/cotizacion.model';
import { CalificacionesService } from 'src/app/core/services/calificacion.service';
import { CotizacionesService } from 'src/app/core/services/cotizacion.service';
import { ItemsService } from 'src/app/core/services/item.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Calificacion } from '../../../../../../models/calificacion.model';
@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent {
  id!: string
  cotizacion: any
  loading = false
  submited = false
  thankOk = false
  calificacion: Calificacion
  today: Number = Number(this.functionsService.getToday())
  uid = this.functionsService.getLocal('uid')
  public form!: FormGroup
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cotizacionesService: CotizacionesService,
    private itemsService: ItemsService,
    private functionsService: FunctionsService,
    private calificacionesService: CalificacionesService
  ) {
    this.id = this.route.snapshot.params['id']

    this.getId(this.id)
    this.createForm()
    this.getCal(this.id)
  }

  getCal(id) {
    this.calificacionesService.cargarCalificacionesByCotizacion(id).subscribe((res: any) => {

      if (res.calificacion.length > 0) {
        this.thankOk = true
      }

    })
  }
  get errorControl() {
    return this.form.controls;
  }
  get productos(): FormArray {
    return this.form.get('productos') as FormArray
  }
  getId(id: string) {
    this.loading = true
    this.cotizacionesService.cargarCotizacionById(id).subscribe((resp: any) => {

      this.cotizacion = resp.cotizacion

      this.setForm(this.cotizacion)



    },
      (error: any) => {

        this.functionsService.alertError(error, 'Productos y Servicios')
        this.loading = false


      })
  }
  addProductos() {
    this.productos.push(this.newProducto())

    this.submited = false
    window.scrollTo(0, (document.body.scrollHeight - 100));


  }
  removeProductos(i: number) {
    this.productos.removeAt(i);
  }
  setProducto(pc: any): FormGroup {


    return this.fb.group({
      calificacion: [3],
      prod: [pc.item.uid],
      nombre: [pc.item.nombre],
      opcion: [pc.opcion],


    })
  }
  newProducto(): FormGroup {
    return this.fb.group({
      calificacion: [3, [Validators.required]],
      prod: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      opcion: ['', [Validators.required]],

    })
  }
  onSubmit() {
    this.loading = true
    this.submited = true


    if (this.form.valid) {



      this.calificacion = {
        cotizacion: this.id,
        calificacionPlat: this.form.value.calificacionPlat,
        comentarios: this.form.value.comentarios,
        productos: this.form.value.productos,
        usuarioCreated: this.uid,
        activated: true,
        dateCreated: this.today,
        lastEdited: this.today
      }


      this.calificacionesService.crearCalificacion(this.calificacion).subscribe(res => {

        this.form.value.productos.forEach(pr => {

          this.itemsService.calificarItem(pr.prod, pr.calificacion).subscribe(res => {


          })
        });
        this.loading = false
        this.thankOk = true
      })


    } else {

      this.functionsService.alertForm('Productos y Servicios')
      this.loading = false
      return // console.info('Please provide all the required values!');
    }





  }
  createForm() {
    this.form = this.fb.group({

      idCotizacion: ['', [Validators.required, Validators.minLength(3)]],
      cotizacion: ['', [Validators.required, Validators.minLength(3)]],
      comentarios: [''],
      proveedor: ['', [Validators.required, Validators.minLength(3)]],
      calificacionPlat: [3, [Validators.required, Validators.minLength(3)]],
      productos: this.fb.array([]),
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })

  }
  setForm(cotizacion) {

    this.form = this.fb.group({
      idCotizacion: [this.id, [Validators.required, Validators.minLength(3)]],
      cotizacion: [cotizacion.nombreEvento, [Validators.required, Validators.minLength(3)]],
      comentarios: [''],
      proveedor: [cotizacion.proveedor, [Validators.required, Validators.minLength(3)]],
      calificacionPlat: [3, [Validators.required, Validators.minLength(3)]],
      productos: this.fb.array([]),
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
    this.cotizacion.productos.forEach((pc: any) => {

      this.productos.push(this.setProducto(pc))
    });
    this.loading = false
  }
  back() {
    this.functionsService.navigateTo('/')
  }
  setCalificacion(i) {


  }
}
