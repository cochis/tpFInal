import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEjemplo, CargarFiestas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Ejemplo } from 'src/app/core/models/ejemplo.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { EjemplosService } from 'src/app/core/services/ejemplo.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-editar-ejemplo',
  templateUrl: './editar-ejemplo.component.html',
  styleUrls: ['./editar-ejemplo.component.scss']
})
export class EditarEjemploComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  ejemplo: Ejemplo
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  fiestas: Fiesta[]
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  recomendacion: Editor
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private ejemplosService: EjemplosService,
    private route: ActivatedRoute,
  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.recomendacion = new Editor();
    this.getId(this.id)
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.ejemplosService.cargarEjemploById(id).subscribe((resp: CargarEjemplo) => {
      this.ejemplo = resp.ejemplo
      setTimeout(() => {
        this.setForm(this.ejemplo)
      }, 500);
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Ejemplos')
        this.loading = false
      })
  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fiesta: ['', [Validators.required]],
      urlFiestaBoleto: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      recomendacion: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(ejemplo: Ejemplo) {
    this.form = this.fb.group({
      nombre: [ejemplo.nombre, [Validators.required, Validators.minLength(3)]],
      fiesta: [ejemplo.fiesta, [Validators.required]],
      urlFiestaBoleto: [ejemplo.urlFiestaBoleto, [Validators.required, Validators.minLength(3)]],
      tipo: [ejemplo.tipo, [Validators.required, Validators.minLength(3)]],
      recomendacion: [ejemplo.recomendacion, [Validators.required, Validators.minLength(3)]],
      activated: [ejemplo.activated],
      dateCreated: [ejemplo.dateCreated],
      lastEdited: [this.today],
    })
  }
  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    if (this.form.value.nombre === '') {
      this.functionsService.alertForm('Ejemplos')
      this.loading = false
      return
    }
    if (this.form.valid) {
      this.ejemplo = {
        ...this.ejemplo,
        ...this.form.value,
      }
      this.ejemplosService.actualizarEjemplo(this.ejemplo).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Ejemplos')
        this.functionsService.navigateTo('ejemplos/vista-ejemplos')
        this.loading = false
      },
        (error) => {
          //message
          this.loading = false
          this.functionsService.alertError(error, 'Ejemplos')
        })
    } else {
      //message
      this.loading = false
      return console.info('Please provide all the required values!');
    }
  }
  back() {
    this.functionsService.navigateTo('ejemplos/vista-ejemplos')
  }
  getCatalogos() {
    this.loading = true
    this.fiestasService.cargarFiestasAll().subscribe((resp: CargarFiestas) => {
      this.fiestas = resp.fiestas
      this.fiestas = this.fiestas.filter(fiesta => { return fiesta.example })
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Fiestas')
        this.loading = false
      })
  }
}