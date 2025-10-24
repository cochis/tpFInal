import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { MonedasService } from 'src/app/core/services/moneda.service';
import { Moneda } from 'src/app/core/models/moneda.model';
import { CargarMonedas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';



@Component({
  selector: 'app-vista-monedas',
  templateUrl: './vista-monedas.component.html',
  styleUrls: ['./vista-monedas.component.scss']
})
export class VistaMonedasComponent {
  data!: any
  monedas: Moneda[]
  monedasTemp: Moneda[]
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')


  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,

    private monedasService: MonedasService
  ) {
    this.getMonedas()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.monedas = this.monedasTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.monedasTemp)
      this.monedas = this.functionsService.filterBy(termino, this.monedasTemp)
    }, 500);
  }




  setMonedas() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getMonedas() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {

        this.monedas = resp.monedas
        this.monedasTemp = resp.monedas
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Monedas')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.monedasService.cargarMonedasByEmail(usr).subscribe((resp: CargarMonedas) => {

        this.monedas = resp.monedas
        this.monedasTemp = resp.monedas
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editMoneda(id: string) {

    this.functionsService.navigateTo(`/core/monedas/editar-moneda/true/${id}`)

  }
  isActived(moneda: Moneda) {

    this.monedasService.isActivedMoneda(moneda).subscribe((resp: any) => {
      this.getMonedas()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Monedas')

      })
  }
  viewMoneda(id: string) {
    this.functionsService.navigateTo(`/core/monedas/editar-moneda/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newMoneda() {

    this.functionsService.navigateTo('monedas/crear-moneda')
  }

}
