import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grupo } from 'src/app/core/models/grupo.model';


import { GruposService } from 'src/app/core/services/grupo.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.scss']
})
export class CrearGrupoComponent {
  loading = false
  grupo: Grupo[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private gruposService: GruposService,

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
      clave: ['', [Validators.required, Validators.minLength(3)]],

      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.gruposService.crearGrupo(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('Grupos', 'Grupo creado', 'success')
        this.functionsService.navigateTo('core/grupos/vista-grupos')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Grupos')
          this.loading = false


        })
    } else {

      this.functionsService.alertForm('Grupos')
      this.loading = false
      return console.info('Please provide all the required values!');
    }






  }

  back() {
    this.functionsService.navigateTo('core/grupos/vista-grupos')
  }

}

