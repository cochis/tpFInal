import { Component } from '@angular/core';
import { CargarSalons } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { Salon } from 'src/app/core/models/salon.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-vista-salones',
  templateUrl: './vista-salones.component.html',
  styleUrls: ['./vista-salones.component.css']
})
export class VistaSalonesComponent {
  data!: any
  salones: Salon[] = [];
  salonesTemp: Salon[] = [];
  loading = false
  url = environment.base_url

  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  CHK = environment.chk_role
  ANF = environment.anf_role
  ver = environment.version
  rol = this.functionsService.getLocal('role')
  email = this.functionsService.getLocal('email')
  uid = this.functionsService.getLocal('uid')

  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private salonesService: SalonsService,
  ) {
    this.getSalones()
    // console.log(this.rol);


  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.salones = this.salonesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.salonesTemp)
      this.salones = this.functionsService.filterBy(termino, this.salonesTemp)
    }, 500);
  }

  setSalones() {
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
  getSalones() {
    this.loading = true
    // console.log('this.rol::: ', this.rol);
    switch (this.rol) {
      case this.ADM:
        this.salonesService.cargarSalonsAll().subscribe((resp: CargarSalons) => {
          this.salones = resp.salons
          // console.log('  this.salones::: ', this.salones);

          this.salonesTemp = resp.salons
          setTimeout(() => {

            this.loading = false
          }, 1500);
        });

        break;
      case this.SLN:


        this.salonesService.cargarSalonByMail(this.email).subscribe((resp: any) => {
          this.salones = resp.salons
          // console.log('  this.salones::: ', this.salones);

          this.salonesTemp = resp.salons
          setTimeout(() => {

            this.loading = false
          }, 1500);
        });

        break;


      default:
        this.salonesService.cargarSalonByCreador(this.uid).subscribe((resp: CargarSalons) => {
          this.salones = resp.salons
          // console.log('this.salones ::: ', this.salones);

          this.salonesTemp = resp.salons
          setTimeout(() => {

            this.loading = false
          }, 1500);
        });
        break;
    }
  }


  editSalon(id: string) {

    this.functionsService.navigateTo(`/core/salones/editar-salon/true/${id}`)

  }
  isActived(salon: Salon) {

    this.salonesService.isActivedSalon(salon).subscribe((resp: any) => {
      this.getSalones()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Salones')

      })
  }
  viewSalon(id: string) {
    this.functionsService.navigateTo(`/core/salones/editar-salon/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newSalon() {

    this.functionsService.navigateTo('core/salones/crear-salon')
  }

}
