import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { Evento } from 'src/app/core/models/evento.model';
import { CargarEvento, CargarEventos } from '../interfaces/cargar-interfaces.interfaces';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EventosService {

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

  cargarEventosAll() {
    const url = `${base_url}/eventos/all`
    return this.http.get<CargarEventos>(url, this.headers).pipe(
      map((resp) => {
        const eventos = resp.eventos.map(
          (eve) =>
            new Evento(
              eve.nombre,
              eve.clave,
              eve.usuarioCreated,
              eve.activated,
              eve.dateCreated,
              eve.lastEdited,
              eve.uid,

            ),
        )
        return {
          total: eventos.length,
          eventos,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/eventos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarEventos>(url, this.headers).pipe(
      map((resp) => {
        const eventos = resp.eventos.map(
          (rol) =>
            new Evento(
              rol.nombre,
              rol.clave,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: eventos.length,
          eventos,
        }
      }),
    )
  }
  crearEvento(formData: Evento) {
    return this.http.post(`${base_url}/eventos`, formData, this.headers)
  }


  isActivedEvento(evento: Evento) {
    const url = `${base_url}/eventos/isActive/${evento.uid}`
    const data = {
      ...evento,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarEvento(evento: Evento) {
    const url = `${base_url}/eventos/${evento.uid}`
    const data = {
      ...evento,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarEventoById(id: string) {
    const url = `${base_url}/eventos/${id}`
    return this.http.get<CargarEvento>(url, this.headers)
  }
  cargarEventosByEmail(email: string) {
    const url = `${base_url}/eventos/email/${email}`
    return this.http.get<CargarEventos>(url, this.headers)
  }
}
