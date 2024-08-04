import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarModuloTemplate, CargarTipoModulos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ModuloTemplate } from 'src/app/core/models/moduloTemplate.model';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';
import { ModuloTemplatesService } from 'src/app/core/services/moduloTemplates.service';
import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-modulo-template',
  templateUrl: './editar-modulo-template.component.html',
  styleUrls: ['./editar-modulo-template.component.css']
})
export class EditarModuloTemplateComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  moduloTemplate: ModuloTemplate
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  uid = this.functionsService.getLocal('uid')
  tipoModulos: TipoModulo[]
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoModulosService: TipoModulosService,
    private moduloTemplatesService: ModuloTemplatesService,

    private route: ActivatedRoute,

  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.createForm()
    this.getCatalogos()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.moduloTemplatesService.cargarModuloTemplateById(id).subscribe((resp: CargarModuloTemplate) => {

      this.moduloTemplate = resp.moduloTemplate
      setTimeout(() => {

        this.setForm(this.moduloTemplate)
      }, 500);

    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'ModuloTemplates')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
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
  setValue(value): FormGroup {
    return this.fb.group({
      name: value.name,
      type: value.type,
      value: value.value,
    })
  }
  addValues() {
    this.values.push(this.newValue());
  }
  removeValue(i: number) {
    this.values.removeAt(i);
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


  setForm(moduloTemplate: ModuloTemplate) {

    this.form = this.fb.group({
      nombre: [moduloTemplate.nombre, [Validators.required, Validators.minLength(3)]],
      tipoModulo: [moduloTemplate.tipoModulo, [Validators.required]],
      values: this.fb.array([]),
      diseno: [moduloTemplate.diseno, [Validators.required]],
      css: [moduloTemplate.css, [Validators.required]],
      usuarioCreated: [moduloTemplate.usuarioCreated, [Validators.required]],
      activated: [moduloTemplate.activated],
      dateCreated: [moduloTemplate.dateCreated],
      lastEdited: [this.today],
    })
    moduloTemplate.values.forEach(value => {
      this.values.push(this.setValue(value));
    });
  }
  getCatalogos() {
    this.loading = true

    this.tipoModulosService.cargarTipoModulosAll().subscribe((resp: CargarTipoModulos) => {
      this.tipoModulos = resp.tipoModulos


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Tipo de modulos')
        this.loading = false
      })

  }
  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('ModuloTemplates')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.moduloTemplate = {
        ...this.moduloTemplate,
        ...this.form.value,


      }
      this.moduloTemplatesService.actualizarModuloTemplate(this.moduloTemplate).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Modulo de templates')
        this.functionsService.navigateTo('/core/modulo-templates/vista-modulo-templates')
        this.loading = false
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'Modulo de templates')


        })
    } else {

      //message
      this.loading = false

      return //  console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('/core/modulo-templates/vista-modulo-templates')
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
