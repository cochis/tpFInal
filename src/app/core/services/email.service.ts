import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'


import { map } from 'rxjs';
import { Boleto } from 'src/app/core/models/boleto.model';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class EmailsService {

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

  sendMail(data: any) {
    return this.http.post(`${base_url}/email`, data, this.headers)
  }
  reSendMail(data: any) {
    return this.http.post(`${base_url}/email/resend`, data, this.headers)
  }
  sendMailByBoleto(data: any) {
    return this.http.post(`${base_url}/email/byBoleto/${data.uid}`, data, this.headers)
  }




}
