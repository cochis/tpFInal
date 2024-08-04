import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarPaquete } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Paquete } from 'src/app/core/models/paquete.model';
import { FileService } from 'src/app/core/services/file.service';
import { PaquetesService } from 'src/app/core/services/paquete.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-paquete',
  templateUrl: './editar-paquete.component.html',
  styleUrls: ['./editar-paquete.component.css']
})
export class EditarPaqueteComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  paquete: Paquete
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
    private paquetesService: PaquetesService,
    private route: ActivatedRoute,
    private fileService: FileService,
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
    this.paquetesService.cargarPaqueteById(id).subscribe((resp: CargarPaquete) => {
      this.paquete = resp.paquete

      setTimeout(() => {
        this.setForm(this.paquete)
      }, 500);
    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Paquetes')
        this.loading = false
      })
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

    this.descripciones.push(this.newDescripcion({ info: paquete }));
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
      tipoVigencia: ['', [Validators.required]],
      typeOfVigencia: ['', [Validators.required]],
      vigencia: ['', [Validators.required]],
      tipoCosto: ['', [Validators.required, Validators.minLength(3)]],
      tipoPaquete: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required]],
      descripciones: this.fb.array([]),
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  setForm(paquete: Paquete) {

    this.form = this.fb.group({
      tipo: [(paquete.tipo) ? paquete.tipo : '', [Validators.required, Validators.minLength(3)]],
      tipoPaquete: [(paquete.tipoPaquete) ? paquete.tipoPaquete : '', [Validators.required, Validators.minLength(3)]],
      tipoCosto: [(paquete.tipoCosto) ? paquete.tipoCosto : '', [Validators.required, Validators.minLength(3)]],
      nombre: [paquete.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [paquete.clave, [Validators.required, Validators.minLength(3)]],
      value: [paquete.value, [Validators.required]],
      costo: [paquete.costo, [Validators.required]],
      tipoVigencia: [paquete.tipoVigencia, [Validators.required]],
      typeOfVigencia: [paquete.typeOfVigencia, [Validators.required]],
      vigencia: [paquete.vigencia, [Validators.required]],
      descripciones: this.fb.array([]),
      activated: [paquete.activated],
      dateCreated: [paquete.dateCreated],
      lastEdited: [this.today],
    })


    paquete.descripciones.forEach(desc => {

      this.setDescripcion(desc.info)
    });




  }
  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Paquetes')
      this.loading = false
      return
    }

    if (this.form.valid) {
      this.paquete = {
        ...this.paquete,
        ...this.form.value,
      }
      this.paquetesService.actualizarPaquete(this.paquete).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Paquetes')
        this.functionsService.navigateTo('core/paquete/vista-paquetes')
        this.loading = false
      },
        (error) => {
          console.error('Error', error)
          this.loading = true
          this.functionsService.alertError(error, 'Paquetes')
        })
    } else {
      //message
      this.loading = false
      return // console.info('Please provide all the required values!');
    }
  }
  changeTypeOfVigencia(type) {

    if (type == 'Uso') {
      this.form.patchValue({ typeOfVigencia: 'number' })
    } else {
      this.form.patchValue({ typeOfVigencia: 'string' })

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
          this.functionsService.alertError(err, 'Subir imagen')
          console.error('err::: ', err);



        },
      )
  }
  back() {
    this.functionsService.navigateTo('core/paquete/vista-paquetes')
  }
}
