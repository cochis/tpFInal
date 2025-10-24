import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '@developer-partners/ngx-modal-dialog';

import { CargarEventos, CargarModuloTemplates, CargarTipoModulos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Evento } from 'src/app/core/models/evento.model';
import { ModuloTemplate } from 'src/app/core/models/moduloTemplate.model';
import { Template } from 'src/app/core/models/template.model';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';
import { EventosService } from 'src/app/core/services/evento.service';

import { ModuloTemplatesService } from 'src/app/core/services/moduloTemplates.service';
import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';
import { ModalTemplateComponent } from 'src/app/shared/components/modals/modal-template/modal-template.component';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-template',
  templateUrl: './crear-template.component.html',
  styleUrls: ['./crear-template.component.scss']
})
export class CrearTemplateComponent {
  loading = false
  moduloTemplate: ModuloTemplate
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  uid = this.functionsService.getLocal('uid')
  tipoModulos: TipoModulo[]
  moduloTemplates: ModuloTemplate[]
  eventos: Evento[]

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoModulosService: TipoModulosService,
    private moduloTemplatesService: ModuloTemplatesService,
    private eventosService: EventosService,
    private _modalService: ModalService

  ) {
    this.loading = true
    this.getCatalogos()
    setTimeout(() => {
      this.loading = false
    }, 1500);
    this.form = this.fb.group({
      nombre: [''],
      evento: [''],
      modulos: this.fb.array([]),
      usuarioCreated: [''],
      activated: [true],
      dateCreated: [this.functionsService.getToday()],
      lastEdited: [this.functionsService.getToday()],

    });
  }

  get errorControl() {
    return this.form.controls;
  }

  modulos(): FormArray {
    return this.form.get('modulos') as FormArray;
  }

  newModulo(): FormGroup {
    return this.fb.group({
      moduloTemplate: '',
      values: this.fb.array([]),
      diseno: '',
      css: '',
    });
  }

  addModulo() {
    this.modulos().push(this.newModulo());
  }

  removeModulo(modIndex: number) {
    this.modulos().removeAt(modIndex);
  }

  moduloDatas(modIndex: number): FormArray {
    return this.modulos()
      .at(modIndex)
      .get('values') as FormArray;
  }

  newData(): FormGroup {
    return this.fb.group({
      name: '',
      type: '',
      value: ''
    });
  }
  setData(data: any): FormGroup {
    return this.fb.group({
      name: data.name,
      type: data.type,
      value: `<{<{${data.value}}>}>`
    });

  }

  addModuloData(modIndex: number) {
    this.moduloDatas(modIndex).push(this.newData());
  }

  removeModuloData(modIndex: number, dataIndex: number) {
    this.moduloDatas(modIndex).removeAt(dataIndex);
  }
  selectModuleTemplate(id: string, i: number) {

    let res = this.moduloTemplates.filter(mt => {
      return mt.uid == id
    })


    res[0].values.forEach((value: any) => {
      this.moduloDatas(i).push(this.setData(value));
    });

    setTimeout(() => {
      this.form.value.modulos[i].diseno = res[0].diseno
      this.form.value.modulos[i].css = res[0].css
    }, 500);


  }
  onSubmit() {

  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      evento: ['', [Validators.required, Validators.minLength(3)]],

      modulos: this.fb.array([]),

      usuarioCreated: [this.uid, [Validators.required, Validators.minLength(3)]],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  back() {
    this.functionsService.navigateTo('modulo-templates/vista-modulo-templates')
  }

  disabledBtn() {
    return false

  }
  viewTemplate(template) {

    this._modalService.show<Template>(ModalTemplateComponent, {
      title: 'Ver Diseño',
      size: 1,
      model: template,
      mode: 'fullScreen'
    })


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
    this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {
      this.eventos = this.functionsService.getActives(resp.eventos)


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Eventos')
        this.loading = false
      })
    this.moduloTemplatesService.cargarModuloTemplatesAll().subscribe((resp: CargarModuloTemplates) => {
      this.moduloTemplates = this.functionsService.getActives(resp.moduloTemplates)

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Modulos de templates')
        this.loading = false
      })

  }




}

