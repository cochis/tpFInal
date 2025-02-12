import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoMedia } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoMedia } from 'src/app/core/models/tipoMedia.model';
import { TipoMediasService } from 'src/app/core/services/tipoMedia.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-tipo-media',
  templateUrl: './editar-tipo-media.component.html',
  styleUrls: ['./editar-tipo-media.component.css']
})
export class EditarTipoMediaComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  tipoMedia: TipoMedia
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

    private tipoMediasService: TipoMediasService,

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

    this.tipoMediasService.cargarTipoMediaById(id).subscribe((resp: CargarTipoMedia) => {

      this.tipoMedia = resp.tipoMedia


      setTimeout(() => {

        this.setForm(this.tipoMedia)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'TipoMedias')
        this.loading = false


      })
  }


  get errorControl() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      icon: ['', [Validators.required, Validators.minLength(3)]],
      value: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoMedia: TipoMedia) {



    this.form = this.fb.group({
      nombre: [tipoMedia.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoMedia.clave, [Validators.required, Validators.minLength(3)]],
      activated: [tipoMedia.activated],
      dateCreated: [tipoMedia.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.trim()

    if (this.form.value.nombre === '' || this.form.value.icon === '') {
      this.functionsService.alertForm('TipoMedias')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.tipoMedia = {
        ...this.tipoMedia,
        ...this.form.value,


      }
      this.tipoMediasService.actualizarTipoMedia(this.tipoMedia).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoMedias')
        this.functionsService.navigateTo('core/tipo-medios/vista-tipo-medios')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'TipoMedias')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/tipo-medios/vista-tipo-medios')
  }

}

