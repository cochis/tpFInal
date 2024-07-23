import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Fiesta } from '../models/fiesta.model';
import { Boleto } from '../models/boleto.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private functionsService: FunctionsService,) { }
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'fiestas' | 'salones' | 'galerias' | 'invitaciones',
    id: string,
  ) {


    try {
      const url = `${base_url}/upload/${tipo}/${id}`
      const formData = new FormData()
      formData.append('imagen', archivo)
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.functionsService.getLocal('token') || '',
        },
        body: formData,
      })

      const data = await resp.json()
      if (data.ok) {
        return await data.nombreArchivo
      } else {
        return false
      }
    } catch (error) {
      console.log('error', error)
      return false
    }
  }
  async actualizarFotoTemplate(
    archivo: File,
    tipo: 'invitaciones',
    id: string,
    imgTemplate: string
  ) {



    try {
      const url = `${base_url}/upload/${tipo}/${id}/${imgTemplate}`
      const formData = new FormData()
      formData.append('imagen', archivo)
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.functionsService.getLocal('token') || '',
        },
        body: formData,
      })

      const data = await resp.json()
      if (data.ok) {
        return await data.nombreArchivo
      } else {
        return false
      }
    } catch (error) {
      console.log('error', error)
      return false
    }
  }


}
