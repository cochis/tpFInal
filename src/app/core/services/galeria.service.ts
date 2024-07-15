import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarGalerias, CargarGaleria } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Galeria } from 'src/app/core/models/galeria.model';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class GaleriasService {

  constructor(private http: HttpClient,) { }
  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  cargarGaleriasAll(): any {
    const url = `${base_url}/galeria/all`
    return this.http.get<CargarGalerias>(url, this.headers).pipe(
      map((resp) => {
        const galerias = resp.galerias.map(
          (gal) =>
            new Galeria(
              gal.fiesta,
              gal.boleto,
              gal.activated,
              gal.dateCreated,
              gal.lastEdited,
              gal.img,
              gal.uid,

            ),
        )
        return {
          total: galerias.length,
          galerias,
        }
      }),
    )
  }

  crearGaleria(formData: any): any {

    return this.http.post(`${base_url}/galeria`, formData, this.headers)
  }


  isActivedGaleria(galeria: Galeria) {
    const url = `${base_url}/galerias/isActive/${galeria.uid}`
    const data = {
      ...galeria,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarGaleria(galeria: Galeria) {

    const url = `${base_url}/galerias/${galeria.uid}`

    const data = {
      ...galeria,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }

  cargarGaleriaById(id: string) {
    const url = `${base_url}/galeria/${id}`
    return this.http.get<CargarGaleria>(url, this.headers)
  }
  cargarGaleriaByMail(mail: string) {
    const url = `${base_url}/galeria/email/${mail}`
    return this.http.get<CargarGalerias>(url, this.headers)
  }
  cargarGaleriaByBoleto(boleto: string) {
    const url = `${base_url}/galeria/boleto/${boleto}`
    return this.http.get<CargarGalerias>(url, this.headers)
  }
  cargarGaleriaByFiesta(fiesta: string) {
    const url = `${base_url}/galeria/fiesta/${fiesta}`
    return this.http.get<CargarGalerias>(url, this.headers)
  }
  downloadGaleriaByFiesta(fiesta: string) {

    let env = ''
    console.log('base_url.includ ', base_url.includes('localhost'));
    if (base_url.includes('localhost')) {

      env = 'false'
    } else {
      env = 'true'
    }

    const url = `${base_url}/galeria/down-fiesta/${fiesta}/${env}`
    return this.http.get<CargarGalerias>(url, this.headers)
  }
  cargarGaleriaByCreador(uid: string) {
    const url = `${base_url}/galerias/creador/${uid}`
    return this.http.get<CargarGalerias>(url, this.headers)
  }

}
