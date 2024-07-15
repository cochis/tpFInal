import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
    private functionsService: FunctionsService
  ) { }

  submit(): void {
    this.loading = true

    this.loginForm.value.email = this.loginForm.value.email.toLowerCase().trim()
    this.loginForm.value.password = this.loginForm.value.password.trim()

    this.authService.login(this.loginForm.value).subscribe((resp: any) => {

      setTimeout(() => {

        this.functionsService.navigateTo('core')
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