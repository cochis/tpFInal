import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { CargarMailTemplate } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { MailTemplate } from 'src/app/core/models/mailTemplate.model';
import { MailTemplatesService } from 'src/app/core/services/mailTemplate.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-editar-email-template',
  templateUrl: './editar-email-template.component.html',
  styleUrls: ['./editar-email-template.component.css']
})
export class EditarEmailTemplateComponent implements OnDestroy {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  mailTemplate: MailTemplate
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
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

    private route: ActivatedRoute,

  ) {
    this.email = new Editor();
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

    this.mailTemplatesService.cargarMailTemplateById(id).subscribe((resp: CargarMailTemplate) => {

      this.mailTemplate = resp.mailTemplate

      setTimeout(() => {

        this.setForm(this.mailTemplate)
      }, 500);

    },
      (error: any) => {

        this.functionsService.alertError(error, 'MailTemplates')
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
  setForm(mailTemplate: MailTemplate) {



    this.form = this.fb.group({
      nombre: [mailTemplate.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [mailTemplate.clave, [Validators.required, Validators.minLength(3)]],
      email: [mailTemplate.email, [Validators.required]],
      activated: [mailTemplate.activated],
      dateCreated: [mailTemplate.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('MailTemplates')
      this.loading = false
      return
    }
    if (this.form.valid) {

      this.mailTemplate = {
        ...this.mailTemplate,
        ...this.form.value,


      }
      this.mailTemplatesService.actualizarMailTemplate(this.mailTemplate).subscribe((resp: any) => {
        this.functionsService.alertUpdate('MailTemplates')
        this.functionsService.navigateTo('core/email-templates/vista-email-templates')
        this.loading = false
      },
        (error) => {

          //message
          this.loading = false
          this.functionsService.alertError(error, 'MailTemplates')


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
    this.email.destroy();

  }
}
