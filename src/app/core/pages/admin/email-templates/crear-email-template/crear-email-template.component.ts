import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { MailTemplate } from 'src/app/core/models/mailTemplate.model';

import { MailTemplatesService } from 'src/app/core/services/mailTemplate.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-crear-email-template',
  templateUrl: './crear-email-template.component.html',
  styleUrls: ['./crear-email-template.component.scss']
})
export class CrearEmailTemplateComponent implements OnDestroy {
  loading = false
  uid = this.functionsService.getLocal('uid')
  mailTemplate: MailTemplate
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited = false
  cargando: boolean = false
  msnOk: boolean = false
  email: Editor
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

    private mailTemplatesService: MailTemplatesService,

  ) {
    this.loading = true
    this.email = new Editor();
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
      email: ['', [Validators.required]],

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


      var email = {
        ...this.form.value,
        usuarioCreated: this.uid
      }
      this.mailTemplatesService.crearMailTemplate(email).subscribe((resp: any) => {
        this.functionsService.alert('MailTemplate', 'MailTemplate creado', 'success')
        this.functionsService.navigateTo('core/email-templates/vista-email-templates')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'MailTemplates')
          this.loading = false
          console.error('Error', error)
        })
    } else {
      this.functionsService.alertForm('MailTemplates')
      this.loading = false
      return console.info('Please provide all the required values!');
    }
  }
  back() {
    this.functionsService.navigateTo('core/email-templates/vista-email-templates')
  }
  ngOnDestroy() {
    this.email.destroy();
  }
}

