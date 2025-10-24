import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarFiestas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Ejemplo } from 'src/app/core/models/ejemplo.model';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { EjemplosService } from 'src/app/core/services/ejemplo.service';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-ejemplo',
  templateUrl: './crear-ejemplo.component.html',
  styleUrls: ['./crear-ejemplo.component.scss']
})
export class CrearEjemploComponent {
  loading = false
  ejemplo: Ejemplo
  fiestas: Fiesta[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private ejemplosService: EjemplosService,
    private fiestasService: FiestasService,

  ) {
    this.loading = true
    this.getCatalogos()
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
      fiesta: ['', [Validators.required]],
      urlFiestaBoleto: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      recomendacion: ['', [Validators.required, Validators.minLength(3)]],
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
      this.ejemplosService.crearEjemplo(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Ejemplo', 'Ejemplo creado', 'success')
        this.functionsService.navigateTo('ejemplos/vista-ejemplos')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Ejemplos')
          this.loading = false
          console.error('Error', error)

        })
    } else {
      this.functionsService.alertForm('Ejemplos')
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