import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarStatusCompra } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { StatusCompra } from 'src/app/core/models/statusCompra.model';
import { StatusComprasService } from 'src/app/core/services/statusCompra.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-status-compra',
  templateUrl: './editar-status-compra.component.html',
  styleUrls: ['./editar-status-compra.component.scss']
})
export class EditarStatusCompraComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  statusCompra: StatusCompra
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private statusComprasService: StatusComprasService,

    private route: ActivatedRoute,

  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.statusComprasService.cargarStatusCompraById(id).subscribe((resp: CargarStatusCompra) => {

      this.statusCompra = resp.statusCompra
      setTimeout(() => {

        this.setForm(this.statusCompra)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'StatusCompras')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      step: ['', [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(statusCompra: StatusCompra) {



    this.form = this.fb.group({
      nombre: [statusCompra.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [statusCompra.clave, [Validators.required, Validators.minLength(3)]],
      step: [statusCompra.clave, [Validators.required]],
      activated: [statusCompra.activated],
      dateCreated: [statusCompra.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('StatusCompras')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.statusCompra = {
        ...this.statusCompra,
        ...this.form.value,


      }
      this.statusComprasService.actualizarStatusCompra(this.statusCompra).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Estatus de compra')
        this.functionsService.navigateTo('status-compra/vista-status-compra')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = true
          this.functionsService.alertError(error, 'StatusCompras')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('status-compra/vista-status-compra')
  }

}
