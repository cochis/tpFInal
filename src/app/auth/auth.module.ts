import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { RememberComponent } from './pages/remember/remember.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SharedModule } from '../shared/shared.module';
import { VerificationComponent } from './pages/verification/verification.component';
import { PerfilComponent } from './pages/perfil/perfil.component';



@NgModule({
  declarations: [

    LoginComponent,
    RememberComponent,
    RegisterComponent,
    AuthComponent,
    VerificationComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ZXingScannerModule,
    SharedModule,
  ]
})
export class AuthModule { }
