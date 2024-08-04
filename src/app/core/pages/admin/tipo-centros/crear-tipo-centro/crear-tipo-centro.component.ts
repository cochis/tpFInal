import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoCentro } from 'src/app/core/models/tipoCentro.model';
import { TipoCentrosService } from 'src/app/core/services/tipoCentros.service';




import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-tipo-centro',
  templateUrl: './crear-tipo-centro.component.html',
  styleUrls: ['./crear-tipo-centro.component.css']
})
export class CrearTipoCentroComponent {
  loading = false
  tipoCentro: TipoCentro
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private tipoCentrosService: TipoCentrosService,

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
      descripcion: [''],

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
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      this.tipoCentrosService.crearTipoCentro(this.form.value).subscribe((resp: any) => {

        this.functionsService.alert('TipoCentro', 'TipoCentro creado', 'success')
        this.functionsService.navigateTo('core/tipo-centros/vista-tipo-centros')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo de centro de eventos')
          this.loading = false
          console.error('Error', error)

        })
    } else {

      this.functionsService.alertForm('TipoCentros')
      this.loading = false
      return console.info('Please provide all the required values!');
    }





  }

  back() {
    this.functionsService.navigateTo('core/tipo-centros/vista-tipo-centros')
  }

}

