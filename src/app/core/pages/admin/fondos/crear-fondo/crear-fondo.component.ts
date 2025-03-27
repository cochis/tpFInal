import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Fondo } from 'src/app/core/models/fondo.model';
import { FileService } from 'src/app/core/services/file.service';

import { FondosService } from 'src/app/core/services/fondo.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-fondo',
  templateUrl: './crear-fondo.component.html',
  styleUrls: ['./crear-fondo.component.css']
})
export class CrearFondoComponent {
  loading = false
  fondo: Fondo
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  public imagenSubir!: File
  public imgTemp: any = undefined

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fileService: FileService,
    private fondosService: FondosService,

  ) {
    this.loading = true

    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.minLength(3)]],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.tipo = this.form.value.tipo.toUpperCase().trim()

      this.fondosService.crearFondo(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Fondo', 'Fondo creado', 'success')



        this.functionsService.navigateTo('core/fondos/editar-fondo/true/' + resp.fondo.uid)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Fondos')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Fondos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/fondos/vista-fondos')
  }


  cambiarImagen(file: any) {
    this.loading = true
    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null
      this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
      this.loading = false
    } else {
      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
      reader.onloadend = () => {
        this.imgTemp = reader.result
      }
      this.subirImagen()
    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'fondos', this.fondo.uid)
      .then(
        (img) => {
          this.fondo.img = img
          this.loading = false
          this.functionsService.alertUpdate('Fondos')
        },
        (err) => {
          console.error('Error', err)
          this.loading = false
          this.functionsService.alert('Fondos', 'Error al subir la imagen', 'error')
        },
      )
  }
}

