import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarFondo } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Fondo } from 'src/app/core/models/fondo.model';
import { FileService } from 'src/app/core/services/file.service';
import { FondosService } from 'src/app/core/services/fondo.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-fondo',
  templateUrl: './editar-fondo.component.html',
  styleUrls: ['./editar-fondo.component.scss']
})
export class EditarFondoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  fondo: Fondo
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

    private fondosService: FondosService,
    private fileService: FileService,
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

    this.fondosService.cargarFondoById(id).subscribe((resp: CargarFondo) => {

      this.fondo = resp.fondo

      setTimeout(() => {

        this.setForm(this.fondo)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Fondos')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.minLength(3)]],
      img: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(fondo: Fondo) {



    this.form = this.fb.group({
      nombre: [fondo.nombre, [Validators.required, Validators.minLength(3)]],
      tipo: [fondo.tipo, [Validators.required]],
      value: [fondo.value, [Validators.required, Validators.minLength(3)]],
      activated: [fondo.activated],
      dateCreated: [fondo.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.tipo = this.form.value.tipo.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.tipo === '') {
      this.functionsService.alertForm('Fondos')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.fondo = {
        ...this.fondo,
        ...this.form.value,


      }
      this.fondosService.actualizarFondo(this.fondo).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Fondos')
        this.functionsService.navigateTo('core/fondos/vista-fondos')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'Fondos')


        })
    } else {

      //message
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
      this.functionsService.alert('Fondos', 'No se encontró imagen', 'error')
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
          this.functionsService.alertUpdate('Usuarios')
        },
        (err) => {
          console.error('Error', err)
          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }
}
