import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoCentro } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoCentro } from 'src/app/core/models/tipoCentro.model';
import { TipoCentrosService } from 'src/app/core/services/tipoCentros.service';



import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-centro',
  templateUrl: './editar-tipo-centro.component.html',
  styleUrls: ['./editar-tipo-centro.component.css']
})
export class EditarTipoCentroComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoCentro: TipoCentro
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

    private tipoCentrosService: TipoCentrosService,

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

    this.tipoCentrosService.cargarTipoCentroById(id).subscribe((resp: CargarTipoCentro) => {

      this.tipoCentro = resp.tipoCentro
      setTimeout(() => {

        this.setForm(this.tipoCentro)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoCentros')
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
  setForm(tipoCentro: TipoCentro) {



    this.form = this.fb.group({
      nombre: [tipoCentro.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoCentro.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoCentro.activated],
      dateCreated: [tipoCentro.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('TipoCentros')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoCentro = {
        ...this.tipoCentro,
        ...this.form.value,


      }
      this.tipoCentrosService.actualizarTipoCentro(this.tipoCentro).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Tipo de centros de eventos')
        this.functionsService.navigateTo('core/tipo-centros/vista-tipo-centros')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'TipoCentros')


        })
    } else {

      //message
      this.loading = false

      return console.log('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/tipo-centros/vista-tipo-centros')
  }

}
