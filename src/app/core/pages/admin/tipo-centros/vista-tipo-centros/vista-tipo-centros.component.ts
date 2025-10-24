import { Component } from '@angular/core';
import { CargarTipoCentros } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';
import { TipoCentrosService } from 'src/app/core/services/tipoCentros.service';

import { Salon } from 'src/app/core/models/salon.model';

import { environment } from 'src/environments/environment';
import { TipoCentro } from 'src/app/core/models/tipoCentro.model';


@Component({
  selector: 'app-vista-tipo-centros',
  templateUrl: './vista-tipo-centros.component.html',
  styleUrls: ['./vista-tipo-centros.component.scss']
})
export class VistaTipoCentrosComponent {
  data!: any
  tipoCentros: TipoCentro[]
  tipoCentrosTemp: TipoCentro[]
  salones: Salon[]
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoCentrosService: TipoCentrosService
  ) {
    this.getTipoCentros()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.tipoCentros = this.tipoCentrosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.tipoCentrosTemp)
      this.tipoCentros = this.functionsService.filterBy(termino, this.tipoCentrosTemp)
    }, 500);
  }




  setTipoCentros() {
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
  getTipoCentros() {
    this.loading = true
    this.tipoCentrosService.cargarTipoCentrosAll().subscribe((resp: CargarTipoCentros) => {
      this.tipoCentros = resp.tipoCentros


      this.tipoCentrosTemp = resp.tipoCentros
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoCentro(id: string) {

    this.functionsService.navigateTo(`tipo-centros/editar-tipo-centro/true/${id}`)

  }
  isActived(rol: TipoCentro) {

    this.tipoCentrosService.isActivedTipoCentro(rol).subscribe((resp: any) => {
      this.getTipoCentros()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'TipoCentros')

      })
  }
  viewTipoCentro(id: string) {
    this.functionsService.navigateTo(`tipo-centros/editar-tipo-centro/false/${id}`)

  }

  newTipoCentro() {

    this.functionsService.navigateTo('tipo-centros/crear-tipo-centro')
  }

}

