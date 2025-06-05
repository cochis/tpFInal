import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
import { MetaService } from 'src/app/core/services/meta.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false
  vieWPass = false
  loginForm: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  });
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private authService: AuthService,
    private functionsService: FunctionsService,

    private title: Title,
    private meta: Meta,
    private titleService: Title
  ) {

  }
  ngOnInit(): void {
    const titulo = 'My Ticket Party | Login';
    const descripcion = 'Ingresa a nuestra aplicación con usuario y contraseña';

    
    this.functionsService.removeTags()

    this.titleService.setTitle(titulo);

    this.meta.addTags([
      { name: 'author', content: 'MyTicketParty' },
      { name: 'description', content: descripcion },
      { name: 'keywords', content: 'Myticketparty, Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in,MyTicketParty, invitaciones digitales personalizadas,crear invitaciones con boletos,boletos digitales para fiestas,invitaciones para eventos privados,invitaciones con código QR,entradas digitales para fiestas,invitaciones con control de acceso,tickets personalizados para eventos,cómo hacer invitaciones digitales para fiestas,plataforma para crear boletos con QR,invitaciones con entrada digital para eventos,boletos para fiestas con lista de invitados,crear invitaciones con diseño personalizado,control de acceso para eventos privados,envío de boletos digitales por WhatsApp o email,invitaciones interactivas para eventos,Logística, Eventos, marketplace, productos, servicios, invitaciones digitales, tiempo real, cotizaciones, galería de imágenes, check in' },
      { property: 'og:title', content: titulo },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { property: 'og:url', content: 'https://www.myticketparty.com/auth/login' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: titulo },
      { name: 'twitter:description', content: descripcion },
      { name: 'twitter:image', content: 'https://www.myticketparty.com/assets/images/myticketparty.png' },
      { name: 'slug', content: 'auth/login' },
      { name: 'colorBar', content: '#13547a' },

    ]);
  }
  submit(): void {
    this.loading = true

    this.loginForm.value.email = this.loginForm.value.email.toLowerCase().trim()
    this.loginForm.value.password = this.loginForm.value.password.trim()
    setTimeout(() => {

      this.authService.login(this.loginForm.value).subscribe((resp: any) => {

        setTimeout(() => {

          this.functionsService.navigateTo('core/inicio')
          this.loading = false
        }, 2000);
        //message
      },
        (error: any) => {
          this.functionsService.alertError(error, 'Login')
          if (error.error.msg === 'Usuario desactivado') {
            this.loading = false
            this.functionsService.alert('Login', 'Se ha enviado correo para verificación ', 'info')
            return
          } else {

            this.loading = false
            this.functionsService.alert('Login', 'Correo o contraseña invalidos', 'error')
            return
          }



        })
    }, 1500);

  }

  resetPassword(): void {
    this.router.navigateByUrl('auth/reset-password', { replaceUrl: true });
  }
  register(): void {
    this.router.navigateByUrl('auth/register', { replaceUrl: true });
  }
  verPass() {
    this.vieWPass = !this.vieWPass;
  }
}
