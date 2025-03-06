import { Component } from '@angular/core';
import { ContactosService } from '../../services/contacto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Title } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';
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
    private functionsService: FunctionsService,
    private metaService: MetaService,
    private title: Title,
  ) {


    let t: string = 'My Ticket Party | Contacto';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'My Ticket Party | Contacto',
      description:
        'Si está buscando un contacto para una empresa de logística que ofrezca invitaciones digitales y un marketplace de servicios y productos para eventos, es importante considerar opciones que se especialicen en estas áreas.',
      keywords:
        'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in',
      slug: 'core/contact',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.jpeg',
    });




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

      this.loading = false

    },
      (error: any) => {
        console.error('Error', error)
        this.submited = false
        this.loading = false
      }
    )
  }


} 
