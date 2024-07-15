import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarSalons, CargarSalon } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Salon } from 'src/app/core/models/salon.model';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class SalonsService {

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

  cargarSalonsAll() {
    const url = `${base_url}/salones/all`
    return this.http.get<CargarSalons>(url, this.headers).pipe(
      map((resp) => {
        const salons = resp.salons.map(
          (sal) =>
            new Salon(
              sal.nombre,
              sal.direccion,
              sal.calle,
              sal.numeroExt,
              sal.numeroInt,
              sal.municipioDelegacion,
              sal.coloniaBarrio,
              sal.cp,
              sal.estado,
              sal.pais,
              sal.comoLlegar,
              sal.lat,
              sal.long,
              sal.telefono,
              sal.email,
              sal.ubicacionGoogle,
              sal.img,
              sal.usuarioCreated,
              sal.activated,
              sal.dateCreated,
              sal.lastEdited,
              sal.uid,

            ),
        )
        return {
          total: salons.length,
          salons,
        }
      }),
    )
  }

  crearSalon(formData: Salon) {

    return this.http.post(`${base_url}/salones`, formData, this.headers)
  }


  isActivedSalon(salon: Salon) {
    const url = `${base_url}/salones/isActive/${salon.uid}`
    const data = {
      ...salon,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarSalon(salon: Salon) {

    const url = `${base_url}/salones/${salon.uid}`

    const data = {
      ...salon,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }

  cargarSalonById(id: string) {
    const url = `${base_url}/salones/${id}`
    return this.http.get<CargarSalon>(url, this.headers)
  }
  cargarSalonByMail(mail: string) {
    const url = `${base_url}/salones/email/${mail}`
    return this.http.get<CargarSalons>(url, this.headers)
  }
  cargarSalonByCreador(uid: string) {
    const url = `${base_url}/salones/creador/${uid}`
    return this.http.get<CargarSalons>(url, this.headers)
  }

}
