import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarTemplates, CargarTemplate } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Template } from 'src/app/core/models/template.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

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

  cargarTemplatesInit() {
    const url = `${base_url}/templates/all`
    return this.http.get<CargarTemplates>(url, this.headers).pipe(
      map((resp) => {
        const templates = resp.templates.map(
          (template) =>
            new Template(

              template.nombre,
              template.evento,
              template.modulos,
              template.usuarioCreated,
              template.activated,
              template.dateCreated,
              template.lastEdited,
              template.uid,
            ),
        )
        return {
          total: templates.length,
          templates,
        }
      }),
    )
  }
  cargarTemplatesAll() {
    const url = `${base_url}/templates/all`
    return this.http.get<CargarTemplates>(url, this.headers).pipe(
      map((resp) => {
        const templates = resp.templates.map(
          (template) =>
            new Template(

              template.nombre,
              template.evento,
              template.modulos,
              template.usuarioCreated,
              template.activated,
              template.dateCreated,
              template.lastEdited,
              template.uid,

            ),
        )
        return {
          total: templates.length,
          templates,
        }
      }),
    )
  }
  cargarTemplatesSalon() {
    const url = `${base_url}/templates/all/salon`
    return this.http.get<CargarTemplates>(url, this.headers).pipe(
      map((resp) => {
        const templates = resp.templates.map(
          (template) =>
            new Template(

              template.nombre,
              template.evento,
              template.modulos,
              template.usuarioCreated,
              template.activated,
              template.dateCreated,
              template.lastEdited,
              template.uid,
            ),
        )
        return {
          total: templates.length,
          templates,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarTemplates>(url, this.headers).pipe(
      map((resp) => {
        const templates = resp.templates.map(
          (template) =>
            new Template(

              template.nombre,
              template.evento,
              template.modulos,
              template.usuarioCreated,
              template.activated,
              template.dateCreated,
              template.lastEdited,
              template.uid,
            ),
        )
        return {
          total: templates.length,
          templates,
        }
      }),
    )
  }
  crearTemplate(formData: Template) {
    return this.http.post(`${base_url}/templates`, formData, this.headers)
  }


  isActivedTemplate(template: Template) {
    const url = `${base_url}/templates/isActive/${template.uid}`
    const data = {
      ...template,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarTemplate(template: Template) {
    const url = `${base_url}/templates/${template.uid}`
    const data = {
      ...template,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarTemplateById(id: string) {
    const url = `${base_url}/templates/${id}`
    return this.http.get<CargarTemplate>(url, this.headers)
  }
  cargarTemplateByClave(clave: string) {
    const url = `${base_url}/templates/clave/${clave}`
    return this.http.get<CargarTemplate>(url, this.headers)
  }

}
