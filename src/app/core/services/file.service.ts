import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Fiesta } from '../models/fiesta.model';
import { Boleto } from '../models/boleto.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private functionsService: FunctionsService,) { }
  get token(): string {
    return this.functionsService.getLocal('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'fiestas' | 'salones' | 'galerias' | 'invitaciones' | 'paquetes',
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
      console.error('error::: ', error);

      return false
    }
  }
  deleteFoto(

    tipo: 'galerias',
    id: string,
  ) {
    const url = `${base_url}/upload/remove/${tipo}/${id}`

    return this.http.patch(url, this.headers)
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
      console.error('error::: ', error);

      return false
    }
  }




}
