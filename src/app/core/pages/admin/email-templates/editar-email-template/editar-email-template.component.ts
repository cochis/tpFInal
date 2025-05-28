import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { CargarEmailTemplate } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EmailTemplate } from 'src/app/core/models/emailTemplate.model';
import { EmailTemplatesService } from 'src/app/core/services/emailTemplate.service';
 

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-email-template',
  templateUrl: './editar-email-template.component.html',
  styleUrls: ['./editar-email-template.component.scss']
})
export class EditarEmailTemplateComponent implements OnDestroy {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  emailTemplate: EmailTemplate
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  template: Editor
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

    private emailTemplatesService: EmailTemplatesService,

    private route: ActivatedRoute,

  ) {
    this.template = new Editor();
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

    this.emailTemplatesService.cargarEmailTemplateById(id).subscribe((resp: CargarEmailTemplate) => {

      this.emailTemplate = resp.emailTemplate

      setTimeout(() => {

        this.setForm(this.emailTemplate)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'EmailTemplates')
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
      email: ['', [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(emailTemplate: EmailTemplate) {



    this.form = this.fb.group({
      nombre: [emailTemplate.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [emailTemplate.clave, [Validators.required, Validators.minLength(3)]],
      template: [emailTemplate.template, [Validators.required]],
      descripcion: [emailTemplate.descripcion, [Validators.required]],
      activated: [emailTemplate.activated],
      dateCreated: [emailTemplate.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('EmailTemplates')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.emailTemplate = {
        ...this.emailTemplate,
        ...this.form.value,


      }
      this.emailTemplatesService.actualizarEmailTemplate(this.emailTemplate).subscribe((resp: any) => {
        this.functionsService.alertUpdate('EmailTemplates')
        this.functionsService.navigateTo('core/email-templates/vista-email-templates')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'EmailTemplates')


        })
    } else {

      //message
      this.loading = false

      return console.info('Please provide all the required values!');
    }



  }


  back() {
    this.functionsService.navigateTo('core/email-templates/vista-email-templates')
  }
  ngOnDestroy() {
    this.template.destroy();

  }
}
