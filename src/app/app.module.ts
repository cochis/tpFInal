import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angularx-qrcode';
import { UnauthorizedInterceptorService } from './interceptors/unauthorized-interceptor.service';
import { ModalModule } from '@developer-partners/ngx-modal-dialog';
import { NgxPrintModule } from 'ngx-print';
import { NgxEditorModule } from 'ngx-editor';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedModule } from "./shared/shared.module";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    CoreModule,
    HttpClientModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    DataTablesModule,
    NgbModalModule,
    QRCodeModule,
    NgbModalModule,
    ModalModule,
    NgxPrintModule,
    NgxEditorModule,
    FullCalendarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:10000'
    }),
    NgbModule,
    SharedModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UnauthorizedInterceptorService,
    multi: true,


  },
  provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}