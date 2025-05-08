import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarGrupo } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Grupo } from 'src/app/core/models/grupo.model';
import { GruposService } from 'src/app/core/services/grupo.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.component.html',
  styleUrls: ['./editar-grupo.component.scss']
})
export class EditarGrupoComponent {
  loading = false
  grupo: Grupo
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
    private gruposService: GruposService,
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

    this.gruposService.cargarGrupoById(id).subscribe((resp: CargarGrupo) => {
      this.loading = true
      this.grupo = resp.grupo

      setTimeout(() => {

        this.setForm(this.grupo)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Grupos')
        this.loading = false


      })
  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(grupo: Grupo) {



    this.form = this.fb.group({
      nombre: [grupo.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [grupo.clave, [Validators.required, Validators.minLength(3)]],
      activated: [grupo.activated],
      dateCreated: [grupo.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Grupos')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.grupo = {
        ...this.grupo,
        ...this.form.value,


      }


      this.gruposService.actualizarGrupo(this.grupo).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Grupos')
        this.functionsService.navigateTo('core/grupos/vista-grupos')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Grupos')
          //message
          this.loading = true



        })
    } else {

      this.functionsService.alertForm('Roles')
      this.loading = false
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/grupos/vista-grupos')
  }

}
