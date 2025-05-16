import { Component } from '@angular/core';
import { ContactosService } from '../../services/contacto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Title } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
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


    let t: string = 'Contacto | Escríbenos y Organiza Tu Evento con MyTicketParty';
    this.title.setTitle(t);

    this.metaService.generateTags({
      title: 'Contacto | Escríbenos y Organiza Tu Evento con MyTicketParty',
      description:
        '¿Tienes dudas o necesitas ayuda con tu evento? Contáctanos y recibe asesoría sobre invitaciones digitales, proveedores y servicios para eventos.',
      keywords:
        'contacto, ayuda, soporte, atención al cliente, preguntas, eventos, MyTicketParty, invitaciones digitales, marketplace de eventos, servicio al cliente',
      slug: 'core/contact',
      colorBar: '#13547a',
      image:
        window.location.origin + '/assets/images/qr.svg',
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
