import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { CargarBoletos, CargarBoleto } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { map } from 'rxjs';
import { Boleto } from 'src/app/core/models/boleto.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class BoletosService {

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

  cargarBoletosAll() {
    const url = `${base_url}/boletos/all`
    return this.http.get<CargarBoletos>(url, this.headers).pipe(
      map((resp) => {
        const boletos = resp.boletos.map(
          (bol) =>
            new Boleto(

              bol.fiesta,
              bol.email,
              bol.cantidadInvitados,
              bol.mesa,
              bol.grupo,
              bol.salon,
              bol.nombreGrupo,
              bol.whatsapp,
              bol.confirmado,
              bol.invitacionEnviada,
              bol.activated,
              bol.ocupados,
              bol.vista,
              bol.pushNotification,
              bol.dateCreated,
              bol.usuarioCreated,
              bol.fechaConfirmacion,
              bol.lastEdited,
              bol.uid,


            ),
        )
        return {
          total: boletos.length,
          boletos,
        }
      }),
    )
  }

  crearBoleto(formData: Boleto) {

    return this.http.post(`${base_url}/boletos`, formData, this.headers)
  }


  isActivedBoleto(boleto: Boleto) {
    const url = `${base_url}/boletos/isActive/${boleto.uid}`
    const data = {
      ...boleto,
      lastEdited: Date.now(),
    }
    return this.http.put(url, data, this.headers)
  }
  actualizarBoleto(boleto: Boleto) {
    const url = `${base_url}/boletos/${boleto.uid}`

    const data = {
      ...boleto,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }
  actualizarBoletoRegistro(boleto: Boleto) {
    const url = `${base_url}/boletos/registro/${boleto.uid}`


    const data = {
      ...boleto,
      lastEdited: Date.now(),
    }


    return this.http.post(url, data, this.headers)
  }
  registrarPushNotification(boleto: Boleto) {
    // console.log('boleto::: ', boleto);
    const url = `${base_url}/boletos/registrar-push-notification/${boleto.uid}`

    const data = {
      ...boleto,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }
  registrarAsistencia(boleto: Boleto) {
    // console.log('boleto::: ', boleto);
    const url = `${base_url}/boletos/registrar-asistencias/${boleto.uid}`

    const data = {
      ...boleto,
      lastEdited: Date.now(),
    }

    return this.http.put(url, data, this.headers)
  }

  cargarBoletoById(id: string) {
    const url = `${base_url}/boletos/${id}`
    return this.http.get<CargarBoleto>(url, this.headers)
  }
  cargarBoletoByFiesta(id: string) {
    const url = `${base_url}/boletos/fiesta/${id}`

    return this.http.get<CargarBoleto>(url, this.headers)
  }
  confirmaBoletoFiesta(id: string) {
    const url = `${base_url}/boletos/confirma-fiesta/${id}`
    return this.http.get<CargarBoleto>(url, this.headers)
  }

  cargarEventosByEmail(email: string) {
    const url = `${base_url}/boletos/email/${email}`
    return this.http.get<CargarBoletos>(url, this.headers)
  }

}
