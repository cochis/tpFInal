import { Component } from '@angular/core';
import { Proveedor } from '../../../../models/proveedor.model';
import { ProveedorsService } from '../../../../services/proveedor.service';
import { CargarProveedors } from '../../../../interfaces/cargar-interfaces.interfaces';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent {
  proveedores: Proveedor[] = undefined
  constructor(
    private proveedoresService: ProveedorsService
  ) {
    this.getCatalogos()
  }

  getCatalogos() {
    this.proveedoresService.cargarProveedorsAll().subscribe((res: CargarProveedors) => {

      this.proveedores = res.proveedors



    })
  }

}
