import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarFiestas, CargarFiesta } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Fiesta } from 'src/app/core/models/fiesta.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FiestasService {

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

  cargarFiestasAll() {
    const url = `${base_url}/fiestas/all`
    return this.http.get<CargarFiestas>(url, this.headers).pipe(
      map((resp) => {
        const fiestas = resp.fiestas.map(
          (fie) =>
            new Fiesta(

              fie.nombre,
              fie.evento,
              fie.cantidad,
              fie.fecha,
              fie.calle,
              fie.numeroExt,
              fie.numeroInt,
              fie.municipioDelegacion,
              fie.coloniaBarrio,
              fie.cp,
              fie.estado,
              fie.pais,
              fie.comoLlegar,
              fie.salon,
              fie.usuarioFiesta,
              fie.img,
              fie.invitacion,
              fie.realizada,
              fie.galeria,
              fie.checking,
              fie.mesaOk,
              fie.example,
              fie.croquis,
          
              fie.usuarioCreated,
              fie.activated,
              fie.dateCreated,
              fie.lastEdited,
              fie.uid,

            ),
        )
        return {
          total: fiestas.length,
          fiestas,
        }
      }),
    )
  }

  crearFiesta(formData: Fiesta) {
    return this.http.post(`${base_url}/fiestas`, formData, this.headers)
  }


  isActivedFiesta(fiesta: Fiesta) {
    const url = `${base_url}/fiestas/isActive/${fiesta.uid}`
    const data = {
      ...fiesta,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarFiesta(fiesta: Fiesta) {
    const url = `${base_url}/fiestas/${fiesta.uid}`
    const data = {
      ...fiesta,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarFiestaByUsr(fiesta: Fiesta) {
    const url = `${base_url}/fiestas/usuario/${fiesta.uid}`
    const data = {
      ...fiesta,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarFiestaById(id: string) {
    const url = `${base_url}/fiestas/${id}`
    return this.http.get<CargarFiesta>(url, this.headers)
  }

  cargarFiestasByEmail(email: string) {
    const url = `${base_url}/fiestas/email/${email}`
    return this.http.get<CargarFiestas>(url, this.headers)
  }
  cargarFiestasByanfitrion(uid: string) {
    const url = `${base_url}/fiestas/anfitrion/${uid}`

    return this.http.get<CargarFiestas>(url, this.headers)
  }
  cargarFiestasBySalon(uid: string) {
    const url = `${base_url}/fiestas/salon/${uid}`
    return this.http.get<CargarFiestas>(url, this.headers)
  }
}
