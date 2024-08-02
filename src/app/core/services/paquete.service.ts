import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Paquete } from 'src/app/core/models/paquete.model';
import { CargarPaquete, CargarPaquetes } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

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

  cargarPaquetesAll() {
    const url = `${base_url}/paquetes/all`
    return this.http.get<CargarPaquetes>(url, this.headers).pipe(
      map((resp) => {
        const paquetes = resp.paquetes.map(
          (paquete) =>
            new Paquete(
              paquete.nombre,
              paquete.tipo,
              paquete.tipoCosto,
              paquete.tipoPaquete,
              paquete.clave,
              paquete.value,
              paquete.costo,
              paquete.img,
              paquete.descripciones,
              paquete.usuarioCreated,
              paquete.activated,
              paquete.dateCreated,
              paquete.lastEdited,
              paquete.uid,


            ),
        )
        return {
          total: paquetes.length,
          paquetes,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/paquetes?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarPaquetes>(url, this.headers).pipe(
      map((resp) => {
        const paquetes = resp.paquetes.map(
          (paquete) =>
            new Paquete(
              paquete.nombre,
              paquete.tipo,
              paquete.tipoCosto,
              paquete.tipoPaquete,
              paquete.clave,
              paquete.value,
              paquete.costo,
              paquete.img,
              paquete.descripciones,
              paquete.usuarioCreated,
              paquete.activated,
              paquete.dateCreated,
              paquete.lastEdited,
              paquete.uid,
            ),
        )
        return {
          total: paquetes.length,
          paquetes,
        }
      }),
    )
  }
  crearPaquete(formData: Paquete) {
    // console.log('formData::: ', formData);
    return this.http.post(`${base_url}/paquetes`, formData, this.headers)
  }


  isActivedPaquete(paquete: Paquete) {
    const url = `${base_url}/paquetes/isActive/${paquete.uid}`
    const data = {
      ...paquete,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarPaquete(paquete: Paquete) {
    const url = `${base_url}/paquetes/${paquete.uid}`
    const data = {
      ...paquete,
      lastEdited: Date.now(),
    }
    // console.log('data::: ', data);
    return this.http.put(url, data, this.headers)
  }

  cargarPaqueteById(id: string) {
    const url = `${base_url}/paquetes/${id}`
    return this.http.get<CargarPaquete>(url, this.headers)
  }
  cargarPaqueteByClave(clave: string) {
    const url = `${base_url}/paquetes/clave/${clave}`
    return this.http.get<CargarPaquete>(url, this.headers)
  }
  cargarPaquetesByEmail(email: string) {
    const url = `${base_url}/paquetes/email/${email}`
    return this.http.get<CargarPaquetes>(url, this.headers)
  }
}
