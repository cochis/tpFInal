import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { RedesService } from 'src/app/core/services/red.service';
import { Red } from 'src/app/core/models/red.model';
import { CargarRedes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
@Component({
  selector: 'app-vista-redes',
  templateUrl: './vista-redes.component.html',
  styleUrls: ['./vista-redes.component.scss']
})
export class VistaRedesComponent {
  data!: any
  redes: Red[]
  redesTemp: Red[]
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

    private redesService: RedesService
  ) {
    this.getRedes()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.redes = this.redesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.redesTemp)
      this.redes = this.functionsService.filterBy(termino, this.redesTemp)
    }, 500);
  }




  setRedes() {
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
  getRedes() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.redesService.cargarRedesAll().subscribe((resp: CargarRedes) => {

        this.redes = resp.redes
        this.redesTemp = resp.redes
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Redes')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.redesService.cargarRedesByEmail(usr).subscribe((resp: CargarRedes) => {

        this.redes = resp.redes
        this.redesTemp = resp.redes
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editRed(id: string) {

    this.functionsService.navigateTo(`/core/redes/editar-red/true/${id}`)

  }
  isActived(red: Red) {

    this.redesService.isActivedRed(red).subscribe((resp: any) => {
      this.getRedes()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Redes')

      })
  }
  viewRed(id: string) {
    this.functionsService.navigateTo(`/core/redes/editar-red/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newRed() {

    this.functionsService.navigateTo('redes/crear-red')
  }

}
