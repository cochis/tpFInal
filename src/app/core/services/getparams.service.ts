import { Injectable } from '@angular/core';
import { ParametrosService } from './parametro.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Injectable({
  providedIn: 'root'
})
export class GetparamsService {

  constructor(private parametrosServices: ParametrosService,
    private functionsService: FunctionsService,) {

  }


  getParams(param: string) {
    console.log('param::: ', param);
    this.parametrosServices.cargarParametrosByClave(param).subscribe(resp => {
      const parametro = resp.parametro
      console.log('parametro::: ', parametro);
      switch (parametro.type) {
        case 'string':
          return parametro.value
          break;
        case 'number':
          return Number(parametro.value)
          break;
        case 'boolean':
          if (parametro.value == 'true') {
            return true
          } else {
            return false
          }
          break;
        case 'number':
          return JSON.parse(parametro.value)
          break;

      }
    },
      (error) => {
        this.functionsService.alertError(error, 'Parametros')
        console.error(error)
      })
  }
}
