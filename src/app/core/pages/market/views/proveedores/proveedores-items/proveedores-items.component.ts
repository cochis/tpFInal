import { Component, Input, AfterViewInit } from '@angular/core';
import { TipoColor } from '../../../../../models/tipoColor.model';
import { TipoColorsService } from 'src/app/core/services/tipoColores.service';
import { CargarTipoColors, CargarTipoContactos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { environment } from 'src/environments/environment';
import { TipoContacto } from 'src/app/core/models/tipoContacto.model';
import { TipoContactosService } from 'src/app/core/services/tipoContacto.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-proveedores-items',
  templateUrl: './proveedores-items.component.html',
  styleUrls: ['./proveedores-items.component.scss']
})
export class ProveedoresItemsComponent implements AfterViewInit {
  @Input() proveedores: any;
  tipoColors: TipoColor[]
  tipoContactos: TipoContacto[]
  loading = false
  url = environment.base_url
  CLPR = environment.cProvedores
  CP: string;
  CS: string;
  constructor(
    private tipoColorsService: TipoColorsService,
    private functionsService: FunctionsService,
    private tipoContactosService: TipoContactosService,
  ) {
    this.CLPR.forEach(cl => {
      if (cl.clave == 'cPrincipalWP') {

        this.CP = cl.value

      } else {
        this.CS = cl.value

      }
    });
    this.getCatalogos()
  }
  ngAfterViewInit() {


  }

  getCatalogos() {
    this.tipoColorsService.cargarTipoColorsAll().subscribe((res: CargarTipoColors) => {
      this.tipoColors = res.tipoColors

    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo colores')
      })
    this.tipoContactosService.cargarTipoContactosAll().subscribe((res: CargarTipoContactos) => {
      this.tipoContactos = res.tipoContactos


    },
      (error) => {
        console.error('error::: ', error);
        this.functionsService.alertError(error, 'Tipo contactos')
      })
  }

  getContact(contacto: any) {
    var res: any = {}
    if (this.tipoContactos) {
      this.tipoContactos.forEach(ct => {
        if (ct.uid === contacto.tipoContacto) {
          res = ct
        }
      });

      return res
    }


  }
  hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');

      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.3)';
    }
    throw new Error('Bad Hex');
  }
  getColor(colors, type) {


    var color = ''
    if (type === 'P') {
      colors.forEach(cl => {

        if (cl.tipoColor == this.CP) {
          color = cl.value
        }
      });
    } else {
      colors.forEach(cl => {

        if (cl.tipoColor == this.CS) {
          color = cl.value
        }
      });
    }


    return color

  }
}
