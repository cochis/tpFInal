import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarTipoModulos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ModuloTemplate } from 'src/app/core/models/moduloTemplate.model';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';

import { ModuloTemplatesService } from 'src/app/core/services/moduloTemplates.service';
import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-modulo-template',
  templateUrl: './crear-modulo-template.component.html',
  styleUrls: ['./crear-modulo-template.component.css']
})
export class CrearModuloTemplateComponent {
  loading = false
  moduloTemplate: ModuloTemplate
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  uid = this.functionsService.getLocal('uid')
  tipoModulos: TipoModulo[]
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoModulosService: TipoModulosService,
    private moduloTemplatesService: ModuloTemplatesService,

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
      tipoModulo: ['', [Validators.required, Validators.minLength(3)]],
      values: this.fb.array([]),
      diseno: ['', [Validators.required, Validators.minLength(3)]],
      css: ['', [Validators.required, Validators.minLength(3)]],
      usuarioCreated: [this.uid, [Validators.required, Validators.minLength(3)]],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  get values(): FormArray {
    return this.form.get("values") as FormArray
  }
  newValue(): FormGroup {
    return this.fb.group({
      name: '',
      type: '',
      value: '',
    })
  }
  addValues() {
    this.values.push(this.newValue());
  }
  removeValue(i: number) {
    this.values.removeAt(i);
  }
  getCatalogos() {
    this.loading = true
    this.tipoModulosService.cargarTipoModulosAll().subscribe((resp: CargarTipoModulos) => {
      this.tipoModulos = resp.tipoModulos

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo de modulos')
        this.loading = false
      })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.moduloTemplatesService.crearModuloTemplate(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('ModuloTemplate', 'ModuloTemplate creado', 'success')
        this.functionsService.navigateTo('core/modulo-templates/vista-modulo-templates')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'ModuloTemplates')
          this.loading = false
          // console.log('error::: ', error);

        })
    } else {

      this.functionsService.alertForm('ModuloTemplates')
      this.loading = false
      return // console.log('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/modulo-templates/vista-modulo-templates')
  }

  disabledBtn() {
    if (this.values.length == 0) {
      return false
    } else {


      if (
        this.values.value[this.values.length - 1].name !== '' &&
        this.values.value[this.values.length - 1].type !== '' &&
        this.values.value[this.values.length - 1].value !== ''

      ) {
        return false
      } else {

        return true
      }
    }
  }


}

