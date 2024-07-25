import { Component } from '@angular/core';
import { ContactosService } from '../../services/contacto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  loading = false
  submited = false
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  constructor(
    private contactoService: ContactosService,
    private fb: FormBuilder,
    private functionsService: FunctionsService,) {
    this.createForm()
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(3)]],

      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  sendContacto() {
    this.loading = true
    this.submited = true
    this.contactoService.sendContacto(this.form.value).subscribe((resp: any) => {
      // // console.log('resp::: ', resp);
      this.loading = false

    },
      (error: any) => {
        this.submited = false
        this.loading = false
      }
    )
  }


} 
