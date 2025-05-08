import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { MailTemplatesService } from 'src/app/core/services/mailTemplate.service';
import { MailTemplate } from 'src/app/core/models/mailTemplate.model';
import { CargarMailTemplates } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-vista-email-templates',
  templateUrl: './vista-email-templates.component.html',
  styleUrls: ['./vista-email-templates.component.scss']
})
export class VistaEmailTemplatesComponent {
  data!: any
  mailTemplates: MailTemplate[]
  mailTemplatesTemp: MailTemplate[]
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

    private mailTemplatesService: MailTemplatesService
  ) {
    this.getMailTemplates()

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




  setMailTemplates() {
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
  getMailTemplates() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.mailTemplatesService.cargarMailTemplatesAll().subscribe((resp: CargarMailTemplates) => {
        this.mailTemplates = resp.mailTemplates
        this.mailTemplatesTemp = resp.mailTemplates
        setTimeout(() => {
          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'MailTemplates')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.mailTemplatesService.cargarMailTemplatesByEmail(usr).subscribe((resp: CargarMailTemplates) => {
        this.mailTemplates = resp.mailTemplates
        this.mailTemplatesTemp = resp.mailTemplates
        setTimeout(() => {
          this.loading = false
        }, 1500);
      });
    }
  }
  editMailTemplate(id: string) {
    this.functionsService.navigateTo(`/core/email-templates/editar-email-template/true/${id}`)
  }
  isActived(mailTemplate: MailTemplate) {
    this.mailTemplatesService.isActivedMailTemplate(mailTemplate).subscribe((resp: any) => {
      this.getMailTemplates()
    },
      (error: any) => {
        this.functionsService.alertError(error, 'MailTemplates')
      })
  }
  viewMailTemplate(id: string) {
    this.functionsService.navigateTo(`/core/email-templates/editar-email-template/false/${id}`)
  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newMailTemplate() {
    this.functionsService.navigateTo('core/email-templates/crear-email-template')
  }
}
