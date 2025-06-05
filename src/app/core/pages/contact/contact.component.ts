import { Component, OnInit } from '@angular/core';
import { ContactosService } from '../../services/contacto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Meta, Title } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  loading = false
  submited = false
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  constructor(
    private contactoService: ContactosService,
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private meta: Meta,
    private titleService: Title
  ) {





    this.createForm()
  }
  ngOnInit(): void {
    const titulo = 'Contacto | Escríbenos y Organiza Tu Evento con MyTicketParty';
    const descripcion = '¿Tienes dudas o necesitas ayuda con tu evento? Contáctanos y recibe asesoría sobre invitaciones digitales, proveedores y servicios para eventos.';
    this.functionsService.removeTags()
    this.titleService.setTitle(titulo);
    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'contacto, ayuda, soporte, atención al cliente, preguntas, eventos, MyTicketParty, invitaciones digitales, marketplace de eventos, servicio al cliente,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/core/contact' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: 'core/contact' },
      { name: 'colorBar', content: '#13547a' },
    ]);
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
