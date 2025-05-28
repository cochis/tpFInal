import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
 
import { CargarEmailTemplates } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EmailTemplate } from 'src/app/core/models/emailTemplate.model';
import { EmailTemplatesService } from 'src/app/core/services/emailTemplate.service';


@Component({
  selector: 'app-vista-email-templates',
  templateUrl: './vista-email-templates.component.html',
  styleUrls: ['./vista-email-templates.component.scss']
})
export class VistaEmailTemplatesComponent {
  data!: any
  mailTemplates: EmailTemplate[]
  mailTemplatesTemp: EmailTemplate[]
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')


  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,

    private emailTemplatesService: EmailTemplatesService
  ) {
    this.getEmailTemplates()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.mailTemplates = this.mailTemplatesTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.mailTemplatesTemp)
      this.mailTemplates = this.functionsService.filterBy(termino, this.mailTemplatesTemp)
    }, 500);
  }




  setEmailTemplates() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getEmailTemplates() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.emailTemplatesService.cargarEmailTemplatesAll().subscribe((resp: CargarEmailTemplates) => {
        this.mailTemplates = resp.emailTemplates
        this.mailTemplatesTemp = resp.emailTemplates
        setTimeout(() => {
          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'EmailTemplates')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.emailTemplatesService.cargarEmailTemplatesByEmail(usr).subscribe((resp: CargarEmailTemplates) => {
        this.mailTemplates = resp.emailTemplates
        this.mailTemplatesTemp = resp.emailTemplates
        setTimeout(() => {
          this.loading = false
        }, 1500);
      });
    }
  }
  editEmailTemplate(id: string) {
    this.functionsService.navigateTo(`/core/email-templates/editar-email-template/true/${id}`)
  }
  isActived(mailTemplate: EmailTemplate) {
    this.emailTemplatesService.isActivedEmailTemplate(mailTemplate).subscribe((resp: any) => {
      this.getEmailTemplates()
    },
      (error: any) => {
        this.functionsService.alertError(error, 'EmailTemplates')
      })
  }
  viewEmailTemplate(id: string) {
    this.functionsService.navigateTo(`/core/email-templates/editar-email-template/false/${id}`)
  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newEmailTemplate() {
    this.functionsService.navigateTo('core/email-templates/crear-email-template')
  }
}
