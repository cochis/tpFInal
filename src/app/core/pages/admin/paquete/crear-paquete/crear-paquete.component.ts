import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paquete } from 'src/app/core/models/paquete.model';
import { FileService } from 'src/app/core/services/file.service';

import { PaquetesService } from 'src/app/core/services/paquete.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-crear-paquete',
  templateUrl: './crear-paquete.component.html',
  styleUrls: ['./crear-paquete.component.css']
})
export class CrearPaqueteComponent {
  loading = false
  paquete: Paquete
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
    private paquetesService: PaquetesService,

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
  get descripciones(): FormArray {
    return this.form.get('descripciones') as FormArray
  }
  newDescripcion(descripcion?): FormGroup {
    if (descripcion) {
      return this.fb.group({
        info: descripcion.info
      })
    } else {

      return this.fb.group({
        info: ''
      })
    }
  }


  addDescripcion() {
    this.descripciones.push(this.newDescripcion());
  }
  setDescripcion(paquete) {
    this.descripciones.push(this.newDescripcion(paquete));
  }
  removeDescripcion(i: number) {
    this.descripciones.removeAt(i);
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      costo: ['', [Validators.required, Validators.minLength(3)]],
      img: [''],
      tipoCosto: ['', [Validators.required, Validators.minLength(3)]],
      tipoPaquete: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      descripciones: this.fb.array([]),
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true


    // console.log('this.form.value::: ', this.form.value);


    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.paquetesService.crearPaquete(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Paquete', 'Paquete creado', 'success')
        this.functionsService.navigateTo('core/paquete/vista-paquetes')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo de Cantidades')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('Tipo de Cantidades')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  cambiarImagen(file: any) {
    this.imagenSubir = file.target.files[0]
    if (!file.target.files[0]) {
      this.imgTemp = null

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
      .actualizarFoto(this.imagenSubir, 'paquetes', this.paquete.uid)
      .then(
        (img) => {
          this.paquete.img = img
          //message
        },
        (err) => {

          //message

        },
      )
  }
  back() {
    this.functionsService.navigateTo('core/paquete/vista-paquetes')
  }

}

