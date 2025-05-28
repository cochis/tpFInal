import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'



import { map } from 'rxjs';
import { EmailTemplate } from 'src/app/core/models/emailTemplate.model';
import { CargarEmailTemplate, CargarEmailTemplates } from '../interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EmailTemplatesService {

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

  cargarEmailTemplatesAll() {
    const url = `${base_url}/emailTemplates/all`
    return this.http.get<CargarEmailTemplates>(url, this.headers).pipe(
      map((resp) => {
        const emailTemplates = resp.emailTemplates.map(
          (emt) =>
            new EmailTemplate(
              emt.nombre,
              emt.clave,
              emt.descripcion,
              emt.template,
              emt.usuarioCreated,
              emt.activated,
              emt.dateCreated,
              emt.lastEdited,
              emt.uid,

            ),
        )
        return {
          total: emailTemplates.length,
          emailTemplates,
        }
      }),
    )
  }
  cargarAlumnos(desde: number = 0, cantidad: number = 10) {
    const url = `${base_url}/emailTemplates?desde=${desde}&cant=${cantidad}`
    return this.http.get<CargarEmailTemplates>(url, this.headers).pipe(
      map((resp) => {
        const emailTemplates = resp.emailTemplates.map(
          (emt) =>
            new EmailTemplate(
              emt.nombre,
              emt.clave,
              emt.descripcion,
              emt.template,
              emt.usuarioCreated,
              emt.activated,
              emt.dateCreated,
              emt.lastEdited,
              emt.uid,
            ),
        )
        return {
          total: emailTemplates.length,
          emailTemplates,
        }
      }),
    )
  }
  crearEmailTemplate(formData: EmailTemplate) {
    return this.http.post(`${base_url}/emailTemplates`, formData, this.headers)
  }


  isActivedEmailTemplate(emailTemplate: EmailTemplate) {
    const url = `${base_url}/emailTemplates/isActive/${emailTemplate.uid}`
    const data = {
      ...emailTemplate,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarEmailTemplate(emailTemplate: EmailTemplate) {
    const url = `${base_url}/emailTemplates/${emailTemplate.uid}`
    const data = {
      ...emailTemplate,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }

  cargarEmailTemplateById(id: string) {
    const url = `${base_url}/emailTemplates/${id}`
    return this.http.get<CargarEmailTemplate>(url, this.headers)
  }
  cargarEmailTemplatesByEmail(email: string) {
    const url = `${base_url}/emailTemplates/email/${email}`
    return this.http.get<CargarEmailTemplates>(url, this.headers)
  }
}
