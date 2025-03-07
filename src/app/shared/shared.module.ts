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
import { InfoUbicacionComponent } from './components/info-ubicacion/info-ubicacion.component';
import { CongratsComponent } from './pages/congrats/congrats.component';
import { CancelComponent } from './pages/cancel/cancel.component';
import { ViewTemplateComponent } from './components/view-template/view-template.component';
import { ImagenComponent } from './components/modals/imagen/imagen.component';
import { DivisorComponent } from './components/divisor/divisor.component';
import { CarrucelColoresComponent } from './components/carrucel-colores/carrucel-colores.component';
import { CarrucelPhotosComponent } from './components/carrucel-photos/carrucel-photos.component';
import { IsLoginComponent } from './components/is-login/is-login.component';
import { QrComponent } from './components/qr/qr.component';
import { MapscreenComponent } from './components/mapscreen/mapscreen.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { BtnMyLocationComponent } from './components/btn-my-location/btn-my-location.component';
import { MtpLogoComponent } from './components/mtp-logo/mtp-logo.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';





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
    InfoUbicacionComponent,
    CongratsComponent,
    CancelComponent,
    ViewTemplateComponent,
    ImagenComponent,
    DivisorComponent,
    CarrucelColoresComponent,
    CarrucelPhotosComponent,
    IsLoginComponent,
    QrComponent,
    MapscreenComponent,
    MapViewComponent,
    BtnMyLocationComponent,
    MtpLogoComponent,
    SearchbarComponent,
    SearchResultsComponent,
    CalendarComponent,


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
    SharedDefaultTemplateComponent,
    InfoUbicacionComponent,
    ViewTemplateComponent,
    ImagenComponent,
    DivisorComponent,
    IsLoginComponent,
    QrComponent,
    MapscreenComponent,
    CalendarComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    QRCodeModule,
    NgxCurrencyDirective,
    FullCalendarModule
  ],
})
export class SharedModule { }
