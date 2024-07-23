import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarModuloTemplates, CargarModuloTemplate } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { ModuloTemplate } from 'src/app/core/models/moduloTemplate.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ModuloTemplatesService {

  constructor(private http: HttpClient,) { }
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

  cargarModuloTemplatesInit() {
    const url = `${base_url}/moduloTemplates/all`
    return this.http.get<CargarModuloTemplates>(url, this.headers).pipe(
      map((resp) => {
        const moduloTemplates = resp.moduloTemplates.map(
          (moduloTemplate) =>
            new ModuloTemplate(
              moduloTemplate.nombre,
              moduloTemplate.tipoModulo,
              moduloTemplate.values,
              moduloTemplate.diseno,
              moduloTemplate.css,
              moduloTemplate.usuarioCreated,
              moduloTemplate.activated,
              moduloTemplate.dateCreated,
              moduloTemplate.lastEdited,
              moduloTemplate.uid
            ),
        )
        return {
          total: moduloTemplates.length,
          moduloTemplates,
        }
      }),
    )
  }
  cargarModuloTemplatesAll() {
    const url = `${base_url}/moduloTemplates/all`
    return this.http.get<CargarModuloTemplates>(url, this.headers).pipe(
      map((resp) => {
        const moduloTemplates = resp.moduloTemplates.map(
          (moduloTemplate) =>
            new ModuloTemplate(

              moduloTemplate.nombre,
              moduloTemplate.tipoModulo,
              moduloTemplate.values,
              moduloTemplate.diseno,
              moduloTemplate.css,
              moduloTemplate.usuarioCreated,
              moduloTemplate.activated,
              moduloTemplate.dateCreated,
              moduloTemplate.lastEdited,
              moduloTemplate.uid

            ),
        )
        return {
          total: moduloTemplates.length,
          moduloTemplates,
        }
      }),
    )
  }
  cargarModuloTemplatesSalon() {
    const url = `${base_url}/moduloTemplates/all/salon`
    return this.http.get<CargarModuloTemplates>(url, this.headers).pipe(
      map((resp) => {
        const moduloTemplates = resp.moduloTemplates.map(
          (moduloTemplate) =>
            new ModuloTemplate(

              moduloTemplate.nombre,
              moduloTemplate.tipoModulo,
              moduloTemplate.values,
              moduloTemplate.diseno,
              moduloTemplate.css,
              moduloTemplate.usuarioCreated,
              moduloTemplate.activated,
              moduloTemplate.dateCreated,
              moduloTemplate.lastEdited,
              moduloTemplate.uid
            ),
        )
        return {
          total: moduloTemplates.length,
          moduloTemplates,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/alumnos?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarModuloTemplates>(url, this.headers).pipe(
      map((resp) => {
        const moduloTemplates = resp.moduloTemplates.map(
          (moduloTemplate) =>
            new ModuloTemplate(

              moduloTemplate.nombre,
              moduloTemplate.tipoModulo,
              moduloTemplate.values,
              moduloTemplate.diseno,
              moduloTemplate.css,
              moduloTemplate.usuarioCreated,
              moduloTemplate.activated,
              moduloTemplate.dateCreated,
              moduloTemplate.lastEdited,
              moduloTemplate.uid
            ),
        )
        return {
          total: moduloTemplates.length,
          moduloTemplates,
        }
      }),
    )
  }
  crearModuloTemplate(formData: ModuloTemplate) {
    return this.http.post(`${base_url}/moduloTemplates`, formData, this.headers)
  }


  isActivedModuloTemplate(moduloTemplate: ModuloTemplate) {
    const url = `${base_url}/moduloTemplates/isActive/${moduloTemplate.uid}`
    const data = {
      ...moduloTemplate,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarModuloTemplate(moduloTemplate: ModuloTemplate) {
    const url = `${base_url}/moduloTemplates/${moduloTemplate.uid}`
    const data = {
      ...moduloTemplate,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarModuloTemplateById(id: string) {
    const url = `${base_url}/moduloTemplates/${id}`
    return this.http.get<CargarModuloTemplate>(url, this.headers)
  }
  cargarModuloTemplateByClave(clave: string) {
    const url = `${base_url}/moduloTemplates/clave/${clave}`
    return this.http.get<CargarModuloTemplate>(url, this.headers)
  }

}
