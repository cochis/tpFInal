import { Component } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { EventosService } from 'src/app/core/services/evento.service';
import { Evento } from 'src/app/core/models/evento.model';
import { CargarEventos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';


@Component({
  selector: 'app-vista-eventos',
  templateUrl: './vista-eventos.component.html',
  styleUrls: ['./vista-eventos.component.scss']
})
export class VistaEventosComponent {
  data!: any
  eventos: Evento[]
  eventosTemp: Evento[]
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

    private eventosService: EventosService
  ) {
    this.getEventos()

  }

  buscar(termino) {
    termino = termino.toLowerCase()
    if (termino.length === 0) {
      this.eventos = this.eventosTemp
      return
    }
    termino = termino.trim().toLowerCase()
    setTimeout(() => {
      this.functionsService.filterBy(termino, this.eventosTemp)
      this.eventos = this.functionsService.filterBy(termino, this.eventosTemp)
    }, 500);
  }




  setEventos() {
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
  getEventos() {
    this.loading = true
    if (this.rol === this.ADM) {
      this.eventosService.cargarEventosAll().subscribe((resp: CargarEventos) => {

        this.eventos = resp.eventos
        this.eventosTemp = resp.eventos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      },
        (error) => {
          this.loading = false
          this.functionsService.alertError(error, 'Eventos')
        });
    } else if (this.rol === this.SLN || this.rol == this.ANF) {
      let usr = this.functionsService.getLocal('uid')
      this.eventosService.cargarEventosByEmail(usr).subscribe((resp: CargarEventos) => {

        this.eventos = resp.eventos
        this.eventosTemp = resp.eventos
        setTimeout(() => {

          this.loading = false
        }, 1500);
      });
    }
  }

  editEvento(id: string) {

    this.functionsService.navigateTo(`/eventos/editar-evento/true/${id}`)

  }
  isActived(evento: Evento) {

    this.eventosService.isActivedEvento(evento).subscribe((resp: any) => {
      this.getEventos()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Eventos')

      })
  }
  viewEvento(id: string) {
    this.functionsService.navigateTo(`/eventos/editar-evento/false/${id}`)

  }
  stopLoading() {
    setTimeout(() => {
      this.loading = false
    }, 3000);
  }
  newEvento() {

    this.functionsService.navigateTo('eventos/crear-evento')
  }

}
