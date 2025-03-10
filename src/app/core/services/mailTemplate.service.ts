import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { MailTemplate } from 'src/app/core/models/mailTemplate.model';
import { CargarMailTemplate, CargarMailTemplates } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class MailTemplatesService {

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

  cargarMailTemplatesAll() {
    const url = `${base_url}/mail-templates/all`
    return this.http.get<CargarMailTemplates>(url, this.headers).pipe(
      map((resp) => {
        const mailTemplates = resp.mailTemplates.map(
          (eve) =>
            new MailTemplate(
              eve.nombre,
              eve.clave,
              eve.email,
              eve.usuarioCreated,
              eve.activated,
              eve.dateCreated,
              eve.lastEdited,
              eve.uid,

            ),
        )
        return {
          total: mailTemplates.length,
          mailTemplates,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/mail-templates?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarMailTemplates>(url, this.headers).pipe(
      map((resp) => {
        const mailTemplates = resp.mailTemplates.map(
          (rol) =>
            new MailTemplate(
              rol.nombre,
              rol.clave,
              rol.email,
              rol.usuarioCreated,
              rol.activated,
              rol.dateCreated,
              rol.lastEdited,
              rol.uid,
            ),
        )
        return {
          total: mailTemplates.length,
          mailTemplates,
        }
      }),
    )
  }
  crearMailTemplate(formData: MailTemplate) {
    return this.http.post(`${base_url}/mail-templates`, formData, this.headers)
  }


  isActivedMailTemplate(mailTemplate: MailTemplate) {
    const url = `${base_url}/mail-templates/isActive/${mailTemplate.uid}`
    const data = {
      ...mailTemplate,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarMailTemplate(mailTemplate: MailTemplate) {
    const url = `${base_url}/mail-templates/${mailTemplate.uid}`
    const data = {
      ...mailTemplate,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarMailTemplateById(id: string) {
    const url = `${base_url}/mail-templates/${id}`
    return this.http.get<CargarMailTemplate>(url, this.headers)
  }
  cargarMailTemplatesByEmail(email: string) {
    const url = `${base_url}/mail-templates/email/${email}`
    return this.http.get<CargarMailTemplates>(url, this.headers)
  }
}
