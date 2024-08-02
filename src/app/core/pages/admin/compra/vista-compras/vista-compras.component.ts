import { Component } from '@angular/core';
import { CargarCompras } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { SalonsService } from 'src/app/core/services/salon.service';

import { Compra } from 'src/app/core/models/compra.model';
import { Salon } from 'src/app/core/models/salon.model';

import { environment } from 'src/environments/environment';
import { ComprasService } from 'src/app/core/services/compra.service';



@Component({
  selector: 'app-vista-compras',
  templateUrl: './vista-compras.component.html',
  styleUrls: ['./vista-compras.component.css']
})
export class VistaComprasComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  compras: any = []
  comprasTemp: any = []
  salones: Salon[]
  loading = false
  url = environment.base_url
  uid = this.functionsService.getLocal('uid')
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  urlImg = environment.base_url = environment.base_url
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private comprasService: ComprasService,

  ) {
    this.getCompras()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.compras = this.comprasTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.comprasTemp)
      this.compras = this.functionsService.filterBy(termino, this.comprasTemp)
    }, 500);
  }




  setCompras() {
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
  getCompras() {
    this.loading = true
    if (this.rol === this.ADM) {

      this.comprasService.cargarComprasAll().subscribe((resp: CargarCompras) => {
        this.compras = resp.compras
        // console.log(' this.compras::: ', this.compras);

        this.comprasTemp = resp.compras
        this.getStatus(this.compras)
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.errorInfo()
        });
    } else {

      this.comprasService.cargarComprasByEmail(this.uid).subscribe((resp: CargarCompras) => {
        this.compras = resp.compras
        // console.log(' this.compras::: ', this.compras);
        this.getStatus(this.compras)
        this.comprasTemp = resp.compras
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.errorInfo()
        });
    }

  }


  editRol(id: string) {

    this.functionsService.navigateTo(`/core/compras/editar-rol/true/${id}`)

  }
  isActived(rol: Compra) {

    this.comprasService.isActivedCompra(rol).subscribe((resp: any) => {
      this.getCompras()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Compras')

      })
  }
  viewRol(id: string) {
    this.functionsService.navigateTo(`/core/compras/editar-rol/false/${id}`)

  }

  newCompra() {

    this.functionsService.navigateTo('core/compras/crear-compra/' + this.uid)
  }
  getTotal(i) {
    // console.log('i::: ', i);
    var total = 0
    this.compras[i].compra.line_items
    this.compras[i].compra.line_items.forEach(element => {
      // console.log('element::: ', element);
      total = total + (element.price_data.unit_amount)


    });
    return total


  }

  getStatus(compras) {
    // console.log('compras::: ', compras);
    compras.forEach(element => {
      // console.log('element.session.id::: ', element.session.id);
      this.comprasService.verStatus(element.session.id).subscribe(res => {
        // console.log('res::: ', res);

      })

    });
  }
}
