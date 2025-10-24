import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { ModuloTemplatesService } from 'src/app/core/services/moduloTemplates.service';
import { ModuloTemplate } from 'src/app/core/models/moduloTemplate.model';
import { CargarModuloTemplates, CargarTipoModulos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { TipoModulosService } from 'src/app/core/services/tipoModulos.service';
import { TipoModulo } from 'src/app/core/models/tipoModulo.model';
import { ModalService } from '@developer-partners/ngx-modal-dialog';
import { Diseno } from 'src/app/core/models/diseno.model';
import { DisenoModalComponent } from 'src/app/shared/components/modals/diseno-modal/diseno-modal.component';
import { CssModalComponent } from 'src/app/shared/components/modals/css-modal/css-modal.component';
import { Css } from 'src/app/core/models/css.model';
@Component({
  selector: 'app-vista-modulo-templates',
  templateUrl: './vista-modulo-templates.component.html',
  styleUrls: ['./vista-modulo-templates.component.scss']
})
export class VistaModuloTemplatesComponent {
  data!: any
  moduloTemplates: ModuloTemplate[]
  moduloTemplatesTemp: ModuloTemplate[]
  loading = false
  url = environment.base_url
  ADM = environment.admin_role
  ANF = environment.anf_role
  SLN = environment.salon_role
  URS = environment.user_role
  rol = this.functionsService.getLocal('role')
  tipoModulos: TipoModulo[]

  constructor(
    private functionsService: FunctionsService,

    private busquedasService: BusquedasService,

    private moduloTemplatesService: ModuloTemplatesService,
    private tipoModulosService: TipoModulosService,
    private _modalService: ModalService
  ) {
    this.getModuloTemplates()
    this.getCatalogos()
  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.moduloTemplates = this.moduloTemplatesTemp
        return
      }
      this.busquedasService.buscar('moduloTemplates', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.moduloTemplates = resp


        this.setModuloTemplates()
      })

    }, 500);
  }
  getCatalogos() {
    this.loading = true

    this.tipoModulosService.cargarTipoModulosAll().subscribe((resp: CargarTipoModulos) => {
      this.tipoModulos = resp.tipoModulos
    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'Tipo de modulos')
        this.loading = false
      })

  }
  getCatalog(tipo: string, id: string) {
    switch (tipo) {


      case 'tipoModulos':

        if (id !== undefined) return this.functionsService.getValueCatalog(id, 'nombre', this.tipoModulos)
        break;

    }

  }

  showModal(type, data) {

    switch (type) {
      case 'diseno':
        this._modalService.show<Diseno>(DisenoModalComponent, {
          title: 'Ver Diseño',
          size: 1,
          model: data,
          mode: 'fullScreen'
        })

        break;
      case 'css':
        this._modalService.show<Css>(CssModalComponent, {
          title: 'Ver CSS',
          size: 1,
          model: data,
          mode: 'fullScreen'
        })

        break;

      default:
        break;
    }

  }
  setModuloTemplates() {
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
  getModuloTemplates() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.moduloTemplatesService.cargarModuloTemplatesAll().subscribe((resp: CargarModuloTemplates) => {

        this.moduloTemplates = resp.moduloTemplates


        this.moduloTemplatesTemp = resp.moduloTemplates
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          console.error('Error', error)
          this.loading = false
          this.functionsService.alertError(error, 'ModuloTemplates')
        });
    }
  }

  editModuloTemplate(id: string) {

    this.functionsService.navigateTo(`/core/modulo-templates/editar-modulo-template/true/${id}`)

  }
  isActived(moduloTemplate: ModuloTemplate) {

    this.moduloTemplatesService.isActivedModuloTemplate(moduloTemplate).subscribe((resp: any) => {
      this.getModuloTemplates()


    },
      (error: any) => {
        console.error('Error', error)
        this.functionsService.alertError(error, 'ModuloTemplates')

      })
  }
  viewModuloTemplate(id: string) {
    this.functionsService.navigateTo(`/core/modulo-templates/editar-modulo-template/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newModuloTemplate() {

    this.functionsService.navigateTo('modulo-templates/crear-modulo-template')
  }

}
