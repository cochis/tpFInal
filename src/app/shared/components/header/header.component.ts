import { Component, HostListener, } from '@angular/core';
import { FunctionsService } from '../../services/functions.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FiestasService } from 'src/app/core/services/fiestas.service';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { CargarFiestas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

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
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
  carrito: any
  fiestas: Fiesta[]
  totalFiestas = 0
  islogin = false
  email !: string
  constructor(
    private router: Router,
    private functionsService: FunctionsService,
    private fiestasService: FiestasService
  ) {
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
  getParties() {
    this.fiestasService.cargarFiestasByanfitrion(this.email).subscribe((resp: CargarFiestas) => {
      this.fiestas = resp.fiestas

      this.totalFiestas = resp.total

    })
  }
  logout() {
    this.functionsService.clearLocal()
    this.rol = this.functionsService.getLocal('role')

    if (!this.rol) {
      this.functionsService.navigateTo("/core/inicio")
    }





  }

}
