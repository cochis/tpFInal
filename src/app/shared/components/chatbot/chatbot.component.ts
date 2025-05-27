import { Component, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CHAT_FLOW } from 'src/assets/data/chat-flow';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from '../../services/functions.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from 'src/app/core/models/usuario.model';
import { CargarUsuario } from '../../../core/interfaces/cargar-interfaces.interfaces';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
@HostListener('window:resize', [])
export class ChatbotComponent {
  user: Usuario = undefined
  lead: any = undefined
  isMobile: boolean = false;
  open: boolean = false;
  currentNode = CHAT_FLOW['start'];
  public form!: FormGroup
  today = this.funtionsSrvice.getToday()
  uid = ''
  display = false

  constructor(
    private fb: FormBuilder,
    private funtionsSrvice: FunctionsService,
    private usuarioService: UsuariosService,
    private route: ActivatedRoute,
    private eRef: ElementRef,
  ) {






    if (this.funtionsSrvice.getLocal('uid')) {
      this.uid = this.funtionsSrvice.getLocal('uid')
      this.createForm()
      this.usuarioService.cargarUsuarioById(this.uid).subscribe((res: CargarUsuario) => {
        this.user = res.usuario
        this.setForm(this.user)
      })
    } else {

      this.createForm()
      if (this.funtionsSrvice.getLocal('lead')) {
        this.lead = this.funtionsSrvice.getLocal('lead')

        this.setForm(this.lead)
      }

    }
    this.checkViewport();
  }
  /*   @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
      if (this.isOpen && !this.eRef.nativeElement.contains(event.target)) {
        this.open = false;
      }
    } */
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 768;
  }

  closeChatbot() {
    const el = document.getElementById('chatbotModal');
    if (el) el.style.display = 'none';
  }
  isOpen() {

    this.open = !this.open

    this.goTo('start')
  }


  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3)]],

    })
  }
  setForm(user: any) {
    this.form = this.fb.group({
      nombre: [user.nombre, [Validators.required, Validators.minLength(3)]],
      telefono: [user.telefono, [Validators.required, Validators.minLength(3)]],
      email: [user.email, [Validators.required, Validators.minLength(3)]],

    })

  }

  onSubmit() {

    this.lead = this.form.value
    this.funtionsSrvice.setLocal('lead', this.lead)
  }

  goTo(next: string) {
    if (this.open == true) {

      this.currentNode = CHAT_FLOW[next];
    } else {
      this.currentNode = CHAT_FLOW['start'];

    }
  }
}
