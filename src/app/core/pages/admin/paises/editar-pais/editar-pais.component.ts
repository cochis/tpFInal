import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarPais } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Pais } from 'src/app/core/models/pais.model';
import { PaisesService } from 'src/app/core/services/pais.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-pais',
  templateUrl: './editar-pais.component.html',
  styleUrls: ['./editar-pais.component.scss']
})
export class EditarPaisComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  pais: Pais
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

    private paisesService: PaisesService,

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

    this.paisesService.cargarPaisById(id).subscribe((resp: CargarPais) => {

      this.pais = resp.pais

      setTimeout(() => {

        this.setForm(this.pais)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Paises')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      clave: ['', [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(pais: Pais) {



    this.form = this.fb.group({
      nombre: [pais.nombre, [Validators.required]],
      clave: [pais.clave, [Validators.required]],
      activated: [pais.activated],
      dateCreated: [pais.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Paises')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.pais = {
        ...this.pais,
        ...this.form.value,


      }
      this.paisesService.actualizarPais(this.pais).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Paises')
        this.functionsService.navigateTo('core/paises/vista-paises')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Paises')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/paises/vista-paises')
  }

}
