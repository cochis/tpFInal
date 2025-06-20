import { AfterViewInit, Component, HostListener, OnInit, } from '@angular/core';

import { FunctionsService } from '../../services/functions.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { CargarFiestas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ParametrosService } from 'src/app/core/services/parametro.service';
import { AuthService } from '../../../auth/services/auth.service';
import { preventDefault } from '@fullcalendar/core/internal';
declare const google: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showWidget = false;
  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'carrito') {
      window.location.reload();
    }
  }


  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  CHK = environment.chk_role
  PRV = environment.prv_role
  ANF = environment.anf_role
  ver = environment.version
  URLBASE = environment.base_url
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  carrito: any
  fiestas: Fiesta[]
  totalFiestas = 0
  islogin = false
  email !: string
  demo = false
  DEMO = environment.DEMO
  showTranslate = false;
  msnDemo = ''
  constructor(
    private router: Router,
    private functionsService: FunctionsService,
    private fiestasService: FiestasService,
    private parametrosService: ParametrosService,
    private authService: AuthService,

  ) {

    if (this.URLBASE.includes('cochisweb')) {
      this.demo = true
      this.parametrosService.cargarParametrosByClave(this.DEMO).subscribe((res: any) => {

        this.demo = true

        this.msnDemo = res.parametro.value

      })
    }

    this.functionsService.scrollToTop()

    this.carrito = this.functionsService.getLocal('carrito')
    window.addEventListener("storage", () => {
      this.carrito = this.functionsService.getLocal('carrito')

    }, false);





    if (this.functionsService.getLocal('email')) {
      this.email = this.functionsService.getLocal('email')
    }
    setTimeout(() => {
      if (this.functionsService.getLocal('token')) {
        this.islogin = true
      } else {
        this.islogin = false
      }

    }, 50);



  }
  ngOnInit(): void {
    this.loadGoogleTranslate();
  }
  getParties() {
    this.fiestasService.cargarFiestasByanfitrion(this.email).subscribe((resp: CargarFiestas) => {
      this.fiestas = resp.fiestas

      this.totalFiestas = resp.total

    })
  }
  logout() {
    this.functionsService.removeItemLocal('email')
    this.functionsService.removeItemLocal('proveedor')
    this.functionsService.removeItemLocal('token')
    this.functionsService.removeItemLocal('uid')
    this.functionsService.removeItemLocal('role')
    this.rol = this.functionsService.getLocal('role')

    if (!this.rol) {
      this.functionsService.navigateTo("/core/inicio")
    }





  }

  toggleTranslate(): void {
    this.showWidget = !this.showWidget;
  }
  loadGoogleTranslate(): void {
    const scriptId = 'google-translate-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    (window as any).googleTranslateElementInit = () => {
      new google.translate.TranslateElement(
        {
          pageLanguage: 'es',
          includedLanguages: 'en,es,pt,fr',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };
  }


}
