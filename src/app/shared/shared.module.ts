import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { AsideComponent } from './components/aside/aside.component';
import { BannerComponent } from './components/banner/banner.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MessageComponent } from './components/message/message.component';
import { NavComponent } from './components/nav/nav.component';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ScannerComponent } from './components/scanner/scanner.component';
import { ModalComponent } from './components/modals/modal/modal.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ModalTemplateComponent } from './components/modals/modal-template/modal-template.component';
import { DisenoModalComponent } from './components/modals/diseno-modal/diseno-modal.component';
import { CssModalComponent } from './components/modals/css-modal/css-modal.component';
import { SharedDefaultTemplateComponent } from './components/shared-default-template/shared-default-template.component';




@NgModule({
  declarations: [
    NopagefoundComponent,
    AsideComponent,
    BannerComponent,
    FooterComponent,
    HeaderComponent,
    LoadingComponent,
    MessageComponent,
    NavComponent,
    ScannerComponent,
    ModalComponent,
    ModalTemplateComponent,
    DisenoModalComponent,
    CssModalComponent,
    SharedDefaultTemplateComponent,

  ],
  exports: [
    NopagefoundComponent,
    AsideComponent,
    BannerComponent,
    FooterComponent,
    HeaderComponent,
    LoadingComponent,
    MessageComponent,
    NavComponent,
    ScannerComponent,
    ModalComponent,
    SharedDefaultTemplateComponent


  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    QRCodeModule
  ],
})
export class SharedModule { }
