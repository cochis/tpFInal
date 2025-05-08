import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarMoneda } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Moneda } from 'src/app/core/models/moneda.model';
import { MonedasService } from 'src/app/core/services/moneda.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-moneda',
  templateUrl: './editar-moneda.component.html',
  styleUrls: ['./editar-moneda.component.scss']
})
export class EditarMonedaComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  moneda: Moneda
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

    private monedasService: MonedasService,

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

    this.monedasService.cargarMonedaById(id).subscribe((resp: CargarMoneda) => {

      this.moneda = resp.moneda

      setTimeout(() => {

        this.setForm(this.moneda)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Monedas')
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
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(moneda: Moneda) {



    this.form = this.fb.group({
      nombre: [moneda.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [moneda.clave, [Validators.required, Validators.minLength(3)]],
      activated: [moneda.activated],
      dateCreated: [moneda.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Monedas')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.moneda = {
        ...this.moneda,
        ...this.form.value,


      }
      this.monedasService.actualizarMoneda(this.moneda).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Monedas')
        this.functionsService.navigateTo('core/monedas/vista-monedas')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Monedas')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/monedas/vista-monedas')
  }

}
